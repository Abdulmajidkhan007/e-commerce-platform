import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { TELEGRAM_BOT_TOKEN, TELEGRAM_GROUP_CHAT_ID } from "../lib/env";
import { getBot, sendToGroup, newContactTemplate } from "../telegram/notify";

export const onContactCreated = onDocumentCreated(
  {
    document: "contactMessages/{id}",
    secrets: [TELEGRAM_BOT_TOKEN, TELEGRAM_GROUP_CHAT_ID],
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    try {
      const token = TELEGRAM_BOT_TOKEN.value();
      const chatId = TELEGRAM_GROUP_CHAT_ID.value();
      if (!token || !chatId) return;

      const bot = getBot(token);
      await sendToGroup(
        bot,
        chatId,
        newContactTemplate(
          data["name"] as string,
          data["email"] as string,
          data["message"] as string
        )
      );
    } catch (err) {
      console.error("Telegram aloqa xabari yuborishda xato:", err);
    }
  }
);
