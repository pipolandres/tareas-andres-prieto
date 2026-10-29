import { getStore } from "@netlify/blobs";
export default async (req) => {
  const s = getStore("tareas");
  if (req.method === "GET") {
    const { blobs } = await s.list();
    const all = await Promise.all(blobs.map((b) => s.get(b.key, { type: "json" })));
    return Response.json(all.filter(Boolean));
  }
  if (req.method === "PUT") {
    const t = await req.json();
    if (!t.id) {
      const { blobs } = await s.list();
      const n = Math.max(0, ...blobs.map((b) => +b.key.slice(4)));
      t.id = "TAR-" + String(n + 1).padStart(4, "0");
    }
    await s.setJSON(t.id, t);
    return Response.json(t);
  }
  if (req.method === "DELETE") {
    await s.delete(new URL(req.url).searchParams.get("id"));
    return Response.json({ ok: true });
  }
  return new Response("Método no permitido", { status: 405 });
};
export const config = { path: "/api/tasks" };
