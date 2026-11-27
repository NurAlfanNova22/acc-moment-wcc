import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, getAdminCredentials, verifyAdminSession } from "@/lib/admin-auth";

async function AdminAuthGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const credentials = getAdminCredentials();
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!credentials || !verifyAdminSession(session, credentials.secret)) {
    redirect("/admin-login");
  }

  return children;
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF0]" />}>
      <AdminAuthGuard>{children}</AdminAuthGuard>
    </Suspense>
  );
}
