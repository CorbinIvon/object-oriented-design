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
        <p className="text-green-500 mb-2">{">"} Object-Oriented Design Tool</p>
        <div className="ml-4 text-gray-300 space-y-2">
          <p className="font-light">
            Welcome to the Object-Oriented Design Tool - a collaborative
            platform for designing, documenting, and organizing object-oriented
            systems. Create and manage object definitions, track relationships,
            and maintain instances of your objects.
          </p>
          <p className="font-light">
            Use [Ctrl + K] to search for existing objects, or navigate through
            the menu to explore features like object creation, relationship
            mapping, and system diagrams.
          </p>
        </div>
      </section>
    </>
  );
}
