import Link from "next/link";

export default function NotFound() {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <p className="text-lg mt-4 text-gray-600">Page Not Found</p>

            <Link
                href="/"
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow"
            >
                Go Home
            </Link>
        </div>
    );
}
