import ManageInvoicesPanel from "../../../../components/billing/ManageInvoicesPanel";
import { useAdminServicesData } from "./useAdminServicesData";
import AdminPageLayout from "./AdminPageLayout";

export default function AdminComprobantes() {
  const { invoices, displayedCategories, withoutAmount, loading, error, loadAll } =
    useAdminServicesData();

  return (
    <AdminPageLayout
      title="Administrar comprobantes"
      description="Mové cada comprobante de categoría, abrí el mail original o eliminalo del listado."
      badge={`${withoutAmount} sin importe`}
      loading={loading}
      error={error}
    >
      <ManageInvoicesPanel
        invoices={invoices}
        categories={displayedCategories}
        onChanged={loadAll}
      />
    </AdminPageLayout>
  );
}
