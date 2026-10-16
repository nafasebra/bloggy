import { z } from 'zod';

export const editProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z
    .string()
    .max(100, 'Location must be less than 100 characters')
    .optional(),
  website: z
    .string()
    .url('Please enter a valid URL')
    .or(z.literal(''))
    .optional(),
  twitter: z
    .string()
    .regex(/^@?[A-Za-z0-9_]{1,15}$/, 'Please enter a valid Twitter username')
    .or(z.literal(''))
    .optional(),
  category: z
    .string()
    .max(50, 'Category must be less than 50 characters')
    .optional(),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
