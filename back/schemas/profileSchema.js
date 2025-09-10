import yup from 'yup';

const profile = yup.object({
    name: yup.string().trim().required().min(3).max(50),
    email: yup.string().trim().required().email(),
    userImage: yup.string().trim(),
})

export { profile }