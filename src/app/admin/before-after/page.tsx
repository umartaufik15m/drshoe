import { ContentManager } from "@/components/admin/ContentManager";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminBeforeAfterPage() {
  return (
    <AdminShell>
      <ContentManager kind="before_after" />
    </AdminShell>
  );
}
