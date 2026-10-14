import { connection } from "next/server";
import { listPasses } from "@/lib/passes-db";

export async function GET() {
  // Always request time: never run the database query while building.
  await connection();
  try {
    return Response.json(await listPasses(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("listPasses failed", error);
    return Response.json({ error: "Could not load the guest list" }, { status: 500 });
  }
}
