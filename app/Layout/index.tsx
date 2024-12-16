import { type ReactNode } from "react";
import Header from "./header";

export default function LayoutConents({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
