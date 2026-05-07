import { AdminShell } from "@/components/admin/AdminShell";
import { OrdersManager } from "@/components/admin/OrdersManager";

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <OrdersManager />
    </AdminShell>
  );
}
