import { Suspense } from 'react'
import TextEditor from '../../../components/editor'
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Link from 'next/link';
import RefreshLink from '@/components/refreshLink';
import { motion } from 'framer-motion';

async function getStory(storyId: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized: User not authenticated");
  }

  if (!storyId) {
    throw new Error("Story ID is required");
  }
    
  const story = await prisma.story.findUnique({
    where: {
      id: storyId,
    },
    select:{
      title:true,
      content:true,
      user:true,
      id:true
    }
  });

  if (story && story.user !== userId) {
    throw new Error("Unauthorized: User does not have access to this story");
  }

  return story;
}

export default async function StoryPage({ params }: { params: { storyid: string } }) {
  const { userId } = auth();
  
  try {
    const story = await getStory(params.storyid);

    if (!story) {
      return (
        <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Story not found</h1>
            <p className="text-gray-600">The story youre looking for doesnt exist or has been removed.</p>
            <Link href="/story" className="mt-6 inline-block bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
              Back to Stories
            </Link>
          </div>
        </div>
      );
    }

    return userId ? (
      <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-6 sm:p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white shadow-text">Your Story</h1>
            <RefreshLink href='/story' >
              ALL STORIES
            </RefreshLink>
          </div>
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden transition duration-300 ease-in-out hover:shadow-3xl">
            <Suspense fallback={
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
              </div>
            }>
              <TextEditor initialTitle={story.title} initialContent={story.content} storyId={story.id} />
            </Suspense>
          </div>
        </div>
      </div>
    ) : (
      <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to edit this story</p>
          <Link href="/story" className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg inline-block">
            Go to Home
          </Link>
        </div>
      </div>
    );
      
  } catch (error) {
    console.error("Error fetching story:", error);
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-800 mb-6">{(error as Error).message}</p>
          <Link href="/story" className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg inline-block">
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }
}