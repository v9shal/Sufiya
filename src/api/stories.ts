// pages/api/stories.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/db';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { title, content } = req.body;

  try {
    const story = await prisma.story.create({
      data: {
        title,
        content,
        user: userId, // Use the Clerk user ID directly
      },
    });
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ error: "Failed to create story" });
  }
}