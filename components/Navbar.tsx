"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white shadow-lg border-b-4 border-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="CDATA AI Logo"
                width={200}
                height={40}
                className="shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
              />
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-6">
            {routes.map((route, idx) => (
              <Link
                key={idx}
                href={route.path}
                className={`relative px-4 py-2 rounded-md text-base font-medium transition duration-300 ease-in-out ${
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
            <div className="ml-4">
              <UserButton />
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-3 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {routes.map((route, idx) => (
              <Link
                key={idx}
                href={route.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === route.path
                    ? "text-green-500 bg-gray-900"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                {route.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <UserButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;