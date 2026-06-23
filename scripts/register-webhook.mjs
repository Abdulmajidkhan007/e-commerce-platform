#!/usr/bin/env node
/**
 * Telegram webhook ro'yxatdan o'tkazish skripti
 *
 * Ishlatish:
 *   node scripts/register-webhook.mjs
 *
 * Kerakli muhit o'zgaruvchilari (.env yoki shell):
 *   TELEGRAM_BOT_TOKEN        — @BotFather dan olingan token
 *   FIREBASE_PROJECT_ID       — Firebase project ID
 *   TELEGRAM_WEBHOOK_SECRET   — ixtiyoriy maxfiy so'z (tavsiya etiladi)
 *
 * Cloud Function URL shakli:
 *   https://us-central1-<PROJECT_ID>.cloudfunctions.net/telegramWebhook
 *
 * Bugun ro'yxatdan o'tgan webhook holatini ko'rish uchun:
 *   node scripts/register-webhook.mjs --info
 *
 * Webhook o'chirish:
 *   node scripts/register-webhook.mjs --delete
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

/* .env faylini yuklash (agar mavjud bo'lsa) */
const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (key && value && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!BOT_TOKEN) {
  console.error("❌  TELEGRAM_BOT_TOKEN o'rnatilmagan");
  process.exit(1);
}
if (!PROJECT_ID) {
  console.error("❌  FIREBASE_PROJECT_ID yoki VITE_FIREBASE_PROJECT_ID o'rnatilmagan");
  process.exit(1);
}

const WEBHOOK_URL = `https://us-central1-${PROJECT_ID}.cloudfunctions.net/telegramWebhook`;
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

const args = process.argv.slice(2);

async function apiCall(method, body = {}) {
  const res = await fetch(`${TG_API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function getWebhookInfo() {
  const info = await apiCall("getWebhookInfo");
  if (!info.ok) {
    console.error("❌  Webhook ma'lumotlarini olishda xato:", info);
    return;
  }
  const w = info.result;
  console.log("\n📋 Webhook holati:");
  console.log(`   URL:              ${w.url || "(o'rnatilmagan)"}`);
  console.log(`   Pending updates:  ${w.pending_update_count}`);
  console.log(`   Last error:       ${w.last_error_message || "yo'q"}`);
  console.log(`   Secret set:       ${w.has_custom_certificate ? "ha" : "yo'q"}`);
  if (w.last_error_date) {
    console.log(`   Last error date:  ${new Date(w.last_error_date * 1000).toISOString()}`);
  }
}

async function deleteWebhook() {
  const res = await apiCall("deleteWebhook", { drop_pending_updates: false });
  if (res.ok) {
    console.log("✅  Webhook o'chirildi");
  } else {
    console.error("❌  O'chirishda xato:", res);
  }
}

async function registerWebhook() {
  const payload = {
    url: WEBHOOK_URL,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: true,
  };

  if (WEBHOOK_SECRET) {
    payload.secret_token = WEBHOOK_SECRET;
  }

  console.log(`\n🚀 Webhook ro'yxatdan o'tkazilmoqda...`);
  console.log(`   URL: ${WEBHOOK_URL}`);
  if (WEBHOOK_SECRET) {
    console.log(`   Secret: o'rnatilgan`);
  } else {
    console.warn("   ⚠️  Secret token o'rnatilmagan — xavfsizlik uchun TELEGRAM_WEBHOOK_SECRET o'rnating");
  }

  const res = await apiCall("setWebhook", payload);
  if (res.ok) {
    console.log(`\n✅  Webhook muvaffaqiyatli ro'yxatdan o'tkazildi`);
    console.log(`   ${res.description}`);
    await getWebhookInfo();
  } else {
    console.error("\n❌  Webhook ro'yxatdan o'tkazishda xato:");
    console.error(res);
    process.exit(1);
  }
}

if (args.includes("--info")) {
  await getWebhookInfo();
} else if (args.includes("--delete")) {
  await deleteWebhook();
} else {
  await registerWebhook();
}
