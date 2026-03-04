import * as tokenService from '../services/tokenService.js'

async function validateToken(req, res, next) {
    const token = req.headers["auth-token"]

    console.log("Token validation debug");
    console.log("Headers received:", req.headers);
    console.log("Token received:", token);

    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ error: { message: "El token no se envio" } })
    }

    try {
        const account = await tokenService.verifyToken(token)
        console.log("Token verification result:", account);

        if (!account) {
            console.log("Invalid token - verification failed");
            return res.status(401).json({ error: { message: "Token inválido" } })
        }

        console.log("Token valid - account:", account);
        req.account = account
        next()
    } catch (error) {
        console.error("Token validation error:", error);
        return res.status(401).json({ error: { message: "Token inválido" } })
    }
}

export {
    validateToken
}