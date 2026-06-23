import { defineSecret } from "firebase-functions/params";
import { z } from "zod";

/* Functions secrets — firebase functions:secrets:set NAME orqali o'rnating */
export const TELEGRAM_BOT_TOKEN = defineSecret("TELEGRAM_BOT_TOKEN");
export const TELEGRAM_GROUP_CHAT_ID = defineSecret("TELEGRAM_GROUP_CHAT_ID");
export const TELEGRAM_WEBHOOK_SECRET = defineSecret("TELEGRAM_WEBHOOK_SECRET");
export const TELEGRAM_ADMIN_USER_IDS = defineSecret("TELEGRAM_ADMIN_USER_IDS");
export const ADMIN_EMAIL = defineSecret("ADMIN_EMAIL");

/* Runtime validatsiya */
const envSchema = z.object({
  telegramBotToken: z.string().min(1),
  telegramGroupChatId: z.string().min(1),
  telegramWebhookSecret: z.string().min(1),
  adminEmail: z.string().email(),
});

export type ValidatedEnv = z.infer<typeof envSchema>;

export function validateEnv(raw: Record<string, string>): ValidatedEnv {
  const result = envSchema.safeParse({
    telegramBotToken: raw["TELEGRAM_BOT_TOKEN"],
    telegramGroupChatId: raw["TELEGRAM_GROUP_CHAT_ID"],
    telegramWebhookSecret: raw["TELEGRAM_WEBHOOK_SECRET"],
    adminEmail: raw["ADMIN_EMAIL"],
  });

  if (!result.success) {
    throw new Error(`Muhit o'zgaruvchilari xato: ${JSON.stringify(result.error.flatten())}`);
  }

  return result.data;
}

export function parseAdminUserIds(raw: string | undefined): number[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !isNaN(n));
}
