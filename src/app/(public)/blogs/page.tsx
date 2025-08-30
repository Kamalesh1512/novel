import LoadingScreen from "@/components/global/loading";
import BlogsList from "@/components/user/blogs-list";
import { Suspense } from "react";

export default async function Page() {
  return (
    <Suspense fallback={<LoadingScreen description="" />}>
      <div className="min-h-screen">
        <BlogsList />
      </div>
    </Suspense>
  );
}
