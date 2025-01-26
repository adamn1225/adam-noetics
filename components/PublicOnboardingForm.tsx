'use client';

import React, { useState } from 'react';
import { supabase } from '@lib/supabaseClient';

const PublicOnboardingForm: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        phone_number: '',
        full_name: '',
        business_name: '',
        business_description: '',
        target_audience: '',
        project_goals: '',
        design_style: '',
        branding_materials: '',
        inspiration: '',
        color_preferences: '',
        features: '',
        user_authentication: '',
        content_management: '',
        ecommerce_needs: '',
        integrations: '',
        content_ready: '',
        page_count: '',
        seo_assistance: '',
        domain_info: '',
        hosting_info: '',
        maintenance_needs: '',
        budget_range: '',
        timeline: '',
        analytics: '',
        training: '',
        additional_services: '',
        other_info: '',
        create_account: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage('');

        try {
            const { data, error: formError } = await supabase.from('public_project_plan').insert([
                formData
            ]).select();

            if (formError) {
                throw formError;
            }

            const newRecord = data[0];
            setSuccessMessage('Your project plan has been successfully submitted!');

            if (formData.create_account) {
                // Handle account creation logic here
                const { error: inviteError } = await supabase.auth.signInWithOtp({
                    email: formData.email,
                    options: {
                        emailRedirectTo: 'https://www.noetics.io/setup-password', // Redirect URL to the password setup page
                    },
                });

                if (inviteError) {
                    throw inviteError;
                }

                alert('Account creation link sent to your email.');
            }
        } catch (error: any) {
            console.error('Error submitting form:', error.message);
            alert('There was an error submitting the form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-[70vw] h-fit mx-auto p-8 bg-white mt-12 mb-12 dark:bg-gray-700 rounded shadow">
            {successMessage && <p className="text-green-600 dark:text-green-400 mb-4">{successMessage}</p>}
            <form onSubmit={handleSubmit} className="space-y-2 w-full mt-12 mb-4">
                <h1 className="text-2xl font-bold mt-6 text-gray-900 dark:text-white">Your Project Plan</h1>
                <h3 className="text-lg font-bold mt-6 text-gray-700 dark:text-white">
                    Complete this form to submit your project plan
                </h3>
                <div className='flex flex-col gap-1 pt-8'>
                    <span className='font-extrabold text-xl underline underline-offset-4 dark:text-white'>Important: </span>
                    <h2 className='text-base font-semibold mb-2 text-gray-900 dark:text-white italic underline underline-offset-2'>
                        Make sure to fill out all fields to the best of your ability. The more information we have, the better your dream outcome will be!
                    </h2>
                </div>
                <div>
                    <label className="block font-semibold text-gray-900 dark:text-white">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold text-gray-900 dark:text-white">Phone Number</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block font-semibold text-gray-900 dark:text-white">Full Name</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>
                {/* Add the rest of the form fields here, similar to the original OnboardingForm */}
                <div>
                    <label className="block font-semibold text-gray-900 dark:text-white">Business Name</label>
                    <input
                        type="text"
                        name="business_name"
                        value={formData.business_name}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>
                {/* Add other form fields here */}
                <div>
                    <label className="block font-semibold text-gray-900 dark:text-white">Would you like to create an account?</label>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="create_account"
                            checked={formData.create_account}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label className="text-gray-900 dark:text-white">Yes, I want to create an account</label>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default PublicOnboardingForm;