import { readPhoto } from "@/lib/catalogue-store";

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[a-f0-9-]{36}\.(?:webp|jpg|png)$/.test(file)) return new Response(null, { status: 404 });

  const result = await readPhoto(file);
  if (result?.statusCode !== 200) return new Response(null, { status: 404 });

  const contentType = { webp: "image/webp", jpg: "image/jpeg", png: "image/png" }[file.split(".")[1]];
  return new Response(result.stream, {
    headers: {
      "Content-Type": contentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Vercel-CDN-Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
