import { ContentManager } from "@/components/admin/ContentManager";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminTestimonialsPage() {
  return (
    <AdminShell>
      <ContentManager kind="testimonials" />
    </AdminShell>
  );
}
