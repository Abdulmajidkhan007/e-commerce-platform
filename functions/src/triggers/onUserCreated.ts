import { beforeUserCreated } from "firebase-functions/v2/identity";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { adminAuth, adminDb } from "../lib/admin";
import { ADMIN_EMAIL, TELEGRAM_BOT_TOKEN, TELEGRAM_GROUP_CHAT_ID } from "../lib/env";
import { getBot, sendToGroup, newUserTemplate } from "../telegram/notify";

/* Yangi foydalanuvchi yaratilganda admin claim qo'yish */
export const onUserCreated = onDocumentCreated(
  {
    document: "users/{uid}",
    secrets: [ADMIN_EMAIL, TELEGRAM_BOT_TOKEN, TELEGRAM_GROUP_CHAT_ID],
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const uid = event.params["uid"];
    const email = data["email"] as string;
    const adminEmail = ADMIN_EMAIL.value();

    /* Admin email mosligini tekshirish */
    if (email && adminEmail && email.toLowerCase() === adminEmail.toLowerCase()) {
      try {
        await adminAuth.setCustomUserClaims(uid, { role: "admin" });
        await adminDb.collection("users").doc(uid).update({
          role: "admin",
          updatedAt: new Date(),
        });
        console.log(`Admin huquqi berildi: ${email}`);
      } catch (err) {
        console.error("Admin claim o'rnatishda xato:", err);
      }
    }

    /* Telegram guruhga xabar */
    try {
      const token = TELEGRAM_BOT_TOKEN.value();
      const chatId = TELEGRAM_GROUP_CHAT_ID.value();
      if (token && chatId) {
        const bot = getBot(token);
        await sendToGroup(
          bot,
          chatId,
          newUserTemplate(email, `${data["firstName"] ?? ""} ${data["lastName"] ?? ""}`.trim())
        );
      }
    } catch (err) {
      console.error("Telegram bildirishnoma xatosi:", err);
    }
  }
);

/* Firebase Auth o'rnatishdan oldin (agar kerak bo'lsa) */
export const beforeUserSignIn = beforeUserCreated(
  {
    secrets: [ADMIN_EMAIL],
  },
  async (event) => {
    const email = event.data?.email;
    const adminEmail = ADMIN_EMAIL.value();

    if (email && adminEmail && email.toLowerCase() === adminEmail.toLowerCase()) {
      return {
        customClaims: { role: "admin" },
      };
    }
    return {};
  }
);
