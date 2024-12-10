export default function TerminalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-blue-300 hover:underline hover:text-blue-600"
    >
      {children}
    </a>
  );
}
