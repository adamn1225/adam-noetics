'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { Database } from '@lib/database.types';
import { v4 as uuidv4 } from 'uuid';
import DashboardLayout from '../UserLayout';

type File = Database['public']['Tables']['files']['Row'];

// Extend the File type to include signedURL
type FileWithSignedURL = File & { signedURL: string };

const FilesPage = () => {
    const [files, setFiles] = useState<FileWithSignedURL[]>([]);
    const [uploading, setUploading] = useState(false);
    const [fileDescription, setFileDescription] = useState('');

    // Define the bucket name
    const BUCKET_NAME = 'client-files';

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                // Get the current user
                const { data: user, error: userError } = await supabase.auth.getUser();
                if (userError || !user) {
                    throw new Error('User not authenticated');
                }

                // Fetch files for the logged-in user
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
                            .from(BUCKET_NAME)
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
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };

        fetchFiles();
    }, []);

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
                    .from(BUCKET_NAME)
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
                        .from(BUCKET_NAME)
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

    const handleDeleteFile = async (fileId: string) => {
        try {
            const { error } = await supabase.from('files').delete().eq('file_id', fileId);
            if (error) {
                throw error;
            }

            // Refresh the files list
            const { data: user, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                throw new Error('User not authenticated');
            }

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
                        .from(BUCKET_NAME)
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
            console.error('Error deleting file:', error);
            alert('Error deleting file: ' + error.message);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4 pt-6">Upload Files</h1>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="mb-4"
                />
                <input
                    type="text"
                    value={fileDescription}
                    onChange={(e) => setFileDescription(e.target.value)}
                    placeholder="File description"
                    className="mb-4 p-2 border border-gray-300 rounded"
                />
                <button
                    onClick={() => uploadFiles([])}
                    disabled={uploading}
                    className="bg-blue-600 text-white py-2 px-4 rounded"
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {files.map((file) => (
                        <div key={file.file_id} className="border bg-white p-4 rounded shadow">
                            <h2 className="text-lg font-bold">{file.file_name}</h2>
                            <p className="text-sm text-gray-600">{file.file_description}</p>
                            <p className="text-sm text-gray-600">{new Date(file.created_at!).toLocaleDateString()}</p>
                            <div className='flex justify-between items-center mt-4'>
                                <a href={file.signedURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                    View File
                                </a>
                                <button
                                    onClick={() => handleDeleteFile(file.file_id)}
                                    className="bg-red-600 text-white py-1 px-2 rounded mt-2"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default FilesPage;