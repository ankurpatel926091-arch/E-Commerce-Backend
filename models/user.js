const mongoose = require('mongoose')

const userSchema  = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        enum:['admin','customer'],
        default:"customer"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Users',userSchema)