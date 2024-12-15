import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 p-4 mt-auto">
      <div className="container mx-auto flex flex-col items-center gap-2">
        <Link
          href="https://github.com/CorbinIvon/object-oriented-design"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          View on GitHub
        </Link>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Object Oriented Design. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
