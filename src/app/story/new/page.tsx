"use client"

import Link from 'next/link';
import TextEditor from '@/components/editor';
import { motion } from 'framer-motion';

export default function StoryEditor() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-7 px-1 sm:px-9 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto bg-white bg-opacity-90 rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="px-9 py-3">
          <motion.nav 
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            className="mb-1"
          >
            <Link href="/story" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-300">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Stories
            </Link>
          </motion.nav>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-1"
          >
            Create Your Masterpiece
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <TextEditor />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}