'use client';

import React, { useState } from 'react';
import { supabase } from '@lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

interface OnboardingFormProps {
    onComplete: (formData: any) => void;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
    const [formData, setFormData] = useState({
        businessName: '',
        businessDescription: '',
        targetAudience: '',
        projectGoals: '',
        designStyle: '',
        brandingMaterials: '',
        inspiration: '',
        colorPreferences: '',
        features: '',
        userAuthentication: '',
        contentManagement: '',
        ecommerceNeeds: '',
        integrations: '',
        contentReady: '',
        pageCount: '',
        seoAssistance: '',
        domainInfo: '',
        hostingInfo: '',
        maintenanceNeeds: '',
        budgetRange: '',
        timeline: '',
        analytics: '',
        training: '',
        additionalServices: '',
        otherInfo: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [fileDescription, setFileDescription] = useState('');
    const [files, setFiles] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

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
            // Get the current user
            const { data: user, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                throw new Error('User not authenticated');
            }

            for (const file of filesArray) {
                const fileId = uuidv4(); // Generate a UUID for the file_id
                console.log(`Uploading file: ${file.name} with fileId: ${fileId}`);
                const { data, error } = await supabase.storage
                    .from('client-files')
                    .upload(`public/${fileId}`, file);

                if (error) {
                    console.error('Error uploading file:', error);
                    throw error;
                }

                const fileUrl = data?.path;
                console.log(`File uploaded successfully: ${fileUrl}`);

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
                    console.error('Error inserting file record:', insertError);
                    throw insertError;
                }
            }

            // Refresh the files list
            const { data: filesData, error: filesError } = await supabase
                .from('files')
                .select('*')
                .eq('user_id', user.user.id);

            if (filesError) {
                throw new Error('Failed to fetch files');
            }

            // Generate signed URLs for the files
            const filesWithSignedUrls = await Promise.all(
                filesData.map(async (file) => {
                    const { data, error } = await supabase.storage
                        .from('client-files')
                        .createSignedUrl(`public/${file.file_id}`, 60); // URL valid for 60 seconds

                    if (error) {
                        console.error('Error generating signed URL:', error);
                        throw error;
                    }

                    console.log(`Generated signed URL for file ${file.file_id}: ${data.signedUrl}`);
                    return { ...file, signedURL: data.signedUrl };
                })
            );

            setFiles(filesWithSignedUrls);
        } catch (error: any) {
            console.error('Error uploading files:', error);
            alert('Error uploading files: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage('');

        const { error } = await supabase.from('client-project-plan').insert([formData]);

        if (error) {
            console.error('Error submitting form:', error.message);
            alert('There was an error submitting the form. Please try again.');
        } else {
            setSuccessMessage('Your project plan has been successfully submitted!');
            onComplete(formData);
        }

        setIsSubmitting(false);
    };

    return (
        <>
            <div className="w-[70vw] h-fit mx-auto p-8 bg-white mt-12 mb-4 dark:bg-gray-800 rounded shadow">

                {successMessage && <p className="text-green-600 dark:text-green-400 mb-4">{successMessage}</p>}
                <form onSubmit={handleSubmit} className="space-y-2 w-full mt-12 mb-4">
                    {/* General Business Information */}
                    <h1 className="text-2xl font-bold mt-6 text-gray-900 dark:text-white">Client Project Plan</h1>
                    <div className='flex flex-col gap-1 pt-8'>
                        <span className='font-extrabold text-xl underline underline-offset-4'>Important: </span>
                        <h2 className='text-lg font-semibold mb-2 text-gray-900 dark:text-white italic underline underline-offset-2'>
                            Make sure to fill out all fields to the best of your ability. The more information we have, the better your dream outcome will be!
                        </h2>
                    </div>
                    <div className='mt-4'>
                        <label htmlFor="businessName" className="block font-semibold mt-4 text-gray-900 dark:text-white">Business Name</label>
                        <input
                            type="text"
                            id="businessName"
                            name="businessName"
                            placeholder='Acme Inc.'
                            value={formData.businessName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="businessDescription" className="block font-semibold text-gray-900 dark:text-white">Describe Your Business/Project</label>
                        <textarea
                            id="businessDescription"
                            name="businessDescription"
                            placeholder='Give us the best description of your business or project; the more we know, the better.'
                            value={formData.businessDescription}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                            rows={3}
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="targetAudience" className="block font-semibold text-gray-900 dark:text-white">Target Audience</label>
                        <input
                            id="targetAudience"
                            name="targetAudience"
                            placeholder="Who&apos;s attention are you trying to capture?"
                            value={formData.targetAudience}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        ></input>
                    </div>

                    {/* Project Details */}
                    <div>
                        <label htmlFor="projectGoals" className="block font-semibold text-gray-900 dark:text-white">Project Goals</label>
                        <textarea
                            id="projectGoals"
                            name="projectGoals"
                            placeholder='Tell us your dreams... specifically related to this project.'
                            value={formData.projectGoals}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                            rows={2}
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="designStyle" className="block font-semibold text-gray-900 dark:text-white">Preferred Design Style</label>
                        <textarea
                            id="designStyle"
                            name="designStyle"
                            placeholder='Modern, minimal, eccentric etc. - be as specific as you&apos;d like (just remember to read the note we made on top of this form).'
                            value={formData.designStyle}
                            onChange={handleChange}
                            rows={2}
                            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="brandingMaterials" className="block font-semibold text-gray-900 dark:text-white">Do you have branding materials? (If no, what are you missing?)</label>
                        <textarea
                            id="brandingMaterials"
                            name="brandingMaterials"
                            placeholder='Logo, color scheme, fonts, etc.'
                            value={formData.brandingMaterials}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        />
                        <div className="relative mt-2">
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
                        <input
                            type="text"
                            value={fileDescription}
                            onChange={(e) => setFileDescription(e.target.value)}
                            placeholder="File description"
                            className="mt-2 p-2 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
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
                            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                            rows={1}
                        ></textarea>
                    </div>

                    {/* Budget and Timeline */}
                    <div>
                        <label htmlFor="budgetRange" className="block font-semibold text-gray-900 dark:text-white">Budget Range (USD)</label>
                        <input
                            type="text"
                            id="budgetRange"
                            name="budgetRange"
                            placeholder='this is optional - but it helps us understand if what you&apos;re looking for is going to be feasible'
                            value={formData.budgetRange}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
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
                            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Additional Information */}
                    <div>
                        <label htmlFor="otherInfo" className="block font-semibold text-gray-900 dark:text-white">Other Information</label>
                        <textarea
                            id="otherInfo"
                            name="otherInfo"
                            placeholder='Feel free to write anything else you think we should know, or anything else, poetry, what you had for breakfast, etc.'
                            value={formData.otherInfo}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
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