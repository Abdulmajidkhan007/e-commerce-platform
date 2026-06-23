import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { adminDb } from "../lib/admin";
import { TELEGRAM_BOT_TOKEN, TELEGRAM_GROUP_CHAT_ID } from "../lib/env";
import { getBot, editGroupMessage, orderStatusTemplate } from "../telegram/notify";

export const onOrderStatusChanged = onDocumentUpdated(
  {
    document: "orders/{orderId}",
    secrets: [TELEGRAM_BOT_TOKEN, TELEGRAM_GROUP_CHAT_ID],
  },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;

    const oldStatus = before["status"] as string;
    const newStatus = after["status"] as string;

    /* Holat o'zgarmagan bo'lsa — ishlamaymiz */
    if (oldStatus === newStatus) return;

    const orderId = event.params["orderId"];

    /* Stats yangilash */
    try {
      const statsRef = adminDb.collection("stats").doc("aggregates");
      const statsDoc = await statsRef.get();
      const statsData = statsDoc.exists ? statsDoc.data() ?? {} : {};
      const statusCounts = (statsData["statusCounts"] ?? {}) as Record<string, number>;

      const updates: Record<string, number> = {};
      if (statusCounts[oldStatus] !== undefined) {
        updates[`statusCounts.${oldStatus}`] = Math.max(0, (statusCounts[oldStatus] ?? 1) - 1);
      }
      updates[`statusCounts.${newStatus}`] = ((statusCounts[newStatus] ?? 0) + 1);

      if (statsDoc.exists) {
        await statsRef.update({ ...updates, updatedAt: new Date() });
      } else {
        await statsRef.set({ statusCounts: { [newStatus]: 1 }, updatedAt: new Date() });
      }
    } catch (err) {
      console.error("Stats yangilashda xato:", err);
    }

    /* Telegram xabarini tahrirlash */
    try {
      const token = TELEGRAM_BOT_TOKEN.value();
      const chatId = TELEGRAM_GROUP_CHAT_ID.value();
      if (!token || !chatId) return;

      const telegramMessageId = after["telegramMessageId"] as number | undefined;
      if (!telegramMessageId) return;

      const customer = after["customer"] as { firstName: string; lastName: string };
      const customerName = `${customer.firstName} ${customer.lastName}`.trim();

      const bot = getBot(token);
      await editGroupMessage(
        bot,
        chatId,
        telegramMessageId,
        orderStatusTemplate(orderId, newStatus, customerName)
      );
    } catch (err) {
      console.error("Telegram xabar tahrirlashda xato:", err);
    }
  }
);
