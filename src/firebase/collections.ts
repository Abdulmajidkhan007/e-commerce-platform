import { collection } from "firebase/firestore";
import { db } from "./index";
import {
  userConverter,
  productConverter,
  reviewConverter,
  orderConverter,
  blogPostConverter,
  contactConverter,
} from "./converters";

export const usersCol = () =>
  collection(db, "users").withConverter(userConverter);

export const productsCol = () =>
  collection(db, "products").withConverter(productConverter);

export const reviewsCol = (productId: string) =>
  collection(db, "products", productId, "reviews").withConverter(reviewConverter);

export const ordersCol = () =>
  collection(db, "orders").withConverter(orderConverter);

export const blogPostsCol = () =>
  collection(db, "blogPosts").withConverter(blogPostConverter);

export const contactsCol = () =>
  collection(db, "contactMessages").withConverter(contactConverter);
