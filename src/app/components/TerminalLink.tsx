export default function TerminalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className="text-white hover:text-accent transition-colors">
      [[{children}]]
    </a>
  );
}
