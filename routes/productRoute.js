const express = require('express')
const productRouter = express.Router()

const {createProduct, getProducts, deleteProduct} = require('../controllers/productController')
const upload  = require('../middleware/upload')
const auth = require('../middleware/auth')


productRouter.post('/create',auth,upload.array('images', 5),createProduct)
productRouter.get('/get-all',getProducts)
productRouter.delete('/delete/:id', auth, deleteProduct)

module.exports = productRouter