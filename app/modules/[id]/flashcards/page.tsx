import FlashcardsClient from "../FlashCardsClient";
import { mockModules } from "@/data/mockModules";
export default async function FlashcardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const module = mockModules.find((m) => m.id === Number(id));

  return <FlashcardsClient words={module?.words ?? []} />;
}
