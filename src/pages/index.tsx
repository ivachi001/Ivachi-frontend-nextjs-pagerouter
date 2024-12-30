// pages/index.tsx

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /admin/login when the root URL is accessed
    router.push("/admin/login");
  }, [router]);

  return null; // You can display a loading state here if needed.
}
