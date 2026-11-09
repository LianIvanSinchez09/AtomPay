import ManualInvoicePanel from "../../../../components/billing/ManualInvoicePanel";
import { useAdminServicesData } from "./useAdminServicesData";
import { dateFormat } from "../../../../utils/billingFormat";
import AdminPageLayout from "./AdminPageLayout";

export default function AdminUploadInvoice() {
  const { displayedCategories, lastManual, loading, error, loadAll } =
    useAdminServicesData();

  return (
    <AdminPageLayout
      title="Cargar factura"
      description="Subí un comprobante (PDF o imagen), elegí a qué servicio pertenece y la app lee importe, fechas y número."
      badge={`Última carga: ${
        lastManual ? dateFormat(lastManual.issueDate) : "—"
      }`}
      loading={loading}
      error={error}
    >
      <ManualInvoicePanel
        categories={displayedCategories}
        onCreated={loadAll}
      />
    </AdminPageLayout>
  );
}
