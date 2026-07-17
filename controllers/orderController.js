const Order = require('../models/order')

exports.createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, paymentType } = req.body
        const order = await Order.create({
            user: req.user.userId,
            items,
            totalAmount,
            address,
            paymentType,
        })

        res.status(200).json({ message: 'Order Created', order })
    } catch (error) {
        res.status(500).json({ message: 'Error', error })
    }
}


// Admin: Get all orders (with user info)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.productId', 'productName price images')
            .sort({ createdAt: -1 })

        res.status(200).json({ message: 'Orders fetched', orders })
    } catch (error) {
        console.error('getAllOrders error:', error)
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body
        const order = await Order.findById(id)
        if (!order) return res.status(404).json({ message: 'Order not found' })

        order.status = status
        await order.save()
        res.status(200).json({ message: 'Order status updated' })
    } catch (error) {
        console.error('updateOrderStatus error:', error)
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

// Admin: Delete order
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params
        const order = await Order.findById(id)
        if (!order) return res.status(404).json({ message: 'Order not found' })

        await order.deleteOne()
        res.status(200).json({ message: 'Order deleted' })
    } catch (error) {
        console.error('deleteOrder error:', error)
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}