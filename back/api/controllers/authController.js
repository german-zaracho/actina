import * as services from "../../services/authService.js";
import * as tokenService from "../../services/tokenService.js";
import * as profileService from "../../services/profileService.js";

async function createAccount(req, res) {
    try {
        // Crear la cuenta
        const newAccount = await services.createAccount(req.body);
        
        // Crear perfil básico automáticamente
        await profileService.createBasicProfile({
            _id: newAccount._id,
            userName: newAccount.userName,
            email: req.body.email || ''
        });
        
        res.status(201).json({ 
            message: "Account and profile created successfully" 
        });
        
    } catch (err) {
        console.error('Error creating account:', err);
        res.status(400).json({ 
            error: { message: err.message } 
        });
    }
}

async function getAccount(req, res) {
    try {
        // req.account viene del validateToken middleware
        // Ya tiene toda la info de la cuenta, solo quitar la contraseña
        const { password, ...accountData } = req.account;
        res.json(accountData);
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function getCurrentUserRole(req, res) {
    try {
        res.json({ rol: req.account.rol });
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}


async function login(req, res) {
    return services
        .login(req.body)
        .then(async (account) => {
            return { token: await tokenService.createToken(account), account };
        })
        .then((auth) => res.status(200).json(auth))
        .catch((err) => res.status(400).json({ error: { message: err.message } }));
}

async function logout(req, res) {
    const token = req.headers["auth-token"];
    return tokenService
        .removeToken(token)
        .then(() => {
            res.status(200).json({ message: "Session closed correctly" });
        })
        .catch((err) => {
            res.status(400).json({ error: { message: err.message } });
        });
}

async function createProfile(req, res) {
    return profileService.createProfile(req.account, req.body)
        .then(() => res.status(201).json({ message: "Profile created successfully" }))
        .catch(err => res.status(400).json({ error: { message: err.message } }))
}

async function updateProfile(req, res) {
    try {
        const updatedProfile = await profileService.updateProfile(req.account._id, req.body);
        
        res.status(200).json({
            message: "Profile updated successfully", 
            profile: updatedProfile  // ← IMPORTANTE: Retornar el perfil actualizado
        });
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(400).json({ 
            error: { message: err.message } 
        });
    }
}

async function getProfile(req, res) {
    return profileService.getProfile(req.account._id)
        .then(profile => res.status(200).json(profile))
        .catch(err => res.status(400).json({ error: { message: err.message } }))
}

export { createAccount, login, logout, createProfile, updateProfile, getProfile, getAccount, getCurrentUserRole };