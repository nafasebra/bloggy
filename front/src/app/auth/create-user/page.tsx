'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface FormData {
    fullname: string
    bio: string
    avatar: FileList | null
    location: string
    website: string
    twitter: string
    category: string
}

export default function CreateUserPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

    const onSubmit = async (data: FormData) => {
        setIsLoading(true)
        setError('')
        
        try {
            // Handle form submission here
            console.log(data)
            // API call would go here
        } catch (err) {
            setError('Failed to create profile. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="py-10 min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Left Column - Avatar Upload */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 flex items-center justify-center">
                        <div className="text-center">
                            <div className="mb-6">
                                <div className="relative mx-auto w-32 h-32 mb-4">
                                    <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden">
                                        <img
                                            src="/placeholder-avatar.jpg"
                                            alt="Avatar preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.currentTarget as HTMLElement;
                                                const sibling = target.nextElementSibling as HTMLElement;
                                                target.style.display = 'none';
                                                if (sibling) {
                                                    sibling.style.display = 'flex';
                                                }
                                            }}
                                        />
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <label htmlFor="avatar" className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 cursor-pointer shadow-lg transition-colors duration-200">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </label>
                                    <input
                                        id="avatar"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        {...register('avatar')}
                                    />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Your Photo</h3>
                                <p className="text-sm text-gray-600">Choose a photo that represents you best</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Create Your Profile
                            </h2>
                            <p className="text-gray-600 mt-2 text-sm">
                                Set up your account information
                            </p>
                        </div>
                        
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        id="fullname"
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your full name"
                                        {...register('fullname', { required: 'Full name is required' })}
                                    />
                                    {errors.fullname && (
                                        <p className="mt-2 text-sm text-red-600">{errors.fullname.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        id="bio"
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Tell us about yourself"
                                        {...register('bio')}
                                    />
                                    {errors.bio && (
                                        <p className="mt-2 text-sm text-red-600">{errors.bio.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                            Location
                                        </label>
                                        <input
                                            id="location"
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Your location"
                                            {...register('location')}
                                        />
                                        {errors.location && (
                                            <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <input
                                            id="category"
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            placeholder="e.g., Technology"
                                            {...register('category')}
                                        />
                                        {errors.category && (
                                            <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                                        Website
                                    </label>
                                    <input
                                        id="website"
                                        type="url"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        placeholder="https://"
                                        {...register('website')}
                                    />
                                    {errors.website && (
                                        <p className="mt-2 text-sm text-red-600">{errors.website.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-2">
                                        Twitter Account
                                    </label>
                                    <input
                                        id="twitter"
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        placeholder="@username"
                                        {...register('twitter')}
                                    />
                                    {errors.twitter && (
                                        <p className="mt-2 text-sm text-red-600">{errors.twitter.message}</p>
                                    )}
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Creating Profile...' : 'Create Profile'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}