// app/posts/[postId]/page.tsx
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import PostPageClient from "./PostPageClient";

export const dynamic = "force-dynamic";

type Params = Promise<{ postId: string }>;
type SearchParams = Promise<{ tab?: string }>;

export default async function PostPage(props: { 
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const session = await getSession();

  if (!session?.user) {
    redirect("/api/auth/login");
  }

  return <PostPageClient postId={params.postId} />;
}