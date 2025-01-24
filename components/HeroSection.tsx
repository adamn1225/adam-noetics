"use client";
import React, { useState } from "react";
import { supabase } from "@lib/supabaseClient"; // Import Supabase client

const HeroSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleModalToggle = () => {
        setIsModalOpen((prev) => !prev);
        setSuccess(false);
        setError("");
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const { data, error } = await supabase.from("clients").insert([
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    service: formData.service,
                    message: formData.message,
                },
            ]);

            if (error) throw error;

            setSuccess(true);
            setFormData({
                name: "",
                email: "",
                phone: "",
                service: "",
                message: "",
            });
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="hero" className="bg-gray-900 text-white py-20">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-5xl font-bold mb-4">
                    Transform Your Ideas Into Reality
                </h1>
                <p className="text-lg mb-6">
                    Expert in building web applications, automations, and tools tailored
                    to your business needs.
                </p>
                <button
                    onClick={handleModalToggle}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full"
                >
                    Let&apos;s Work Together
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white text-gray-900 rounded-lg shadow-lg w-11/12 max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Get in Touch</h2>
                            <button
                                onClick={handleModalToggle}
                                className="text-gray-500 hover:text-gray-800 font-bold text-lg"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Your Name"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>

                            {/* Phone (Optional) */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Phone (Optional)
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="+1234567890"
                                />
                            </div>

                            {/* Dropdown for Services */}
                            <div>
                                <label
                                    htmlFor="service"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    What Service Are You Interested In?
                                </label>
                                <select
                                    id="service"
                                    value={formData.service}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="" disabled>
                                        Select a service
                                    </option>
                                    <option value="web_app">Custom Web App Development</option>
                                    <option value="automation">Automation</option>
                                    <option value="tools">Custom Tool Creation</option>
                                    <option value="api">API Integration</option>
                                    <option value="web_scraping">Web Scraping</option>
                                    <option value="chrome_extensions">
                                        Chrome Extension Development
                                    </option>
                                </select>
                            </div>

                            {/* Message */}
                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Tell me about your project or idea..."
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md"
                            >
                                {loading ? "Submitting..." : "Send Message"}
                            </button>

                            {success && (
                                <p className="text-green-500 mt-2">
                                    Message sent successfully!
                                </p>
                            )}
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};

export default HeroSection;
