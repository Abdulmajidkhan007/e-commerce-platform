import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { TELEGRAM_BOT_TOKEN, TELEGRAM_GROUP_CHAT_ID } from "../lib/env";
import { getBot, sendToGroup, lowStockTemplate } from "../telegram/notify";

export const onProductWrite = onDocumentWritten(
  {
    document: "products/{productId}",
    secrets: [TELEGRAM_BOT_TOKEN, TELEGRAM_GROUP_CHAT_ID],
  },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    if (!after) return; // O'chirilgan

    const prevStock = before?.["stock"] as number | undefined;
    const newStock = after["stock"] as number;
    const threshold = after["lowStockThreshold"] as number;
    const productName = after["name"] as string;
    const sku = after["sku"] as string;
    const isActive = after["isActive"] as boolean;

    if (!isActive) return;

    /* Chegara ostiga tushgan holat (yoki nolga yetgan) */
    const wasOkay = prevStock === undefined || prevStock > threshold;
    const isNowLow = newStock <= threshold;
    const isNowZero = newStock === 0;
    const wasNotZero = prevStock !== 0;

    if (!wasOkay && !isNowZero) return; // Allaqachon ogohlantirish yuborilgan, nol emas
    if (!isNowLow && !isNowZero) return;
    if (prevStock === newStock) return; // O'zgarmagan

    /* Faqat chegara kesib o'tilganda yoki nol bo'lganda xabar yuborish */
    const shouldNotify =
      (isNowZero && wasNotZero) || (isNowLow && wasOkay);

    if (!shouldNotify) return;

    try {
      const token = TELEGRAM_BOT_TOKEN.value();
      const chatId = TELEGRAM_GROUP_CHAT_ID.value();
      if (!token || !chatId) return;

      const bot = getBot(token);
      await sendToGroup(
        bot,
        chatId,
        lowStockTemplate(productName, sku, newStock, threshold)
      );
    } catch (err) {
      console.error("Telegram low-stock xabari yuborishda xato:", err);
    }
  }
);
