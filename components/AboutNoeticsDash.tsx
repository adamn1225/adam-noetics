import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ga4noetics from '/public/ga4-nextnoetics-dark.png';
import nnbuilder from '/public/SMM-Post_builder.png';
import smmnoetics from '/public/noetic-smm.png';
import { motion } from "framer-motion";
import { fadeInRight } from "../motionConfig";

const AboutNoeticsDash = () => {
    return (
        <motion.section id="services" className="bg-zinc-900 dark:bg-zinc-950 py-20" {...fadeInRight}>
            <div className="p-12 container mx-auto">
                <h2 className="text-4xl font-bold mb-6 text-secondary text-center">Effortless Social Media Management: Design, Schedule, Publish with Noetics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <div className="flex flex-col items-center justify-evenly gap-2 bg-gray-100 dark:bg-zinc-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold mb-2 dark:text-secondary  text-center">Google Analytics 4 Dashboard</h3>
                        <p className="mb-2 text-center text-base">View your GA4 data - search pages, easier to read, & customizable.</p>
                        <Image
                            src={ga4noetics}
                            alt="Noetics Google Analytics 4 Dashboard"
                            width={450}
                            height={200}
                            className="mb-7 shadow-teal-200 shadow-lg"
                        />
                        <h3 className="text-lg font-semibold mb-2 ">Other SEO Tools you can integrate with:</h3>
                        <ul className="list-disc list-inside text-lg font-semibold">
                            <li>SemRush</li>
                            <li>Ahrefs</li>
                            <li>Moz & Hotjar (Coming soon)</li>
                        </ul>
                    </div> */}
                    <div className="flex flex-col items-center justify-evenly gap-2 bg-gray-200 dark:bg-zinc-800 p-3 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold mb-2 dark:text-primary">Noetics Landing Pagebuilder &amp; CMS</h3>
                        <p className="text-center text-base">Manage your content, blogs, & landing pages.</p>
                        <Image
                            src={nnbuilder}
                            alt="Noetics Content Management System"
                            width={600}
                            height={200}
                            className="mb-7 shadow-teal-200 shadow-lg"
                        />
                        <h3 className="text-lg font-semibold mb-2 text-center">"Create High-Impact Posts, Zero Hassle</h3>
                        <ul className="list-disc list-inside text-lg font-semibold">
                            <li>URL to post conversion</li>
                            <li>Access thousands of images</li>
                            <li>Card size selection fit for all SM Platforms</li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-center justify-evenly gap-2 bg-gray-300 dark:bg-zinc-800 p-3 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold mb-2 dark:text-primary  text-center">Smart Scheduling—All in One Platform.</h3>
                        <p className="text-center text-base">Plan your & schedule your social media posts & analyze performance.</p>
                        <Image
                            src={smmnoetics}
                            alt="Noetics social media calendar"
                            width={600}
                            height={200}
                            className="mb-7 shadow-teal-200 shadow-lg"
                        />
                        <h3 className="text-lg font-semibold mb-2">Social Media PlatForms</h3>
                        <ul className="list-disc list-inside text-lg font-semibold">
                            <li>Facebook</li>
                            <li>Instagram</li>
                            <li>Twitter</li>
                            <li>LinkedIn</li>
                        </ul>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default AboutNoeticsDash;