import TerminalLink from "./TerminalLink";
import { Fragment } from "react";

export default function TerminalNav({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  return (
    <div className="text-green-500 flex gap-2 items-center">
      <span>{">"} Navigation</span>
      {items.map((item) => (
        <Fragment key={item.href}>
          <span className="text-gray-500">|</span>
          <TerminalLink href={item.href}>{item.label}</TerminalLink>
        </Fragment>
      ))}
    </div>
  );
}
