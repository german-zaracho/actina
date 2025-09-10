import yup from 'yup'

const multiplechoiceSchemaCreate = yup.object({
    subject: yup.string().required(),
    classification: yup.string().required(),
    questions: yup.array().of(
        yup.object({
            question: yup.string().required(),
            options: yup.array().of(yup.string()).required(),
            answer: yup.number().required(),
            justification: yup.string().required(),
        })
    ).required(),
});

const multiplechoiceSchemaPatch = yup.object({
    subject: yup.string(),
    classification: yup.string(),
    questions: yup.array().of(
        yup.object({
            question: yup.string(),
            options: yup.array().of(yup.string()),
            answer: yup.number(),
            justification: yup.string(),
        })
    ),
});


export {
    multiplechoiceSchemaCreate,
    multiplechoiceSchemaPatch
}