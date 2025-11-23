import { redirect, notFound } from "next/navigation";
import sql from "@/lib/db";

export default async function Page({ params }: { params: { code: string } }) {
  const { code } = params;

  const links = await sql`SELECT url FROM links WHERE code = ${code}`;

  if (!links.length) {
    redirect("/");
  }

  await sql`UPDATE links SET clicks = clicks + 1, last_clicked_at = NOW() WHERE code = ${code}`;

  redirect(links[0].url);
}
