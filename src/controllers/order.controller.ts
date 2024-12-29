import Order from "../models/orderItem.model";
import { validationResult } from 'express-validator';
import ProductsModel from "../models/products.model";
import { Response } from "express";
import { IRequestWithUser } from "../middlewares/auth.middleware";

export default {
    async createOrder(req: IRequestWithUser, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        const { grandTotal, orderItems } = req.body;
        const userId = req?.user?.id;

        try {
            // Validate stock availability
            for (const item of orderItems) {
                const product = await ProductsModel.findById(item.productId);
                if (!product || product.qty < item.quantity) {
                    res.status(400).send(`Insufficient stock for product: ${item.name}`);
                }
            }

            // Create Order
            const order = new Order({
                grandTotal,
                orderItems,
                createdBy: userId,
            });

            await order.save();

            // Deduct product stock
            for (const item of orderItems) {
                await ProductsModel.findByIdAndUpdate(item.productId, {
                    $inc: { qty: -item.quantity },
                });
            }

            res.status(201).json(order);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    },// Get User Orders with Pagination
    async getOrders(req: IRequestWithUser, res: Response) {
        const userId = req?.user?.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        try {
            const orders = await Order.find({ createdBy: userId })
                .skip((page - 1) * limit)
                .limit(limit);
            res.json(orders);
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    }
} 