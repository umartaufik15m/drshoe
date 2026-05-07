import { ContentManager } from "@/components/admin/ContentManager";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminDropPointsPage() {
  return (
    <AdminShell>
      <ContentManager kind="drop_points" />
    </AdminShell>
  );
}
