"use client";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export default  function Home() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const {  isSignedIn, user } = useUser();
   if (!isLoaded || !userId) {
    return null;
  }
  const name=user?.username

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen m-0 bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Hello, {name}!</h1>
        <p className="text-gray-600 mb-6">Nothing to dssee here...</p>
        <Link href="/story">
          <div className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out">
            Click here to enter room
        </div>
        </Link>
      </div>
    </div>

  );
}
