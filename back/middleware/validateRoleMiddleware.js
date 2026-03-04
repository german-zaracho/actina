function validateAdmin(req, res, next) {
    // req.account viene del validateToken middleware
    if (!req.account || req.account.rol !== 2) {
        return res.status(403).json({ 
            error: { message: "Acceso denegado. Privilegios de admin requeridos." } 
        });
    }
    next();
}

export { validateAdmin };