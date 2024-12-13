import Header from "./Header";

export default function TerminalWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen p-4 font-mono">
      <div className="max-w-3xl mx-auto border border-gray-800 bg-black/50 px-6 py-2 rounded">
        <div className="space-y-4">
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
}
