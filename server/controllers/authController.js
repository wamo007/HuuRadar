const User = require('../models/user')
const { hashPassword, comparePassword } = require('../helpers/authHashing')
const jwt = require('jsonwebtoken')
const  transporter = require('../config/nodeMailer')

// Register Endpoint
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        // check if name was entered
        if (!name) {
            return res.json({
                error: 'Name is required'
            })
        }
        // check if pass is good
        if (!password || password.length < 6) {
            return res.json({
                error: 'Password is required and should be at least 6 characters long'
            })
        }
        // check email
        const exist = await User.findOne({ email })
        if (exist) {
            return res.json({
                error: 'Email is taken already'
            })
        }

        const hashedPassword = await hashPassword(password)

        const user = new User({
            name, 
            email, 
            password: hashedPassword,
        })
        await user.save()

        const token = jwt.sign({id: user._id}, 
            process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', // change it to true later!
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // sending email at the registration
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Rent NL!',
            text: `Welcome to the website! Your account has been created with email id: ${email}.`
        }

        await transporter.sendMail(mailOptions)

        return res.json({ success: true })

    } catch (err) {
        res.json({
            message: err.message
        })
    }
}

// Login Endpoint
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.json({
                error: 'Please fill in you e-mail and password...'
            })
        }

        // Check if user exists
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({
                error: 'No user found!'
            })
        }

        // Check if passwords match & assign JSON Web Token (JWT)
        const match = await comparePassword(password, user.password)
        // if (match) {
        //     res.json('Passwords match')
        // }
        if (!match) {
            return res.json({
                error: 'Passwords do not match'
            })
        }
        const token = jwt.sign({id: user._id}, 
            process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', // change it to true later!
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true })

    } catch (err) {
        res.json({
            message: err.message
        })
    }
}

// Log out Endpoint
const logOutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', // change it to true later!
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true })
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body

        const user = await User.findById(userId)

        if (user.accountVerified) {
            return res.json({
                error: 'Account is already verified...'
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp
        user.verifyOtpExpires = Date.now() + 2 * 60 * 60 * 1000

        await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}. 
            Please, verify your account within 2 hours.`
        }

        await transporter.sendMail(mailOptions)
        res.json({ success: true })
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body

    if (!userId || !otp) {
        return res.json({
            error: 'Missing Details...'
        })
    }
    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.json({
                error: 'User not found'
            })
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp ) {
            return res.json({
                error: 'Invalid OTP. Try again...'
            })
        }

        if (user.verifyOtpExpires < Date.now()) {
            return res.json({
                error: 'OTP has already expired. Please, resend the OTP code.'
            })
        }
        
        user.accountVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpires = 0

        await user.save()
        return res.json({ success: true })
    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

const alreadyAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true })
    } catch (err) {
        res.json({
            message: err.message
        })
    }
}

const sendResetOtp = async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.json({
            error: 'Email is required!'
        })
    }

    try {
        const user = await User.findOne({ email })
        
        if (!user) {
            return res.json({
                error: 'User not found'
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp
        user.resetOtpExpires = Date.now() + 15 * 60 * 1000
        
        await user.save()

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP to reset the password is ${otp}. 
            Please, enter the code within 15 minutes.`
        }

        await transporter.sendMail(mailOptions)
        return res.json({ success: true })

    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
        return res.json({
            error: 'Email, OTP or the new password is not provided.'
        })
    }

    if (newPassword.length < 6) {
        return res.json({
            error: 'The password should be at least 6 characters long.'
        })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.json({
                error: 'User not found'
            })
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({
                error: 'Invalid OTP'
            })
        }

        if (user.resetOtpExpires < Date.now()) {
            return res.json({
                error: 'OTP expired'
            })
        }

        const hashedPassword = await hashPassword(newPassword)

        user.password = hashedPassword
        user.resetOtp = ''
        user.resetOtpExpires = 0

        await user.save()
        return res.json({ success: true })

    } catch (err) {
        return res.json({
            message: err.message
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    logOutUser,
    sendVerifyOtp,
    verifyEmail,
    alreadyAuthenticated,
    sendResetOtp,
    resetPassword
}