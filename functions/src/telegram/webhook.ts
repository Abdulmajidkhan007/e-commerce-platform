import { onRequest } from "firebase-functions/v2/https";
import { webhookCallback } from "grammy";
import {
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_GROUP_CHAT_ID,
  TELEGRAM_WEBHOOK_SECRET,
  TELEGRAM_ADMIN_USER_IDS,
} from "../lib/env";
import { createBot, parseBotAdminIds } from "./bot";

export const telegramWebhook = onRequest(
  {
    secrets: [
      TELEGRAM_BOT_TOKEN,
      TELEGRAM_GROUP_CHAT_ID,
      TELEGRAM_WEBHOOK_SECRET,
      TELEGRAM_ADMIN_USER_IDS,
    ],
    region: "us-central1",
    minInstances: 0,
  },
  async (req, res) => {
    const token = TELEGRAM_BOT_TOKEN.value();
    const groupChatId = TELEGRAM_GROUP_CHAT_ID.value();
    const webhookSecret = TELEGRAM_WEBHOOK_SECRET.value();
    const adminIds = parseBotAdminIds(TELEGRAM_ADMIN_USER_IDS.value());

    /* Webhook secret token tekshiruvi */
    const secretHeader = req.headers["x-telegram-bot-api-secret-token"];
    if (webhookSecret && secretHeader !== webhookSecret) {
      res.status(403).send("Ruxsat yo'q");
      return;
    }

    const bot = createBot(token, adminIds, groupChatId);
    const handler = webhookCallback(bot, "https");

    try {
      await handler(req, res);
    } catch (err) {
      console.error("Webhook xatosi:", err);
      res.status(500).send("Ichki xato");
    }
  }
);
