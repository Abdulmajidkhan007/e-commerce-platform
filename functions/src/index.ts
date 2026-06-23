// KidsWear Firebase Cloud Functions — barcha funksiyalar shu yerdan eksport qilinadi

export { telegramWebhook } from "./telegram/webhook";
export { onOrderCreated } from "./triggers/onOrderCreated";
export { onOrderStatusChanged } from "./triggers/onOrderStatusChanged";
export { onUserCreated } from "./triggers/onUserCreated";
export { onProductWrite } from "./triggers/onProductWrite";
export { onContactCreated } from "./triggers/onContactCreated";
export { setAdminRole } from "./callable/setAdminRole";
export { getDashboardStats } from "./callable/getDashboardStats";
