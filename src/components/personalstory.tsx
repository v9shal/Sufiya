
import {  Suspense } from 'react'
import TextEditor from '@/components/editor'
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Link from 'next/link';
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
    try {
    const story = await getStory(params.storyid);

    if (!story) {
      return <div>Story not found</div>
    }

    return (
      <div className='bg-slate-200'>
        <Link href="/story">Home</Link>
        <Suspense fallback={<div>Loading editor...</div>}>
          <TextEditor initialTitle={story.title} initialContent={story.content} storyId={story.id} />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error("Error fetching story:", error);
    return <div>Error: {(error as Error).message}</div>
  }
}