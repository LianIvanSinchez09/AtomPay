import type { TranslationDictionary, Translations } from "../types/i18n";

/**
 * Diccionario de la interfaz.
 *
 * Lo usa `context/PreferencesContext.tsx`. Por ahora traduce la navegación
 * lateral y toda la sección Ajustes; el resto de las páginas conserva su
 * texto en español y se puede migrar agregando claves acá.
 */

const es: TranslationDictionary = {
  "nav.analysis": "Análisis",
  "nav.simulator": "Simulador",
  "nav.billing": "Facturación",
  "nav.adminServices": "Administrar Servicios",
  "nav.addService": "Agregar servicio",
  "nav.manageInvoices": "Administrar comprobantes",
  "nav.uploadInvoice": "Cargar factura",
  "nav.atomcito": "Atomcito",
  "nav.settings": "Ajustes",
  "nav.logout": "Cerrar sesión",
  "nav.notifications": "Notificaciones",

  "settings.title": "Ajustes",
  "settings.subtitle":
    "Administrá tu cuenta, la apariencia, las cuentas de Google conectadas y tus datos.",
  "settings.loading": "Cargando tus ajustes…",
  "settings.loadError": "No pudimos cargar tus ajustes.",

  "profile.title": "Cuenta",
  "profile.description":
    "Estos datos se usan para identificarte dentro de AtomPay.",
  "profile.name": "Nombre de usuario",
  "profile.namePlaceholder": "Tu nombre",
  "profile.nameRequired": "Ingresá un nombre de usuario.",
  "profile.email": "Correo electrónico",
  "profile.emailHint": "El correo no se puede cambiar desde acá.",
  "profile.avatar": "Foto de perfil (URL)",
  "profile.avatarHint": "Dejalo vacío para usar la imagen de Google.",
  "profile.save": "Guardar cambios",
  "profile.saving": "Guardando…",

  "password.title": "Contraseña",
  "password.description":
    "Cambiá la contraseña con la que iniciás sesión por correo.",
  "password.current": "Contraseña actual",
  "password.new": "Contraseña nueva",
  "password.confirm": "Repetir contraseña nueva",
  "password.submit": "Actualizar contraseña",
  "password.saving": "Actualizando…",
  "password.googleOnly":
    "Tu cuenta entra con Google. Podés crear una contraseña para iniciar sesión también por correo.",
  "password.mismatch": "Las contraseñas nuevas no coinciden.",
  "password.tooShort": "La contraseña debe tener al menos 8 caracteres.",
  "password.saved": "Contraseña actualizada.",

  "appearance.title": "Apariencia e idioma",
  "appearance.description":
    "Estas preferencias se guardan en tu cuenta y se aplican en todos tus dispositivos.",
  "appearance.language": "Idioma de la interfaz",
  "appearance.languageHint": "Elegí el idioma de los textos de AtomPay.",
  "appearance.theme": "Tema",
  "appearance.themeHint": "Alterná entre modo claro y oscuro.",
  "appearance.light": "Claro",
  "appearance.dark": "Oscuro",
  "appearance.spanish": "Español",
  "appearance.english": "Inglés",

  "google.title": "Cuentas de Google",
  "google.description":
    "Conectá una o más casillas para que AtomPay detecte facturas y comprobantes automáticamente.",
  "google.note":
    "Al desconectar una casilla se borran las facturas, los correos escaneados y los archivos que se generaron a partir de ella. Los comprobantes cargados a mano no se tocan.",

  "files.title": "Archivos",
  "files.description":
    "Comprobantes que subiste y adjuntos de Gmail que AtomPay guardó. Podés descargarlos o eliminarlos.",
  "files.loading": "Cargando archivos…",
  "files.empty": "Todavía no hay archivos guardados.",
  "files.total": "Espacio usado",
  "files.count": "archivos",
  "files.download": "Descargar",
  "files.downloading": "Descargando…",
  "files.delete": "Eliminar",
  "files.deleting": "Eliminando…",
  "files.deleteConfirm": "¿Eliminar este archivo?",
  "files.deleted": "Archivo eliminado.",
  "files.kind.manual": "Carga manual",
  "files.kind.email_attachment": "Adjunto de Gmail",
  "files.kind.report": "Reporte",
  "files.unknownSize": "Tamaño desconocido",

  "data.title": "Eliminar datos",
  "data.description":
    "Borra facturas, gastos, servicios, simulaciones, notificaciones, análisis e historial escaneado. La cuenta y las cuentas de Google se conservan.",
  "data.button": "Eliminar todos mis datos",
  "data.confirmTitle": "Confirmá la eliminación de datos",
  "data.confirmHint":
    "Esta acción no se puede deshacer. Escribí ELIMINAR para continuar.",
  "data.confirmWord": "ELIMINAR",
  "data.cancel": "Cancelar",
  "data.deleting": "Eliminando…",
  "data.deleted": "Datos eliminados. Las cuentas de Google siguen conectadas.",
  "data.keepsGoogle": "Tus cuentas de Google seguirán conectadas.",

  "account.title": "Eliminar cuenta",
  "account.description":
    "Elimina tu cuenta de AtomPay y todos los datos asociados de forma permanente.",
  "account.warning":
    "Se borran la cuenta, las casillas conectadas, las facturas, los archivos y todo el historial. No se puede recuperar.",
  "account.button": "Eliminar mi cuenta",
  "account.confirmTitle": "Confirmá la eliminación de la cuenta",
  "account.confirmHint":
    "Escribí el correo de tu cuenta para confirmar. Esta acción es permanente.",
  "account.emailLabel": "Correo de la cuenta",
  "account.passwordLabel": "Contraseña",
  "account.cancel": "Cancelar",
  "account.deleting": "Eliminando cuenta…",

  "common.save": "Guardar",
  "common.saving": "Guardando…",
  "common.saved": "Guardado.",
  "common.cancel": "Cancelar",
  "common.delete": "Eliminar",
  "common.confirm": "Confirmar",
  "common.error": "Ocurrió un error inesperado.",
  "common.retry": "Reintentar",
};

