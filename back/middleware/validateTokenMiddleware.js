import * as tokenService from '../services/tokenService.js'

async function validateToken(req, res, next) {

    const token = req.headers["auth-token"]

    if (!token) {
        return res.status(401).json({ error: { message: "The token wasn't sent" } })
    }

    const account = await tokenService.verifyToken(token)

    if (!account) {
        return res.status(401).json({ error: { message: "Invalid Token" } })
    }

    req.account = account

    next()

}

export {
    validateToken
}