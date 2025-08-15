// controllers/orderController.js
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

// ---- Config ----
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // sk_test_...
const currency = "inr";
const deliveryCharge = 57;

// Allow overriding from env in prod; fallback for local dev
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

// ---------------------- PLACE ORDER (Stripe Checkout) ----------------------
const placeOrder = async (req, res) => {
  try {
    const { userId, items = [], amount = 0, address = {} } = req.body;

    // 1) Create the order first (unpaid)
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,
      status: "Food Processing",
    });
    await newOrder.save();

    // 2) Clear user's cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // 3) Build line items for Stripe (ensure amounts are in the smallest currency unit)
    const line_items = (items || []).map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity) || 1,
    }));

    // Delivery charge as a line item
    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charge" },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    // 4) Create Stripe Checkout Session
    // Use automatic_payment_methods so Stripe shows Card/UPI/Netbanking for INR when enabled
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
      customer_email: address?.email || undefined,

      // Let Stripe decide the best-local payment methods (Card, UPI, NetBanking, etc.)
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "always",
      },

      // Optional but nice to have: metadata
      metadata: {
        orderId: String(newOrder._id),
        userId: String(userId),
      },
    });

    return res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Stripe placeOrder error:", error);
    return res.json({ success: false, message: "Error" });
  }
};

// ---------------------- PLACE ORDER (Cash on Delivery) ----------------------
const placeOrderCod = async (req, res) => {
  try {
    const { userId, items = [], amount = 0, address = {} } = req.body;

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: true, // COD considered confirmed
      status: "Food Processing",
    });
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    return res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error("placeOrderCod error:", error);
    return res.json({ success: false, message: "Error" });
  }
};

// ---------------------- ADMIN: LIST ALL ORDERS ----------------------
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, data: orders });
  } catch (error) {
    console.error("listOrders error:", error);
    return res.json({ success: false, message: "Error" });
  }
};

// ---------------------- USER: MY ORDERS ----------------------
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    return res.json({ success: true, data: orders });
  } catch (error) {
    console.error("userOrders error:", error);
    return res.json({ success: false, message: "Error" });
  }
};

// ---------------------- ADMIN: UPDATE STATUS ----------------------
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    return res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error("updateStatus error:", error);
    return res.json({ success: false, message: "Error" });
  }
};

// ---------------------- VERIFY ORDER (FROM /verify PAGE) ----------------------
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      return res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.error("verifyOrder error:", error);
    return res.json({ success: false, message: "Not Verified" });
  }
};

export {
  placeOrder,
  placeOrderCod,
  listOrders,
  userOrders,
  updateStatus,
  verifyOrder,
};
