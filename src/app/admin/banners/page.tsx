import { AdminShell } from "@/components/admin/AdminShell";
import { BannerManager } from "@/components/admin/BannerManager";

export default function AdminBannersPage() {
  return (
    <AdminShell>
      <BannerManager />
    </AdminShell>
  );
}
