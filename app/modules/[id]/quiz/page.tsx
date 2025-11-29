import { mockModules } from "@/data/mockModules";
import QuizClient from "../QuizClient";
export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const module = mockModules.find((m) => m.id === Number(id));

  return <QuizClient words={module?.words ?? []} />;
}
