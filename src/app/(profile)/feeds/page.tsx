import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import FeedPageClient from "./FeedPageClient";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/api/auth/login");
  }

  return <FeedPageClient />;
}