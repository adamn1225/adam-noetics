import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';

interface OnboardingFormReviewProps {
    formData: any;
    onEdit: (updatedFormData: any) => void;
}

const OnboardingFormReview: React.FC<OnboardingFormReviewProps> = ({ formData, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedFormData, setUpdatedFormData] = useState(formData);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: user, error: userError } = await supabase.auth.getUser();
                if (userError || !user) {
                    throw new Error('User not authenticated');
                }

                const { data, error } = await supabase
                    .from('client_project_plan')
                    .select('*')
                    .eq('user_id', user.user.id)
                    .single();

                if (error) {
                    throw error;
                }

                setUpdatedFormData(data);
            } catch (error: any) {
                console.error('Error fetching form data:', error.message);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setUpdatedFormData((prev: typeof formData) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        try {
            if (!updatedFormData.id) {
                throw new Error('Form data is missing an id');
            }

            // Ensure user_id is included in the updated form data
            if (!updatedFormData.user_id) {
                throw new Error('Form data is missing a user_id');
            }

            // Update the client_project_plan table with the updated form data
            const { error: formError } = await supabase
                .from('client_project_plan')
                .update(updatedFormData)
                .eq('id', updatedFormData.id);

            if (formError) {
                throw formError;
            }

            onEdit(updatedFormData);
            setIsEditing(false);
        } catch (error: any) {
            console.error('Error updating form:', error.message);
            alert('There was an error updating the form. Please try again.');
        }
    };

    return (
        <div className="bg-gray-200 dark:bg-gray-900 py-6 mt-12">
            <div className="w-[70vw] h-fit mx-auto p-8 bg-white dark:bg-gray-800 rounded shadow">
                <h1 className="text-2xl font-bold mt-6 text-gray-900 dark:text-white">Review Your Project Plan</h1>
                {isEditing ? (
                    <form className="space-y-2 w-full mt-12 mb-4">
                        {/* General Business Information */}
                        <div className='mt-4'>
                            <label htmlFor="business_name" className="block font-semibold mt-4 text-gray-900 dark:text-white">Business Name</label>
                            <input
                                type="text"
                                id="business_name"
                                name="business_name"
                                value={updatedFormData.business_name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="business_description" className="block font-semibold text-gray-900 dark:text-white">Describe Your Business/Project</label>
                            <textarea
                                id="business_description"
                                name="business_description"
                                value={updatedFormData.business_description}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50  text-gray-800 dark:bg-gray-700 dark:text-white"
                                rows={3}
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block font-semibold text-gray-900 dark:text-white">Do you have a website?</label>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="current_website_yes"
                                    name="current_website"
                                    value="true"
                                    checked={updatedFormData.current_website === true}
                                    onChange={() => setUpdatedFormData((prev: typeof formData) => ({ ...prev, current_website: true }))}
                                    className="mr-2 text-gray-800"
                                />
                                <label htmlFor="current_website_yes" className="mr-4 text-gray-900 dark:text-white">Yes</label>
                                <input
                                    type="radio"
                                    id="current_website_no"
                                    name="current_website"
                                    value="false"
                                    checked={updatedFormData.current_website === false}
                                    onChange={() => setUpdatedFormData((prev: typeof formData) => ({ ...prev, current_website: false, website_name: '' }))}
                                    className="mr-2 text-gray-800"
                                />
                                <label htmlFor="current_website_no" className="text-gray-900 dark:text-white">No</label>
                            </div>
                        </div>

                        {updatedFormData.current_website && (
                            <div>
                                <label htmlFor="website_name" className="block font-semibold text-gray-900 dark:text-white">Website Domain Name</label>
                                <input
                                    type="text"
                                    id="website_name"
                                    name="website_name"
                                    placeholder='e.g., www.example.com'
                                    value={updatedFormData.website_name}
                                    onChange={handleChange}
                                    className="w-full p-2 text-gray-800 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="target_audience" className="block font-semibold text-gray-900 dark:text-white">Target Audience</label>
                            <input
                                id="target_audience"
                                name="target_audience"
                                value={updatedFormData.target_audience}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-white"
                                required
                            ></input>
                        </div>

                        {/* Project Details */}
                        <div>
                            <label htmlFor="project_goals" className="block font-semibold text-gray-900 dark:text-white">Project Goals</label>
                            <textarea
                                id="project_goals"
                                name="project_goals"
                                value={updatedFormData.project_goals}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-white"
                                rows={2}
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="design_style" className="block font-semibold text-gray-900 dark:text-white">Preferred Design Style</label>
                            <textarea
                                id="design_style"
                                name="design_style"
                                value={updatedFormData.design_style}
                                onChange={handleChange}
                                rows={2}
                                className="w-full p-2 border rounded bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="branding_materials" className="block font-semibold text-gray-900 dark:text-white">Do you have branding materials? (If no, what are you missing?)</label>
                            <textarea
                                id="branding_materials"
                                name="branding_materials"
                                value={updatedFormData.branding_materials}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="inspiration" className="block font-semibold text-gray-900 dark:text-white">Websites/Apps You Like (Inspiration)</label>
                            <textarea
                                id="inspiration"
                                name="inspiration"
                                value={updatedFormData.inspiration}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-white"
                                rows={1}
                            ></textarea>
                        </div>

                        {/* Budget and Timeline */}
                        <div>
                            <label htmlFor="budget_range" className="block font-semibold text-gray-900 dark:text-white">Budget Range (USD)</label>
                            <input
                                type="text"
                                id="budget_range"
                                name="budget_range"
                                value={updatedFormData.budget_range}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="timeline" className="block font-semibold text-gray-900 dark:text-white">Ideal Timeline</label>
                            <input
                                type="text"
                                id="timeline"
                                name="timeline"
                                value={updatedFormData.timeline}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Additional Information */}
                        <div>
                            <label htmlFor="other_info" className="block font-semibold text-gray-900 dark:text-white">Other Information</label>
                            <textarea
                                id="other_info"
                                name="other_info"
                                value={updatedFormData.other_info}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-white"
                                rows={2}
                            ></textarea>
                        </div>

                        <button
                            type="button"
                            onClick={handleSave}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </form>
                ) : (
                    <div className="space-y-2 w-full mt-12 mb-4">
                        {/* General Business Information */}
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Business Name</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.business_name}</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Describe Your Business/Project</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.business_description}</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Target Audience</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.target_audience}</p>

                        {/* Project Details */}
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Goals</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.project_goals}</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preferred Design Style</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.design_style}</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Do you have branding materials?</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.branding_materials}</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Websites/Apps You Like (Inspiration)</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.inspiration}</p>

                        {/* Budget and Timeline */}
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Budget Range (USD)</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.budget_range}</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ideal Timeline</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.timeline}</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Do you have a website?</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.current_website ? 'Yes' : 'No'}</p>

                        {formData.current_website && (
                            <>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Website Domain Name</h2>
                                <p className="text-gray-700 dark:text-gray-300">{formData.website_name}</p>
                            </>
                        )}

                        {/* Additional Information */}
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Other Information</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.other_info}</p>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Edit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OnboardingFormReview;