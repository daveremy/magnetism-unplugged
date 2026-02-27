import type { ReactElement } from "react";
import { getAllModules } from "@/lib/modules";
import { LandingContent } from "@/components/ui/LandingContent";

export default function Home(): ReactElement {
  const modules = getAllModules();
  return <LandingContent modules={modules} />;
}
