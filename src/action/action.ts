"use server"

import prisma from "@/lib/db";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { promises } from "dns";
interface Story {
  id: string;
  title: string;
  updatedAt: Date;
  createdAt:Date
}


const storySchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  id: z.string().optional(),
});

type StoryInput = z.infer<typeof storySchema>;

export async function upsertStory(formData: FormData) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized: User not authenticated");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const idFromForm = formData.get("id");

  const input: StoryInput = {
    title,
    content,
    ...(idFromForm ? { id: idFromForm as string } : {}),
  };

  try {
    const validatedInput = storySchema.parse(input);

    if (validatedInput.id) {
      // Update existing story
      const story = await prisma.story.update({
        where: { id: validatedInput.id },
        data: {
          title: validatedInput.title,
          content: validatedInput.content,
          user: userId,
        },
      });
      return { success: true, story };
    } else {
      // Create new story
      const story = await prisma.story.create({
        data: {
          user: userId,
          title: validatedInput.title,
          content: validatedInput.content,
        },
      });
      return { success: true, story };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod validation error:", error.errors);
      return { success: false, error: "Invalid input data", details: error.errors };
    }
    console.error("Error upserting story:", error);
    throw new Error("Failed to upsert story");
  }
}

export async function getStories() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized: User not authenticated");
  }

  try {
    const stories = await prisma.story.findMany({
      where: { user: userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    return stories;
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw new Error("Failed to fetch stories");
  }
}
export async function getStoriesByTitle(title: string): Promise<Story[]> {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized: User not authenticated");
  }

  try {
    const stories = await prisma.story.findMany({
      where: { 
        title: title as string
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        createdAt:true,
      }
    });
    return stories;
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error; // Re-throw the error to be caught in the component
  }
}
export async function getStoriesById(storyId: string): Promise<Story | null> {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized: User not authenticated");
  }

  try {
    const story = await prisma.story.findFirst({
      where: { 
        id: storyId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    return story;
  } catch (error) {
    console.error("Error fetching story:", error);
    throw new Error("Failed to fetch story");
  }
}
