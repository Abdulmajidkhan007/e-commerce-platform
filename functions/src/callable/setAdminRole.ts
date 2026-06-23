import { onCall, HttpsError } from "firebase-functions/v2/https";
import { adminAuth, adminDb } from "../lib/admin";
import { ADMIN_EMAIL } from "../lib/env";

export const setAdminRole = onCall(
  {
    secrets: [ADMIN_EMAIL],
    enforceAppCheck: false,
  },
  async (request) => {
    /* Faqat joriy admin bu funksiyani chaqira oladi */
    const callerToken = request.auth?.token;
    if (!callerToken || callerToken["role"] !== "admin") {
      throw new HttpsError("permission-denied", "Faqat admin bu amalni bajarishi mumkin");
    }

    const targetEmail = request.data?.["email"] as string | undefined;
    if (!targetEmail) {
      throw new HttpsError("invalid-argument", "Email manzil kiritilmagan");
    }

    try {
      const user = await adminAuth.getUserByEmail(targetEmail);
      await adminAuth.setCustomUserClaims(user.uid, { role: "admin" });

      await adminDb.collection("users").doc(user.uid).update({
        role: "admin",
        updatedAt: new Date(),
      });

      return { success: true, uid: user.uid, email: targetEmail };
    } catch (err) {
      console.error("Admin claim o'rnatishda xato:", err);
      throw new HttpsError("internal", `Xato: ${String(err)}`);
    }
  }
);
