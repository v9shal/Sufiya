"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getStories } from "@/action/action";
import Link from "next/link";
import Search from "./search";
import { motion } from 'framer-motion';

interface Story {
  id: string;
  title: string;
  updatedAt: Date;
}

export default function Home() {
  const { user } = useUser();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStories() {
      if (!user) return;

      try {
        const fetchedStories = await getStories();
        setStories(fetchedStories);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
        setError("Failed to load stories. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-7 px-2 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto bg-white bg-opacity-90 rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <motion.div
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            className="flex justify-between items-center mb-1"
          >
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Hello, {user?.username}
            </h1>
            <Search />
          </motion.div>

          {loading ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-lg text-gray-600"
            >
              Loading your stories...
            </motion.p>
          ) : error ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-center text-lg"
            >
              {error}
            </motion.p>
          ) : stories.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Your Stories</h2>
              <ul className="space-y-4">
                {stories.map((story, index) => (
                  <motion.li
                    key={story.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                  >
                    <Link href={`/story/${story.id}`} className="text-indigo-600 hover:text-indigo-800 transition duration-300">
                      <h3 className="text-xl font-semibold">{story.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-2">
                      Last updated: {new Date(story.updatedAt).toLocaleString()}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-lg text-gray-600"
            >
              You havent created any stories yet.
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Link href="/story/new" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-full hover:from-purple-600 hover:to-pink-600 transition duration-300 shadow-md hover:shadow-lg">
              Create New Story
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}