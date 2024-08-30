"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image"; // Import the Image component

const routes = [
  {
    name: "Chat",
    path: "/",
  },
  {
    name: "Profile",
    path: "/profile",
  },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="relative z-10 p-4 flex flex-row justify-between items-center bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-lg border-b-4 border-green-500">
      <Link href="/">
        <div className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="CDATA AI Logo"
            width={300}
            height={50}
            className="shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
          />
        </div>
      </Link>
      <div className="flex gap-x-6 text-lg items-center">
        {routes.map((route, idx) => (
          <Link
            key={idx}
            href={route.path}
            className={`relative px-2 py-1 rounded-md transition duration-300 ease-in-out ${
              pathname === route.path
                ? "text-green-500 border-b-2 border-green-500 shadow-sm"
                : "text-gray-300 hover:text-white hover:bg-gray-600 shadow-md"
            }`}
          >
            {route.name}
            {pathname === route.path && (
              <span className="absolute inset-x-0 bottom-0 h-1 bg-green-500 rounded-full"></span>
            )}
          </Link>
        ))}
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
