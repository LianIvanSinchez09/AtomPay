import type { Language, Theme } from "./settings";
import type { ReactNode } from "react";

/**
 * Tipos de la internacionalización mínima de la interfaz.
 *
 * La implementación vive en `src/i18n/translations.ts` y el estado en
 * `src/context/PreferencesContext.tsx`.
 */
export interface TranslationDictionary {
  "nav.analysis": string;
  "nav.simulator": string;
  "nav.billing": string;
  "nav.adminServices": string;
  "nav.addService": string;
  "nav.manageInvoices": string;
  "nav.uploadInvoice": string;
  "nav.atomcito": string;
  "nav.settings": string;
  "nav.logout": string;
  "nav.notifications": string;

  "settings.title": string;
  "settings.subtitle": string;
  "settings.loading": string;
  "settings.loadError": string;

  "profile.title": string;
  "profile.description": string;
  "profile.name": string;
  "profile.namePlaceholder": string;
  "profile.nameRequired": string;
  "profile.email": string;
  "profile.emailHint": string;
  "profile.avatar": string;
  "profile.avatarHint": string;
  "profile.save": string;
  "profile.saving": string;

  "password.title": string;
  "password.description": string;
  "password.current": string;
  "password.new": string;
  "password.confirm": string;
  "password.submit": string;
  "password.saving": string;
  "password.googleOnly": string;
  "password.mismatch": string;
  "password.tooShort": string;
  "password.saved": string;

  "appearance.title": string;
  "appearance.description": string;
  "appearance.language": string;
  "appearance.languageHint": string;
  "appearance.theme": string;
  "appearance.themeHint": string;
  "appearance.light": string;
  "appearance.dark": string;
  "appearance.spanish": string;
  "appearance.english": string;

  "google.title": string;
  "google.description": string;
  "google.note": string;

  "files.title": string;
  "files.description": string;
  "files.loading": string;
  "files.empty": string;
  "files.total": string;
  "files.count": string;
  "files.download": string;
  "files.downloading": string;
  "files.delete": string;
  "files.deleting": string;
  "files.deleteConfirm": string;
  "files.deleted": string;
  "files.kind.manual": string;
  "files.kind.email_attachment": string;
  "files.kind.report": string;
  "files.unknownSize": string;

  "data.title": string;
  "data.description": string;
  "data.button": string;
  "data.confirmTitle": string;
  "data.confirmHint": string;
  "data.confirmWord": string;
  "data.cancel": string;
  "data.deleting": string;
  "data.deleted": string;
  "data.keepsGoogle": string;

  "account.title": string;
  "account.description": string;
  "account.warning": string;
  "account.button": string;
  "account.confirmTitle": string;
  "account.confirmHint": string;
  "account.emailLabel": string;
  "account.passwordLabel": string;
  "account.cancel": string;
  "account.deleting": string;

  "common.save": string;
  "common.saving": string;
  "common.saved": string;
  "common.cancel": string;
  "common.delete": string;
  "common.confirm": string;
  "common.error": string;
  "common.retry": string;
}

export type TranslationKey = keyof TranslationDictionary;

export type Translations = Record<Language, TranslationDictionary>;

/** Valores para interpolar plantillas como `{nombre}`. */
export type PhraseParams = Record<string, string | number>;

/** Diccionario de frases en español → inglés (ver `src/i18n/phrases.ts`). */
export type PhraseDictionary = Record<string, string>;

/** Valor que expone `PreferencesContext`. */
export interface PreferencesContextValue {
  language: Language;
  theme: Theme;
  /** Traduce una clave del diccionario. */
  t: (key: TranslationKey) => string;
  /** Cambia el idioma y lo sincroniza con el backend. */
  setLanguage: (language: Language) => void;
  /** Cambia el tema (claro/oscuro) y lo sincroniza con el backend. */
  setTheme: (theme: Theme) => void;
}

export interface PreferencesProviderProps {
  children: ReactNode;
}
