"use client";

import { UserProfile, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-800 text-white">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">Loading profile...</div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-opacity-75"></div>
        </div>
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center bg-gray-800 text-white">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">Please sign in to view your profile</div>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date | null | undefined) => {
    return date ? new Date(date).toLocaleDateString() : "Not available";
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-800 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-green-400 text-center">Your Profile</h1>
        <div className="bg-gray-700 rounded-lg shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
            <img
              src={user.imageUrl}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-32 h-32 rounded-full mb-4 sm:mb-0 sm:mr-6 border-4 border-green-500 shadow-md transition-transform duration-300 hover:scale-105"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-semibold mb-2 text-green-300">{`${user.firstName} ${user.lastName}`}</h2>
              <p className="text-gray-300 mb-2">{user.primaryEmailAddress?.emailAddress || "No email provided"}</p>
              <p className="text-gray-400">Member since: {formatDate(user.createdAt)}</p>
            </div>
          </div>
          <div className="border-t border-gray-600 pt-6">
            <h3 className="text-2xl font-semibold mb-4 text-green-400">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <p className="text-gray-400 mb-1">Username</p>
                <p className="font-medium text-white">{user.username || "Not set"}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <p className="text-gray-400 mb-1">Last Sign In</p>
                <p className="font-medium text-white">{formatDate(user.lastSignInAt)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-700 rounded-lg shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
          <h3 className="text-2xl font-semibold mb-4 text-green-400">Manage Your Account</h3>
          <p className="mb-6 text-gray-300">
            Use the form below to update your profile information or manage your account settings.
          </p>
          <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
            <UserProfile
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "bg-transparent",
                  card: "bg-gray-800 border border-gray-600 shadow-lg rounded-lg overflow-hidden",
                  navbar: "bg-gray-900",
                  navbarButton: "text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200",
                  headerTitle: "text-green-400",
                  headerSubtitle: "text-gray-300",
                  formButtonPrimary: 
                    "bg-green-500 hover:bg-green-600 text-white transition-colors duration-200 shadow-md hover:shadow-lg",
                  formButtonReset: 
                    "text-gray-300 hover:text-white transition-colors duration-200",
                  formFieldInput: 
                    "bg-gray-700 text-white border-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200",
                  formFieldLabel: "text-gray-300",
                  userPreviewAvatarBox: "border-2 border-green-500 shadow-md",
                  userButtonPopoverCard: "bg-gray-800 border border-gray-700 shadow-xl",
                  userButtonPopoverActionButton: 
                    "text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;