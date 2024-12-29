// app/posts/[postId]/page.tsx
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import PostPageClient from "./PostPageClient";
export const dynamic = "force-dynamic";

export default async function PostPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/api/auth/login");
  }

  return <PostPageClient />;
}

