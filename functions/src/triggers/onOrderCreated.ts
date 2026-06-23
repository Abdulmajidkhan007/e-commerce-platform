import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../lib/admin";
import { TELEGRAM_BOT_TOKEN, TELEGRAM_GROUP_CHAT_ID } from "../lib/env";
import { getBot, sendToGroup, newOrderTemplate } from "../telegram/notify";
import { orderActionsKeyboard } from "../telegram/keyboards";

export const onOrderCreated = onDocumentCreated(
  {
    document: "orders/{orderId}",
    secrets: [TELEGRAM_BOT_TOKEN, TELEGRAM_GROUP_CHAT_ID],
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const orderId = event.params["orderId"];

    /* 1. Har bir mahsulot zaxirasini kamaytirish */
    const items = (data["items"] ?? []) as Array<{
      productId: string;
      qty: number;
    }>;

    const batch = adminDb.batch();
    for (const item of items) {
      const productRef = adminDb.collection("products").doc(item.productId);
      batch.update(productRef, {
        stock: FieldValue.increment(-item.qty),
        soldCount: FieldValue.increment(item.qty),
        updatedAt: new Date(),
      });
    }
    await batch.commit();

    /* 2. Telegram guruhga xabar yuborish */
    try {
      const token = TELEGRAM_BOT_TOKEN.value();
      const chatId = TELEGRAM_GROUP_CHAT_ID.value();
      if (!token || !chatId) return;

      const bot = getBot(token);
      const message = newOrderTemplate({
        id: orderId,
        customer: data["customer"] as {
          firstName: string;
          lastName: string;
          phone: string;
          address: string;
        },
        items: data["items"] as Array<{
          name: string;
          qty: number;
          unitPrice: number;
        }>,
        total: data["total"] as number,
        payment: data["payment"] as { method: string; depositAmount: number },
      });

      const keyboard = orderActionsKeyboard(orderId);
      const messageId = await sendToGroup(bot, chatId, message, {
        replyMarkup: keyboard,
      });

      /* Telegram xabar ID ni saqlash */
      if (messageId) {
        await adminDb.collection("orders").doc(orderId).update({
          telegramMessageId: messageId,
          updatedAt: new Date(),
        });
      }
    } catch (err) {
      console.error("Telegram xabar yuborishda xato:", err);
    }
  }
);
