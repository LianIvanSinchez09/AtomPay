import AddServicePanel from "../../../../components/billing/AddServicePanel";
import { useAdminServicesData } from "./useAdminServicesData";
import AdminPageLayout from "./AdminPageLayout";

export default function AdminAddService() {
  const { sources, displayedCategories, loading, error, loadAll } =
    useAdminServicesData();

  return (
    <AdminPageLayout
      title="Agregar servicio"
      description="Sumá un proveedor por su mail o palabras clave para que el escaneo empiece a detectarlo."
      badge={`${sources.length} ${
        sources.length === 1 ? "servicio propio" : "servicios propios"
      }`}
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
