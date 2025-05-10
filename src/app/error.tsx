"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <Image
          src="/assets/error.png"
          alt="Something Went Wrong"
          width={300}
          height={300}
          className="mx-auto"
        />
        <h2 className="text-4xl font-bold text-red-600">
          Oops! Something Went Wrong
        </h2>
        <p className="text-gray-700 text-lg mb-4">
          We encountered an unexpected error. Don&apos;t worry, this isn&apos;t
          your fault.
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => {
              reset();
              window.location.reload();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-center"
          >
            Return to Home
          </Link>
        </div>
        {error.digest && (
          <div className="mt-4 text-sm text-gray-500">
            Error ID: {error.digest}
          </div>
        )}
      </div>
    </div>
  );
}
