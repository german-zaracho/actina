import { multiplechoiceSchemaCreate, multiplechoiceSchemaPatch } from '../schemas/multiplechoicesSchema.js'
import { flashcardSchemaCreate, flashcardSchemaPatch } from '../schemas/flashcardsSchema.js'
import { atlasSchemaCreate, atlasSchemaPatch } from '../schemas/atlasSchema.js'

function validateMultiplechoice(req, res, next){

    multiplechoiceSchemaCreate.validate(req.body,{ abortEarly: false })
        .then( (multiplechoice) => {
            req.body = multiplechoice
            next()
        } )
        .catch((error) => res.status(500).json(error))

}

function validateMultiplechoicePatch(req, res, next){

    multiplechoiceSchemaPatch.validate(req.body,{ abortEarly: false, stripUnknown: true })
        .then( (multiplechoice) => {
            req.body = multiplechoice
            next()
        } )
        .catch((error) => res.status(500).json(error))

}

function validateFlashcard(req, res, next){

    flashcardSchemaCreate.validate(req.body,{ abortEarly: false })
        .then( (flashcard) => {
            req.body = flashcard
            next()
        } )
        .catch((error) => res.status(500).json(error))

}

function validateFlashcardPatch(req, res, next){

    flashcardSchemaPatch.validate(req.body,{ abortEarly: false, stripUnknown: true })
        .then( (flashcard) => {
            req.body = flashcard
            next()
        } )
        .catch((error) => res.status(500).json(error))

}

function validateAtlas(req, res, next){

    atlasSchemaCreate.validate(req.body,{ abortEarly: false })
        .then( (atlas) => {
            req.body = atlas
            next()
        } )
        .catch((error) => res.status(500).json(error))

}

function validateAtlasPatch(req, res, next){

    atlasSchemaPatch.validate(req.body,{ abortEarly: false, stripUnknown: true })
        .then( (atlas) => {
            req.body = atlas
            next()
        } )
        .catch((error) => res.status(500).json(error))
        
}

export {
    validateMultiplechoice,
    validateMultiplechoicePatch,
    validateFlashcard,
    validateFlashcardPatch,
    validateAtlas,
    validateAtlasPatch
}