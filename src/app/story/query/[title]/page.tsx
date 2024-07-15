"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { getStoriesByTitle } from '@/action/action';
import { useUser } from "@clerk/nextjs";
import { motion } from 'framer-motion';
import { title } from 'process';

interface Story {
  id: string;
  title: string;
  updatedAt: Date;
  createdAt: Date;
}

const TitleStory = ({ params }: { params: { title: string } }) => {
  const { user } = useUser();
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchStoriesByTitle() {
      if (!user) {
        setError('Please login to see stories');
        setLoading(false);
        return;
      }

      try {
        const fetchedStories = await getStoriesByTitle(params.title);
        setStories(fetchedStories);
        setError('');
      } catch (error) {
        console.error("Failed to fetch stories:", error);
        setError("Failed to load stories. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchStoriesByTitle();
  }, [user, params.title]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen m-0 bg-gradient-to-br from-blue-50 to-blue-600 p-4"
    >
      <motion.div 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-lg shadow-2xl p-8"
      >
        <Link href="/story" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-300">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Stories
            </Link>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">Stories with title: {params.title}</h1>
        </div>

        {loading ? (
          <motion.div 
            initial={{ scale: 0.8 }} 
            animate={{ scale: 1 }} 
            transition={{ yoyo: Infinity, duration: 0.5 }}
            className="text-center text-blue-500 font-semibold"
          >
            Loading stories...
          </motion.div>
        ) : error ? (
          <motion.p 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            className="text-red-500 text-center font-semibold"
          >
            {error}
          </motion.p>
        ) : stories.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h2 className="text-xl font-semibold mb-4 font-sans text-blue-700">Found Stories</h2>
            <ul className="space-y-4">
              {stories.map((story, index) => (
                <motion.li 
                  key={story.id} 
                  initial={{ x: -20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }} 
                  transition={{ delay: index * 0.1 }}
                  className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <Link href={`/story/query/${title}/${story.id}`} className="text-blue-600 hover:text-blue-800 transition-colors duration-300">
                    <h3 className="text-lg font-semibold font-serif">{story.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-600 mt-2">
                    Created: {new Date(story.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : (
          <motion.p 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            className="text-center text-gray-600 font-semibold"
          >
            No stories found with this title.
          </motion.p>
        )}

        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Link href="/story/new" className="bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg">
            Create New Story
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default TitleStory;