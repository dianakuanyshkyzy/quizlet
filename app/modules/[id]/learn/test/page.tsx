
import TestPageClient from "../TestPageClient";
import { mockModules } from "@/data/mockModules";

export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const module = mockModules.find((m) => m.id === Number(id));

  return <TestPageClient words={module?.words ?? []} moduleName={module?.name ?? "Module"} />;
}
