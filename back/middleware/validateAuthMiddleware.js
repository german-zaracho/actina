import * as accountSchema from '../schemas/authSchema.js'
import * as profileSchema from '../schemas/profileSchema.js'

async function validateAccount(req, res, next) {

    return accountSchema.account.validate(req.body, { abortEarly: false, stripUnknown: true })
    .then( (account) => {
        req.body = account
        next()
    } )
    .catch( (err) => res.status(400).json({ error: { message: err.message } }) )

}

async function validateProfile(req, res, next){

    console.log(req.body)
    return profileSchema.profile.validate(req.body, { abortEarly: false, stripUnknown: true })
        .then( (account) => {
            req.body = account
            next()
        } )
        .catch( (err) => res.status(400).json({ error: { message: err.message } }) )

}

export {validateAccount, validateProfile}