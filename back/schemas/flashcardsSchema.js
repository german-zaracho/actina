import yup from 'yup'

const flashcardSchemaCreate = yup.object({
    subject: yup.string().required(),
    topic: yup.string().required(),
    tabs: yup.array().of(
        yup.object({
            concepts: yup.array().of(yup.string()).required(),
            features: yup.array().of(yup.string()).required(),
            atlasId: yup.string(),
            atlasPage: yup.number(),
        })
    ).required(),
});

const flashcardSchemaPatch = yup.object({
    subject: yup.string(),
    topic: yup.string(),
    tabs: yup.array().of(
        yup.object({
            concepts: yup.array().of(yup.string()),
            features: yup.array().of(yup.string()),
            atlasId: yup.string(),
            atlasPage: yup.number(),
        })
    ),
});


export {
    flashcardSchemaCreate,
    flashcardSchemaPatch
}