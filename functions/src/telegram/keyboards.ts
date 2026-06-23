import { InlineKeyboard } from "grammy";

export function orderActionsKeyboard(orderId: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("✅ Tasdiqlash", `confirm_${orderId}`)
    .text("📦 Qadoqlash", `packing_${orderId}`)
    .row()
    .text("🚚 Jo'natish", `shipped_${orderId}`)
    .text("🎉 Yetkazildi", `delivered_${orderId}`)
    .row()
    .text("❌ Bekor qilish", `cancel_${orderId}`);
}

export function cancelReasonKeyboard(orderId: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("Mahsulot yo'q", `cancel_reason_${orderId}_nostock`)
    .row()
    .text("Mijoz rad etdi", `cancel_reason_${orderId}_customer`)
    .row()
    .text("Boshqa sabab", `cancel_reason_${orderId}_other`);
}
