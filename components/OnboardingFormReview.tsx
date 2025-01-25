import React, { useState } from 'react';
import { supabase } from '@lib/supabaseClient';

interface OnboardingFormReviewProps {
    formData: any;
    onEdit: (updatedFormData: any) => void;
}

const OnboardingFormReview: React.FC<OnboardingFormReviewProps> = ({ formData, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedFormData, setUpdatedFormData] = useState(formData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdatedFormData((prev: typeof formData) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        const { error } = await supabase
            .from('client-project-plan')
            .update(updatedFormData)
            .eq('id', formData.id);

        if (error) {
            console.error('Error updating form:', error.message);
            alert('There was an error updating the form. Please try again.');
        } else {
            onEdit(updatedFormData);
            setIsEditing(false);
        }
    };

    return (
        <div className="bg-gray-200 dark:bg-gray-900 min-h-screen pb-20">
            <div className="w-[70vw] h-fit mx-auto p-8 bg-white mt-12 mb-4 dark:bg-gray-800 rounded shadow">
                <h1 className="text-2xl font-bold mt-6 text-gray-900 dark:text-white">Review Your Project Plan</h1>
                {isEditing ? (
                    <form className="space-y-2 w-full mt-12 mb-4">
                        {/* General Business Information */}
                        <div className='mt-4'>
                            <label htmlFor="businessName" className="block font-semibold mt-4 text-gray-900 dark:text-white">Business Name</label>
                            <input
                                type="text"
                                id="businessName"
                                name="businessName"
                                value={updatedFormData.businessName}
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
                                value={updatedFormData.businessDescription}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                                rows={3}
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="targetAudience" className="block font-semibold text-gray-900 dark:text-white">Target Audience</label>
                            <input
                                id="targetAudience"
                                name="targetAudience"
                                value={updatedFormData.targetAudience}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                                required
                            ></input>
                        </div>

                        {/* Project Details */}
                        <div>
                            <label htmlFor="projectGoals" className="block font-semibold text-gray-900 dark:text-white">Project Goals</label>
                            <textarea
                                id="projectGoals"
                                name="projectGoals"
                                value={updatedFormData.projectGoals}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                                rows={2}
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label htmlFor="designStyle" className="block font-semibold text-gray-900 dark:text-white">Preferred Design Style</label>
                            <textarea
                                id="designStyle"
                                name="designStyle"
                                value={updatedFormData.designStyle}
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
                                value={updatedFormData.brandingMaterials}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label htmlFor="inspiration" className="block font-semibold text-gray-900 dark:text-white">Websites/Apps You Like (Inspiration)</label>
                            <textarea
                                id="inspiration"
                                name="inspiration"
                                value={updatedFormData.inspiration}
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
                                value={updatedFormData.budgetRange}
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
                                value={updatedFormData.timeline}
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
                                value={updatedFormData.otherInfo}
                                onChange={handleChange}
                                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
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
                        <p className="text-gray-700 dark:text-gray-300">{formData.businessName}</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Describe Your Business/Project</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.businessDescription}</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Target Audience</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.targetAudience}</p>

                        {/* Project Details */}
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Goals</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.projectGoals}</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preferred Design Style</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.designStyle}</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Do you have branding materials?</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.brandingMaterials}</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Websites/Apps You Like (Inspiration)</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.inspiration}</p>

                        {/* Budget and Timeline */}
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Budget Range (USD)</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.budgetRange}</p>

                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ideal Timeline</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.timeline}</p>

                        {/* Additional Information */}
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Other Information</h2>
                        <p className="text-gray-700 dark:text-gray-300">{formData.otherInfo}</p>
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