import ManageInvoicesPanel from "../../../../components/billing/ManageInvoicesPanel";
import { useAdminServicesData } from "./useAdminServicesData";
import AdminPageLayout from "./AdminPageLayout";
import FilterBy from "../../../../components/Filters/FilterBy";
import { tr } from "../../../../i18n/translate";

export default function AdminComprobantes() {
  const { invoices, displayedCategories, withoutAmount, loading, error, loadAll } =
    useAdminServicesData();

  return (
    <>
      <AdminPageLayout
        title={tr("Administrar comprobantes")}
        description={tr("Mové cada comprobante de categoría, abrí el mail original o eliminalo del listado.")}
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
    </>
  );
}
