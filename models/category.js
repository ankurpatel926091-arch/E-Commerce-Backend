const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
    },
    image:{
        type:String,
    },
    publicId: {
        type: String
    }
})

module.exports = mongoose.model('category', categorySchema)