import { demoDashboard } from "@/lib/api";

export async function GET() {
  return Response.json(demoDashboard, {
    headers: { "Cache-Control": "no-store" },
  });
}
