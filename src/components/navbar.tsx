import Link from "next/link";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-5xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between h-7">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/story" className="text-l font-bold text-purple-800 font-sans">
             Sufiya
            </Link>
          </div>
          <div className="flex items-center">
            <ClerkLoading>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </ClerkLoading>
            <ClerkLoaded>
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-5 w-5"
                    }
                  }}
                />
              </SignedIn>
              <SignedOut>
                <Link 
                  href="/sign-in" 
                  className="text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link 
                  href="/sign-up" 
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Register
                </Link>
              </SignedOut>
            </ClerkLoaded>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;