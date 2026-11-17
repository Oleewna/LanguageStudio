const { z } = require('zod');

const registerSchema = z.object({
    email: z
        .string({ required_error: 'Email is required.' })
        .trim()
        .toLowerCase()
        .email('Please provide a valid email address.')
        .max(254, 'Email cannot exceed 254 characters.'),
    password: z
        .string({ required_error: 'Password is required.' })
        .min(8, 'Password must be at least 8 characters long.')
        .max(128, 'Password cannot exceed 128 characters.'),
    displayName: z
        .string({ required_error: 'Display name is required.' })
        .trim()
        .min(1, 'Display name cannot be empty.')
        .max(80, 'Display name cannot exceed 80 characters.')
        .optional()
}).transform((data) => {
    // If displayName wasn't explicitly provided, check if 'name' was passed
    return {
        email: data.email,
        password: data.password,
        displayName: data.displayName
    };
});

const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required.' })
        .trim()
        .toLowerCase()
        .email('Please provide a valid email address.'),
    password: z
        .string({ required_error: 'Password is required.' })
        .min(1, 'Password is required.')
        .max(128, 'Password cannot exceed 128 characters.'),
    remember: z.boolean().optional()
});

const forgotPasswordSchema = z.object({
    email: z
        .string({ required_error: 'Email is required.' })
        .trim()
        .toLowerCase()
        .email('Please provide a valid email address.')
});

const resetPasswordSchema = z.object({
    token: z
        .string({ required_error: 'Reset token is required.' })
        .trim()
        .min(1, 'Reset token is required.'),
    password: z
        .string({ required_error: 'New password is required.' })
        .min(8, 'Password must be at least 8 characters long.')
        .max(128, 'Password cannot exceed 128 characters.')
});

const verifyEmailSchema = z.object({
    token: z
        .string({ required_error: 'Verification token is required.' })
        .trim()
        .min(1, 'Verification token is required.')
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyEmailSchema
};
