const { Router } = require('express')
const cors = require('cors')
const { registerUser, loginUser, logOutUser, sendVerifyOtp, verifyEmail, alreadyAuthenticated, sendResetOtp, resetPassword } = require('../controllers/authController')
const userAuth = require('../middleware/userAuth')

const authRouter = Router()

// authRouter.use(
//     cors({
//         credentials: true,
//         origin: 'http://localhost:5173'
//     })
// )

authRouter.post('/register', registerUser)
authRouter.post('/login', loginUser)
authRouter.post('/logout', logOutUser)
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp)
authRouter.post('/verify-account', userAuth, verifyEmail)
authRouter.get('/is-auth', userAuth, alreadyAuthenticated)
authRouter.post('/send-reset-otp', sendResetOtp)
authRouter.post('/reset-password', resetPassword)

module.exports = authRouter