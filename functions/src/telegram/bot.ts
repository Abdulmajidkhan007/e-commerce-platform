import { Bot, type Context } from "grammy";
import { adminDb } from "../lib/admin";
import { parseAdminUserIds } from "../lib/env";
import { orderStatusTemplate } from "./notify";
import type { FieldValue } from "firebase-admin/firestore";

export function createBot(
  token: string,
  adminUserIds: number[],
  groupChatId: string
): Bot {
  const bot = new Bot(token);

  /* Admin tekshiruvi */
  function isAdmin(ctx: Context): boolean {
    const fromId = ctx.from?.id;
    return Boolean(fromId && (adminUserIds.includes(fromId) || ctx.chat?.id.toString() === groupChatId));
  }

  bot.command("start", async (ctx) => {
    await ctx.reply(
      "👶 KidsWear admin boti!\n\n" +
      "Mavjud buyruqlar:\n" +
      "/orders — so'nggi buyurtmalar\n" +
      "/pending — kutilayotgan buyurtmalar\n" +
      "/stats — bugungi statistika\n" +
      "/lowstock — kam mahsulotlar\n" +
      "/help — yordam"
    );
  });

  bot.command("help", async (ctx) => {
    await ctx.reply(
      "📋 <b>Buyruqlar ro'yxati:</b>\n\n" +
      "/orders — so'nggi 10 ta buyurtma\n" +
      "/order [id] — buyurtma tafsiloti\n" +
      "/pending — kutilayotgan buyurtmalar\n" +
      "/today — bugungi buyurtmalar\n" +
      "/stats — statistika\n" +
      "/lowstock — kam zaxira mahsulotlar\n" +
      "/product [sku] — mahsulot ma'lumoti",
      { parse_mode: "HTML" }
    );
  });

  bot.command("orders", async (ctx) => {
    if (!isAdmin(ctx)) { await ctx.reply("❌ Ruxsat yo'q"); return; }
    try {
      const snap = await adminDb
        .collection("orders")
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();

      if (snap.empty) { await ctx.reply("📭 Buyurtmalar yo'q"); return; }

      const lines = snap.docs.map((d) => {
        const o = d.data();
        return `#${d.id.slice(-6).toUpperCase()} | ${o["status"]} | ${o["total"] / 1000}K so'm | ${o["customer"]?.["firstName"]} ${o["customer"]?.["lastName"]}`;
      });

      await ctx.reply(`📦 So'nggi buyurtmalar:\n\n${lines.join("\n")}`);
    } catch (err) {
      await ctx.reply(`❌ Xato: ${String(err)}`);
    }
  });

  bot.command("pending", async (ctx) => {
    if (!isAdmin(ctx)) { await ctx.reply("❌ Ruxsat yo'q"); return; }
    try {
      const snap = await adminDb
        .collection("orders")
        .where("status", "==", "pending")
        .orderBy("createdAt", "desc")
        .limit(20)
        .get();

      if (snap.empty) { await ctx.reply("✅ Kutilayotgan buyurtmalar yo'q"); return; }

      const lines = snap.docs.map((d) => {
        const o = d.data();
        return `🕐 #${d.id.slice(-6).toUpperCase()} | ${o["customer"]?.["firstName"]} | ${o["total"] / 1000}K`;
      });

      await ctx.reply(`⏳ Kutilayotgan buyurtmalar (${snap.size}):\n\n${lines.join("\n")}`);
    } catch (err) {
      await ctx.reply(`❌ Xato: ${String(err)}`);
    }
  });

  bot.command("stats", async (ctx) => {
    if (!isAdmin(ctx)) { await ctx.reply("❌ Ruxsat yo'q"); return; }
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const snap = await adminDb
        .collection("orders")
        .where("createdAt", ">=", today)
        .get();

      const total = snap.docs.reduce((sum, d) => sum + (d.data()["total"] ?? 0), 0);
      await ctx.reply(
        `📊 <b>Bugungi statistika</b>\n\n` +
        `📦 Buyurtmalar: ${snap.size} ta\n` +
        `💰 Daromad: ${total / 1000}K so'm`,
        { parse_mode: "HTML" }
      );
    } catch (err) {
      await ctx.reply(`❌ Xato: ${String(err)}`);
    }
  });

  bot.command("lowstock", async (ctx) => {
    if (!isAdmin(ctx)) { await ctx.reply("❌ Ruxsat yo'q"); return; }
    try {
      const snap = await adminDb
        .collection("products")
        .where("isActive", "==", true)
        .where("stock", "<=", 5)
        .orderBy("stock", "asc")
        .limit(20)
        .get();

      if (snap.empty) { await ctx.reply("✅ Barcha mahsulotlar zaxirasi yaxshi"); return; }

      const lines = snap.docs.map((d) => {
        const p = d.data();
        const emoji = p["stock"] === 0 ? "🛑" : "⚠️";
        return `${emoji} ${p["name"]} (SKU: ${p["sku"]}) — ${p["stock"]} ta qoldi`;
      });

      await ctx.reply(`Kam zaxirali mahsulotlar:\n\n${lines.join("\n")}`);
    } catch (err) {
      await ctx.reply(`❌ Xato: ${String(err)}`);
    }
  });

  /* Inline tugmalar — buyurtma holati o'zgartirish */
  const statusMap: Record<string, string> = {
    confirm: "confirmed",
    packing: "packing",
    shipped: "shipped",
    delivered: "delivered",
    cancel: "cancelled",
  };

  bot.on("callback_query:data", async (ctx) => {
    if (!isAdmin(ctx)) { await ctx.answerCallbackQuery("❌ Ruxsat yo'q"); return; }

    const data = ctx.callbackQuery.data;
    const match = data.match(/^(confirm|packing|shipped|delivered|cancel)_(.+)$/);
    if (!match) { await ctx.answerCallbackQuery(); return; }

    const [, action, orderId] = match;
    if (!action || !orderId) { await ctx.answerCallbackQuery(); return; }

    const newStatus = statusMap[action];
    if (!newStatus) { await ctx.answerCallbackQuery(); return; }

    try {
      const orderRef = adminDb.collection("orders").doc(orderId);
      const orderSnap = await orderRef.get();
      if (!orderSnap.exists) {
        await ctx.answerCallbackQuery("❌ Buyurtma topilmadi");
        return;
      }

      await orderRef.update({
        status: newStatus,
        updatedAt: new Date(),
        statusHistory: (adminDb as unknown as { FieldValue: { arrayUnion: (...args: unknown[]) => FieldValue } })
          .FieldValue?.arrayUnion?.({
            status: newStatus,
            at: new Date(),
            by: "telegram_bot",
          }) ?? [],
      });

      const order = orderSnap.data();
      const customerName = `${order?.["customer"]?.["firstName"] ?? ""} ${order?.["customer"]?.["lastName"] ?? ""}`.trim();
      await ctx.answerCallbackQuery(`✅ Holat o'zgartirildi: ${newStatus}`);

      if (ctx.msg?.message_id && groupChatId) {
        await ctx.api.editMessageText(
          groupChatId,
          ctx.msg.message_id,
          orderStatusTemplate(orderId, newStatus, customerName),
          { parse_mode: "HTML" }
        ).catch(() => undefined);
      }
    } catch (err) {
      await ctx.answerCallbackQuery(`❌ Xato: ${String(err)}`);
    }
  });

  return bot;
}

export function parseBotAdminIds(raw: string | undefined): number[] {
  return parseAdminUserIds(raw);
}
