import { onCall, HttpsError } from "firebase-functions/v2/https";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "../lib/admin";

type TimeRange = "today" | "week" | "month" | "3months" | "year";

function getStartDate(range: TimeRange): Date {
  const now = new Date();
  switch (range) {
    case "today": {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case "week":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "month":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "3months":
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case "year":
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  }
}

export const getDashboardStats = onCall(
  { enforceAppCheck: false },
  async (request) => {
    if (request.auth?.token?.["role"] !== "admin") {
      throw new HttpsError("permission-denied", "Faqat admin bu amalni bajarishi mumkin");
    }

    const range: TimeRange = (request.data?.["range"] as TimeRange) ?? "today";
    const startDate = getStartDate(range);
    const startTimestamp = Timestamp.fromDate(startDate);

    /* Buyurtmalar statistikasi */
    const ordersSnap = await adminDb
      .collection("orders")
      .where("createdAt", ">=", startTimestamp)
      .get();

    let totalRevenue = 0;
    const statusCounts: Record<string, number> = {};

    ordersSnap.docs.forEach((doc) => {
      const d = doc.data();
      totalRevenue += (d["total"] ?? 0) as number;
      const status = d["status"] as string;
      statusCounts[status] = (statusCounts[status] ?? 0) + 1;
    });

    /* Top mahsulotlar */
    const topProductsSnap = await adminDb
      .collection("products")
      .where("isActive", "==", true)
      .orderBy("soldCount", "desc")
      .limit(5)
      .get();

    const topProducts = topProductsSnap.docs.map((d) => ({
      id: d.id,
      name: d.data()["name"],
      soldCount: d.data()["soldCount"] ?? 0,
      stock: d.data()["stock"] ?? 0,
    }));

    /* Kam sotilgan mahsulotlar */
    const lowSoldSnap = await adminDb
      .collection("products")
      .where("isActive", "==", true)
      .where("soldCount", "==", 0)
      .limit(10)
      .get();

    const unsoldProducts = lowSoldSnap.docs.map((d) => ({
      id: d.id,
      name: d.data()["name"],
      sku: d.data()["sku"],
      stock: d.data()["stock"] ?? 0,
    }));

    /* Kam zaxira mahsulotlar */
    const lowStockSnap = await adminDb
      .collection("products")
      .where("isActive", "==", true)
      .where("stock", "<=", 5)
      .orderBy("stock", "asc")
      .limit(10)
      .get();

    const lowStockProducts = lowStockSnap.docs.map((d) => ({
      id: d.id,
      name: d.data()["name"],
      sku: d.data()["sku"],
      stock: d.data()["stock"] ?? 0,
      lowStockThreshold: d.data()["lowStockThreshold"] ?? 5,
    }));

    return {
      range,
      totalRevenue,
      totalOrders: ordersSnap.size,
      statusCounts,
      topProducts,
      unsoldProducts,
      lowStockProducts,
      generatedAt: new Date().toISOString(),
    };
  }
);
