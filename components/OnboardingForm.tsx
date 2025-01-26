'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

interface OnboardingFormProps {
    onComplete: (formData: any) => void;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
    const [formData, setFormData] = useState({
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
        organization_id: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [fileDescription, setFileDescription] = useState('');
    const [files, setFiles] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: user, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                setError('User not authenticated');
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('organization_id')
                .eq('user_id', user.user.id)
                .single();

            if (profileError) {
                setError('Failed to fetch profile');
                return;
            }

            if (!profile.organization_id) {
                // Create a new organization if the user doesn't have one
                const { data: orgData, error: orgError } = await supabase
                    .from('organizations')
                    .insert([{ name: formData.business_name }])
                    .select()
                    .single();

                if (orgError) {
                    setError('Failed to create organization');
                    return;
                }

                const organization_id = orgData.id;

                // Update profile with organization_id
                const { error: profileUpdateError } = await supabase
                    .from('profiles')
                    .update({ organization_id })
                    .eq('user_id', user.user.id);

                if (profileUpdateError) {
                    setError('Failed to update profile with organization_id');
                    return;
                }

                setFormData((prev) => ({
                    ...prev,
                    organization_id
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    organization_id: profile.organization_id
                }));
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            uploadFiles(filesArray);
        }
    };

    const uploadFiles = async (filesArray: globalThis.File[]) => {
        setUploading(true);
        try {
            const { data: user, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                throw new Error('User not authenticated');
            }

            for (const file of filesArray) {
                const fileId = uuidv4();
                const { data, error } = await supabase.storage
                    .from('client-files')
                    .upload(`public/${fileId}`, file);

                if (error) {
                    throw error;
                }

                const fileUrl = data?.path;
                if (!fileUrl) {
                    throw new Error('File upload failed, no path returned');
                }

                const { error: insertError } = await supabase.from('files').insert([
                    {
                        user_id: user.user.id,
                        file_name: file.name,
                        file_id: fileId,
                        file_url: fileUrl,
                        file_description: fileDescription,
                    },
                ]);

                if (insertError) {
                    throw insertError;
                }
            }

            const { data: filesData, error: filesError } = await supabase
                .from('files')
                .select('*')
                .eq('user_id', user.user.id);

            if (filesError) {
                throw new Error('Failed to fetch files');
            }

            const filesWithSignedUrls = await Promise.all(
                filesData.map(async (file) => {
                    const { data, error } = await supabase.storage
                        .from('client-files')
                        .createSignedUrl(`public/${file.file_id}`, 60);

                    if (error) {
                        throw error;
                    }

                    return { ...file, signedURL: data.signedUrl };
                })
            );

            setFiles(filesWithSignedUrls);
        } catch (error: any) {
            alert('Error uploading files: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage('');

        if (!formData.organization_id) {
            alert('Organization ID is not set. Please try again.');
            setIsSubmitting(false);
            return;
        }

        try {
            const { data: user, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                throw new Error('User not authenticated');
            }

            const { error: formError } = await supabase.from('client_project_plan').insert([
                { ...formData, organization_id: formData.organization_id }
            ]);

            if (formError) {
                throw formError;
            }

            setSuccessMessage('Your project plan has been successfully submitted!');
            onComplete(formData);
        } catch (error: any) {
            alert('There was an error submitting the form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="w-[70vw] h-fit mx-auto p-8 bg-white mt-12 mb-12 dark:bg-gray-700 rounded shadow">
                {successMessage && <p className="text-green-600 dark:text-green-400 mb-4">{successMessage}</p>}
                <form onSubmit={handleSubmit} className="space-y-2 w-full mt-12 mb-4">
                    <h1 className="text-2xl font-bold mt-6 text-gray-900 dark:text-white">Client Project Plan</h1>
                    <div className='flex flex-col gap-1 pt-8'>
                        <span className='font-extrabold text-xl underline underline-offset-4 dark:text-white'>Important: </span>
                        <h2 className='text-base font-semibold mb-2 text-gray-900 dark:text-white italic underline underline-offset-2'>
                            Make sure to fill out all fields to the best of your ability. The more information we have, the better your dream outcome will be!
                        </h2>
                    </div>
                    <div className='mt-4'>
                        <label htmlFor="business_name" className="block font-semibold mt-4 text-gray-900 dark:text-white">Business Name</label>
                        <input
                            type="text"
                            id="business_name"
                            name="business_name"
                            placeholder='Acme Inc.'
                            value={formData.business_name}
                            onChange={handleChange}
                            className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="business_description" className="block font-semibold text-gray-900 dark:text-white">Describe Your Business/Project</label>
                        <textarea
                            id="business_description"
                            name="business_description"
                            placeholder='Give us the best description of your business or project; the more we know, the better.'
                            value={formData.business_description}
                            onChange={handleChange}
                            className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                            rows={3}
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="target_audience" className="block font-semibold text-gray-900 dark:text-white">Target Audience</label>
                        <input
                            id="target_audience"
                            name="target_audience"
                            placeholder="Who&apos;s attention are you trying to capture?"
                            value={formData.target_audience}
                            onChange={handleChange}
                            className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        ></input>
                    </div>

                    <div>
                        <label htmlFor="project_goals" className="block font-semibold text-gray-900 dark:text-white">Project Goals</label>
                        <textarea
                            id="project_goals"
                            name="project_goals"
                            placeholder='Tell us your dreams... specifically related to this project.'
                            value={formData.project_goals}
                            onChange={handleChange}
                            className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                            rows={2}
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="design_style" className="block font-semibold text-gray-900 dark:text-white">Preferred Design Style</label>
                        <textarea
                            id="design_style"
                            name="design_style"
                            placeholder='Modern, minimal, eccentric etc. - be as specific as you&apos;d like (just remember to read the note we made on top of this form).'
                            value={formData.design_style}
                            onChange={handleChange}
                            rows={2}
                            className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="branding_materials" className="block font-semibold text-gray-900 dark:text-white">Do you have branding materials? (If no, what are you missing?)</label>
                        <textarea
                            id="branding_materials"
                            name="branding_materials"
                            placeholder='Logo, color scheme, fonts, etc.'
                            value={formData.branding_materials}
                            onChange={handleChange}
                            className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        />
                        <div className="relative mt-2">
                            <label className="block font-semibold text-gray-900 dark:text-white pb-2">Upload as many materials needed relevant to your project</label>
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Upload Files
                            </button>
                        </div>
                        <textarea
                            value={fileDescription}
                            onChange={(e) => setFileDescription(e.target.value)}
                            placeholder="File description"
                            rows={2}
                            className="shadow-sm mt-2 w-1/4 p-2 border border-gray-300 rounded bg-white dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="inspiration" className="block font-semibold text-gray-900 dark:text-white">Websites/Apps You Like (Inspiration)</label>
                        <textarea
                            id="inspiration"
                            name="inspiration"
                            placeholder='List some websites (comma seperated)'
                            value={formData.inspiration}
                            onChange={handleChange}
                            className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                            rows={1}
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="budget_range" className="block font-semibold text-gray-900 dark:text-white">Budget Range (USD)</label>
                        <input
                            type="text"
                            id="budget_range"
                            name="budget_range"
                            placeholder='this is optional - but it helps us understand if what you&apos;re looking for is going to be feasible'
                            value={formData.budget_range}
                            onChange={handleChange}
                            className="shadow-sm w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="timeline" className="block font-semibold text-gray-900 dark:text-white">Ideal Timeline</label>
                        <input
                            type="text"
                            id="timeline"
                            name="timeline"
                            placeholder='When would you -like- to have this project completed? We&apos;ll let you know if we can meet your deadline.'
                            value={formData.timeline}
                            onChange={handleChange}
                            className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="other_info" className="block font-semibold text-gray-900 dark:text-white">Other Information</label>
                        <textarea
                            id="other_info"
                            name="other_info"
                            placeholder='Feel free to write anything else you think we should know, or anything else, poetry, what you had for breakfast, etc.'
                            value={formData.other_info}
                            onChange={handleChange}
                            className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                            rows={2}
                        ></textarea>
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
        </>
    );
};

export default OnboardingForm;