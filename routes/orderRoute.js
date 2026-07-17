const orderRouter = require('express').Router()

const { createOrder, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController')
const auth = require('../middleware/auth')


orderRouter.post('/create-order', auth, createOrder)
orderRouter.get('/all-orders', auth, getAllOrders)
orderRouter.put('/update/:id', auth, updateOrderStatus)
orderRouter.delete('/delete/:id', auth, deleteOrder)

module.exports = orderRouter