const en: TranslationDictionary = {
  "nav.analysis": "Analysis",
  "nav.simulator": "Simulator",
  "nav.billing": "Billing",
  "nav.adminServices": "Manage services",
  "nav.addService": "Add service",
  "nav.manageInvoices": "Manage invoices",
  "nav.uploadInvoice": "Upload invoice",
  "nav.atomcito": "Atomcito",
  "nav.settings": "Settings",
  "nav.logout": "Sign out",
  "nav.notifications": "Notifications",

  "settings.title": "Settings",
  "settings.subtitle":
    "Manage your account, appearance, connected Google accounts and your data.",
  "settings.loading": "Loading your settings…",
  "settings.loadError": "We couldn't load your settings.",

  "profile.title": "Account",
  "profile.description": "This information identifies you inside AtomPay.",
  "profile.name": "Display name",
  "profile.namePlaceholder": "Your name",
  "profile.nameRequired": "Enter a display name.",
  "profile.email": "Email address",
  "profile.emailHint": "The email can't be changed here.",
  "profile.avatar": "Profile picture (URL)",
  "profile.avatarHint": "Leave it empty to use your Google picture.",
  "profile.save": "Save changes",
  "profile.saving": "Saving…",

  "password.title": "Password",
  "password.description": "Change the password you use to sign in with email.",
  "password.current": "Current password",
  "password.new": "New password",
  "password.confirm": "Repeat new password",
  "password.submit": "Update password",
  "password.saving": "Updating…",
  "password.googleOnly":
    "Your account signs in with Google. You can create a password to also sign in with email.",
  "password.mismatch": "The new passwords don't match.",
  "password.tooShort": "The password must be at least 8 characters long.",
  "password.saved": "Password updated.",

  "appearance.title": "Appearance and language",
  "appearance.description":
    "These preferences are stored in your account and apply on all your devices.",
  "appearance.language": "Interface language",
  "appearance.languageHint": "Choose the language of AtomPay's texts.",
  "appearance.theme": "Theme",
  "appearance.themeHint": "Switch between light and dark mode.",
  "appearance.light": "Light",
  "appearance.dark": "Dark",
  "appearance.spanish": "Spanish",
  "appearance.english": "English",

  "google.title": "Google accounts",
  "google.description":
    "Connect one or more mailboxes so AtomPay can find invoices and receipts automatically.",
  "google.note":
    "Disconnecting a mailbox deletes the invoices, scanned emails and files generated from it. Manually uploaded receipts are kept.",

  "files.title": "Files",
  "files.description":
    "Receipts you uploaded and Gmail attachments AtomPay saved. You can download or delete them.",
  "files.loading": "Loading files…",
  "files.empty": "There are no saved files yet.",
  "files.total": "Space used",
  "files.count": "files",
  "files.download": "Download",
  "files.downloading": "Downloading…",
  "files.delete": "Delete",
  "files.deleting": "Deleting…",
  "files.deleteConfirm": "Delete this file?",
  "files.deleted": "File deleted.",
  "files.kind.manual": "Manual upload",
  "files.kind.email_attachment": "Gmail attachment",
  "files.kind.report": "Report",
  "files.unknownSize": "Unknown size",

  "data.title": "Delete data",
  "data.description":
    "Deletes invoices, expenses, services, simulations, notifications, analysis and scanned history. Your account and Google accounts are kept.",
  "data.button": "Delete all my data",
  "data.confirmTitle": "Confirm data deletion",
  "data.confirmHint": "This action can't be undone. Type DELETE to continue.",
  "data.confirmWord": "DELETE",
  "data.cancel": "Cancel",
  "data.deleting": "Deleting…",
  "data.deleted": "Data deleted. Google accounts remain connected.",
  "data.keepsGoogle": "Your Google accounts will stay connected.",

  "account.title": "Delete account",
  "account.description":
    "Permanently deletes your AtomPay account and all associated data.",
  "account.warning":
    "Your account, connected mailboxes, invoices, files and all history are deleted. This can't be recovered.",
  "account.button": "Delete my account",
  "account.confirmTitle": "Confirm account deletion",
  "account.confirmHint":
    "Type your account email to confirm. This action is permanent.",
  "account.emailLabel": "Account email",
  "account.passwordLabel": "Password",
  "account.cancel": "Cancel",
  "account.deleting": "Deleting account…",

  "common.save": "Save",
  "common.saving": "Saving…",
  "common.saved": "Saved.",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.confirm": "Confirm",
  "common.error": "An unexpected error occurred.",
  "common.retry": "Retry",
};

export const translations: Translations = { es, en };
