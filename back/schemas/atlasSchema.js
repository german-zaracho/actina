import yup from 'yup'

const atlasSchemaCreate = yup.object({
    type: yup.string().required(),
    subject: yup.string().required(),
    pages: yup.array().of(
        yup.object({
            topic: yup.string().required(),
            items: yup.array().of(yup.string()).required(),
            image: yup.string(),
            flashcardId: yup.string(),
        })
    ).required(),
});

const atlasSchemaPatch = yup.object({
    type: yup.string(),
    subject: yup.string(),
    pages: yup.array().of(
        yup.object({
            topic: yup.string(),
            image: yup.string(),
            items: yup.array().of(yup.string()),
            flashcardId: yup.string(),
        })
    ),
});


export {
    atlasSchemaCreate,
    atlasSchemaPatch
}