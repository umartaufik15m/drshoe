import { ContentManager } from "@/components/admin/ContentManager";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminServicesPage() {
  return (
    <AdminShell>
      <ContentManager kind="services" />
    </AdminShell>
  );
}
