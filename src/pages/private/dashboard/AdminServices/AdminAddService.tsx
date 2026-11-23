import AddServicePanel from "../../../../components/billing/AddServicePanel";
import { useAdminServicesData } from "./useAdminServicesData";
import AdminPageLayout from "./AdminPageLayout";
import { tr } from "../../../../i18n/translate";

export default function AdminAddService() {
  const { sources, displayedCategories, loading, error, loadAll } =
    useAdminServicesData();

  return (
    <AdminPageLayout
      title={tr("Agregar servicio")}
      description={tr("Sumá un proveedor por su mail o palabras clave para que el escaneo empiece a detectarlo.")}
      badge={tr("{count} {label}", { count: sources.length, label: sources.length === 1 ? tr("servicio propio") : tr("servicios propios") })}
      loading={loading}
      error={error}
    >
      <AddServicePanel
        categories={displayedCategories}
        sources={sources}
        onChanged={loadAll}
      />
    </AdminPageLayout>
  );
}
