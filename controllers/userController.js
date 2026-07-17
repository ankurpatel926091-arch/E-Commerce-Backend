const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const otpStore = require('../utils/otpStore')
const sendEmail = require('../utils/sendEmail')
const optStore = require('../utils/otpStore')

exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body
    try {
        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({ name, email, password: hashPassword, role })
        await user.save()
        res.status(201).json({ message: 'User Created!' })
    } catch (error) {
        console.error('Register error:', error)
        return res.status(500).json({ message: 'Error creating user!' })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'User not Found' })

        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(400).json({ message: 'Invalid Password' })

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
        const userData = { name: user.name, role: user.role }
        res.status(200).json({ message: 'Login Successfully', token, userData })
    } catch (error) {
        console.error('Login error:', error)
        return res.status(500).json({ message: 'Error during login' })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.status(200).json({ users })
    } catch (error) {
        console.error('Error fetching users:', error)
        res.status(500).json({ message: 'Error fetching users' })
    }
}

exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: 'Email Not Found' })

        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 })

        await sendEmail(email, 'Reset Password OTP', `
            <h2>Password reset</h2>
            <p>Your OTP for password reset is ${otp}</p>
            <p>Valid for 5min Only</p>
        `)
        res.status(200).json({ message: 'Otp Sent' })
    } catch (error) {
        console.error('Forget password error:', error)
        res.status(500).json({ message: 'Error sending otp', error })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body
        const data = optStore.get(email)
        if (!data) return res.status(404).json({ message: 'OTP Not Found' })
        if (Date.now() > data.expiresAt) {
            optStore.delete(email)
            return res.status(400).json({ message: 'OTP Expired' })
        }
        if (data.otp !== otp) return res.status(404).json({ message: 'OTP Invalid' })

        const hashPassword = await bcrypt.hash(password, 10)
        await User.findOneAndUpdate({ email }, { password: hashPassword })
        otpStore.delete(email)
        res.status(200).json({ message: 'Password reset Successfully' })
    } catch (error) {
        console.error('Reset password error:', error)
        res.status(500).json({ message: 'Server Error', error })
    }
}
