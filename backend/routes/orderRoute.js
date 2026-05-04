import express from "express"
import authUser from "../middleware/authUser.js"
import adminAuth from "../middleware/adminAuth.js" // Import Admin Auth
import {
  verifyStripe,
  placeOrder,
  placeOrderStripe,
  userOrders,
  allOrders,    // Add this (Admin Controller)
  statusOrder   // Add this (Admin Controller)
} from "../controllers/orderController.js"

const orderRouter = express.Router()

// --- Admin Features ---
// This is why you were getting a 404! 
// We are adding the 'list' route that the Admin Panel is looking for.
orderRouter.get('/list', adminAuth, allOrders) 
orderRouter.post('/status', adminAuth, statusOrder)

// --- Payment Features (User) ---
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)

// --- User Feature ---
orderRouter.post('/userorders', authUser, userOrders)

// --- Verify Payment ---
orderRouter.post('/verifyStripe', authUser, verifyStripe)

export default orderRouter