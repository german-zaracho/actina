import yup from 'yup';

const profile = yup.object({
    name: yup.string().trim().required().min(3).max(50),
    email: yup.string().trim().required().email(),
    userImage: yup.string().trim().optional(),
    bio: yup.string().trim().optional().max(200),
    birthDate: yup.date().optional().nullable().transform((value, originalValue) => {
        // Si es una cadena vacía, convertir a null
        return originalValue === '' ? null : value;
    }),
    location: yup.string().trim().optional().max(100)
})

// Schema más simple para creación automática de perfil
const basicProfile = yup.object({
    name: yup.string().trim().optional().min(3).max(50),
    email: yup.string().trim().required().email(),
    userImage: yup.string().trim().optional(),
})

export { profile, basicProfile }