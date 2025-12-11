import { TermProgress } from "@/app/modules/[id]/types";
export async function getTermProgress(id: string) {
  const res = await fetch(`https://imba-server.up.railway.app/v2/terms/${id}/progress`, { credentials: "include" });
  return res.json();
}
export async function updateTermProgress(id: string, status: TermProgress["status"]) {
  const res = await fetch(`https://imba-server.up.railway.app/v2/terms/${id}/progress`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  return res.json();
}

