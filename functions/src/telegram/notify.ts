import { Bot } from "grammy";

let _bot: Bot | null = null;

export function getBot(token: string): Bot {
  if (!_bot) {
    _bot = new Bot(token);
  }
  return _bot;
}

export async function sendToGroup(
  bot: Bot,
  chatId: string,
  text: string,
  opts: { parseMode?: "HTML" | "MarkdownV2"; replyMarkup?: unknown } = {}
): Promise<number | undefined> {
  try {
    const msg = await bot.api.sendMessage(chatId, text, {
      parse_mode: opts.parseMode ?? "HTML",
      reply_markup: opts.replyMarkup as never,
    });
    return msg.message_id;
  } catch (err) {
    console.error("Telegram guruhga xabar yuborishda xato:", err);
    return undefined;
  }
}

export async function editGroupMessage(
  bot: Bot,
  chatId: string,
  messageId: number,
  text: string,
  opts: { parseMode?: "HTML" | "MarkdownV2" } = {}
): Promise<void> {
  try {
    await bot.api.editMessageText(chatId, messageId, text, {
      parse_mode: opts.parseMode ?? "HTML",
    });
  } catch (err) {
    console.error("Telegram xabarini tahrirlashda xato:", err);
  }
}

/* Xabar shablonlari */
export function newOrderTemplate(order: {
  id: string;
  customer: { firstName: string; lastName: string; phone: string; address: string };
  items: { name: string; qty: number; unitPrice: number }[];
  total: number;
  payment: { method: string; depositAmount: number };
}): string {
  const itemsList = order.items
    .map((i) => `  • ${i.name} × ${i.qty} = ${i.unitPrice * i.qty / 1000}K so'm`)
    .join("\n");

  const paymentInfo =
    order.payment.method === "partial_online"
      ? `💳 50% onlayn: ${order.payment.depositAmount / 1000}K so'm`
      : "💵 Naqd pul (yetkazganda)";

  return `🆕 <b>YANGI BUYURTMA</b> #${order.id.slice(-6).toUpperCase()}

👤 <b>Mijoz:</b> ${order.customer.firstName} ${order.customer.lastName}
📞 <b>Tel:</b> ${order.customer.phone}
📍 <b>Manzil:</b> ${order.customer.address}

🛍 <b>Mahsulotlar:</b>
${itemsList}

💰 <b>Jami:</b> ${order.total / 1000}K so'm
${paymentInfo}`;
}

export function orderStatusTemplate(
  orderId: string,
  status: string,
  customerName: string
): string {
  const statusEmoji: Record<string, string> = {
    pending: "⏳",
    confirmed: "✅",
    packing: "📦",
    shipped: "🚚",
    delivered: "🎉",
    cancelled: "❌",
  };
  const emoji = statusEmoji[status] ?? "🔄";

  return `${emoji} <b>BUYURTMA HOLATI O'ZGARDI</b>

📋 Buyurtma #${orderId.slice(-6).toUpperCase()}
👤 Mijoz: ${customerName}
🔄 Yangi holat: <b>${status.toUpperCase()}</b>`;
}

export function newUserTemplate(email: string, displayName: string): string {
  return `👤 <b>YANGI FOYDALANUVCHI</b>

📧 Email: ${email}
👤 Ism: ${displayName || "Ko'rsatilmagan"}`;
}

export function lowStockTemplate(
  productName: string,
  sku: string,
  stock: number,
  threshold: number
): string {
  const emoji = stock === 0 ? "🛑" : "⚠️";
  const status = stock === 0 ? "TUGADI" : "KAM QOLDI";

  return `${emoji} <b>MAHSULOT ${status}</b>

📦 ${productName}
🏷 SKU: ${sku}
📊 Qolgan: ${stock} ta (chegarа: ${threshold})`;
}

export function newContactTemplate(
  name: string,
  email: string,
  message: string
): string {
  return `✉️ <b>YANGI XABAR</b>

👤 Ism: ${name}
📧 Email: ${email}
💬 Xabar: ${message.slice(0, 300)}${message.length > 300 ? "..." : ""}`;
}
