"use client";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function Home() {
  return (
    <>
      <section className="border border-gray-800 bg-black/50 p-4 rounded">
        <p className="text-green-500 mb-2">{">"} Website Information</p>
        <div className="ml-4 text-gray-300 space-y-0">
          <p className="font-light">
            Welcome to Object-Oriented Design! This is an in-depth tool for
            designing objects in a relational way. Use the search on the top
            right, or press the [Ctrl + K] key combination to get started.
          </p>
          <p className="font-light"></p>
        </div>
      </section>
    </>
  );
}
