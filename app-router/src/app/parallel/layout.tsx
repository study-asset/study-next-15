import Link from "next/link";
import { ReactNode } from "react";

export default function Layout({
  children,
  sidebar,
  section,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  section: ReactNode;
}) {
  return (
    <div>
      <Link href={"/parallel/settings"}>parallel/settings</Link>
      {sidebar}
      {children}
      {section}
    </div>
  );
}
