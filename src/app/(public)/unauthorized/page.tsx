import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6 text-center space-y-4">
        <div className="flex justify-center text-red-500">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">Access Denied</h1>
        <p className="text-gray-600">
          You don’t have permission to view this page. If you believe this is a mistake, contact support or try logging in with a different account.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
