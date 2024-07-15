"use client"

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { getStoriesById } from '@/action/action';
import Link from 'next/link';

interface Story {
    id: string,
    title: string,
    content: string,
    createdAt: Date,
    updatedAt: Date,
}

const StoryByTitle = () => {
    const [story, setStory] = useState<Story | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    const params = useParams();
    const { storyid } = params;

  
    useEffect(() => {
        const fetchStory = async () => {
            setLoading(true);
            try {
                const response = await getStoriesById(storyid as string);
                if (response && 
                    typeof response === 'object' &&
                    'id' in response && 
                    'title' in response && 
                    'content' in response &&
                    typeof response.content === 'string') {
                    const trimmedContent = response.content.slice(3, -4);
                    setStory({
                        ...response,
                        content: trimmedContent,
                        createdAt: new Date(response.createdAt),
                        updatedAt: new Date(response.updatedAt)
                    } as Story);
                } else {
                    setStory(null);
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        }
        fetchStory();
    }, [storyid]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white"></div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-red-500 to-orange-500">
            <div className="bg-white bg-opacity-80 border-2 border-red-600 text-red-700 px-6 py-4 rounded-lg shadow-lg" role="alert">
                <strong className="font-bold text-xl">Error: </strong>
                <span className="block sm:inline text-lg">{error}</span>
            </div>
        </div>
    );

    if (!story) return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-yellow-400 to-orange-500">
            <div className="bg-white bg-opacity-80 border-2 border-yellow-600 text-yellow-700 px-6 py-4 rounded-lg shadow-lg" role="alert">
                <strong className="font-bold text-xl">No story found.</strong>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-500 to-pink-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white bg-opacity-90 shadow-2xl rounded-lg overflow-hidden transform hover:scale-105 transition duration-300">
                <div className="px-8 py-6">
                <Link href="/story" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-300">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Stories
            </Link>
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-500 mb-6">{story.title}</h1>
                    <div className="text-sm text-gray-600 mb-6 flex justify-between">
                        <p>Created: <span className="font-semibold">{new Date(story.createdAt).toLocaleString()}</span></p>
                        <p>Last updated: <span className="font-semibold">{new Date(story.updatedAt).toLocaleString()}</span></p>
                    </div>
                    <div className="prose max-w-none">
                        <p className="text-gray-800 whitespace-pre-wrap text-lg leading-relaxed">{story.content.trimEnd()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StoryByTitle