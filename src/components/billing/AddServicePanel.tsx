import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

import type {
  ServiceCategory,
  ServiceSource,
} from "../../types/types";
import {
  addServiceSource,
  removeServiceSource,
} from "../../services/billingService";
import { errorMessage } from "../../services/apiError";

const inputClass =
  "mt-2 w-full rounded-xl border border-[#CDE8E5] bg-white px-3 py-2 text-sm text-[#4D869C] outline-none transition-colors focus:border-[#4D869C] disabled:cursor-wait disabled:opacity-60 dark:border-[#616F39] dark:bg-black/20 dark:text-white";

const labelClass = "block text-xs font-semibold opacity-70";

type Props = {
  categories: ServiceCategory[];
  sources: ServiceSource[];
  onChanged: () => Promise<unknown> | void;
};

/**
 * Alta de un servicio que la app no conoce: se busca por el mail del
 * proveedor y/o por palabras clave del asunto.
 */
export default function AddServicePanel({
  categories,
  sources,
  onChanged,
}: Props) {
  const [name, setName] = useState("");
  const [sender, setSender] = useState("");
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("Otros");
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFeedback(null);

    if (!name.trim()) {
      setError("Poné el nombre del servicio.");
      return;
    }

    if (!sender.trim() && !keywords.trim()) {
      setError(
        "Indicá el mail del proveedor o al menos una palabra clave."
      );
      return;
    }

    setSaving(true);

    try {
      const source = await addServiceSource({
        name: name.trim(),
        sender: sender.trim(),
        keywords: keywords.trim(),
        category,
      });

      const pending = source.requeued ?? 0;

      setFeedback(
        `"${source.name}" quedó agregado. Los próximos mails que coincidan van a aparecer en ${source.category}.` +
          (pending > 0
            ? ` Además, ${pending} ${
                pending === 1 ? "mail descartado vuelve" : "mails descartados vuelven"
              } a la cola para el próximo escaneo.`
            : "")
      );
      setName("");
      setSender("");
      setKeywords("");
      await onChanged();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (source: ServiceSource) => {
    setRemovingId(source.id);
    setError(null);
    setFeedback(null);

    try {
      await removeServiceSource(source.id);
      setConfirmId(null);
      setFeedback(
        `Se quitó "${source.name}". Los comprobantes que ya estaban cargados no se tocan.`
      );
      await onChanged();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-8 overflow-hidden rounded-2xl border border-[#CDE8E5] bg-white shadow-sm dark:border-[#616F39] dark:bg-[#3E432E]"
    >
      <div className="border-b border-[#CDE8E5] p-5 dark:border-[#616F39] md:p-6">
        <h2 className="text-xl font-bold">Agregar servicio</h2>
        <p className="mt-1 text-sm opacity-70">
          Si un proveedor no aparece en la app, agregalo con su mail o
          con palabras que vengan en el asunto. El escaneo lo va a
          buscar igual que a los proveedores conocidos.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {feedback && (
        <div className="flex items-start gap-2 border-b border-[#CDE8E5] bg-[#CDE8E5]/40 px-5 py-3 text-sm dark:border-[#616F39] dark:bg-[#616F39]/40">
          <CheckCircle size={16} className="mt-0.5 shrink-0" />
          <p>{feedback}</p>
        </div>
      )}

      <div className="grid gap-6 p-5 md:p-6 lg:grid-cols-5">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 lg:col-span-3"
        >
          <label className={labelClass}>
            Nombre del servicio
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Cabify"
              maxLength={60}
              required
              disabled={saving}
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Mail o dominio del proveedor{" "}
            <span className="font-normal opacity-60">(opcional)</span>
            <input
              value={sender}
              onChange={(event) => setSender(event.target.value)}
              placeholder="no-reply@cabify.com o cabify.com"
              maxLength={120}
              disabled={saving}
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Palabras clave{" "}
            <span className="font-normal opacity-60">
              (opcional, separadas por coma)
            </span>
            <input
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              placeholder="cabify, recibo de viaje"
              maxLength={200}
              disabled={saving}
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Categoría
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              disabled={saving}
              className={inputClass}
            >
              {categories.map((option) => (
                <option key={option.name} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#4D869C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3F6F82] disabled:cursor-wait disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              {saving ? "Guardando…" : "Agregar servicio"}
            </button>

            <p className="text-xs opacity-60">
              Con mail o palabras clave alcanza.
            </p>
          </div>
        </form>

        <div className="lg:col-span-2">
          <p className="text-xs font-semibold uppercase tracking-wide opacity-60">
            Servicios propios
          </p>

          {sources.length === 0 ? (
            <p className="mt-3 text-sm opacity-65">
              Todavía no agregaste ninguno. Los proveedores conocidos
              ya se buscan solos.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {sources.map((source) => {
                const isRemoving = removingId === source.id;
                const isConfirming = confirmId === source.id;

                return (
                  <li
                    key={source.id}
                    className="rounded-xl border border-[#CDE8E5] p-3 text-sm dark:border-[#616F39]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {source.name}
                        </p>
                        <p className="mt-0.5 text-xs opacity-65">
                          {source.category}
                          {source.sender
                            ? ` · ${source.sender}`
                            : ""}
                        </p>
                        {source.keywords && (
                          <p className="mt-1 text-xs opacity-60">
                            Palabras: {source.keywords}
                          </p>
                        )}
                      </div>

                      {isConfirming ? (
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => void handleRemove(source)}
                            disabled={isRemoving}
                            className="rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-wait disabled:opacity-60"
                          >
                            {isRemoving ? "…" : "Quitar"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            disabled={isRemoving}
                            className="rounded-lg border border-[#CDE8E5] px-2 py-1 text-xs font-semibold disabled:opacity-60 dark:border-[#616F39]"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmId(source.id)}
                          title={`Quitar ${source.name}`}
                          className="shrink-0 rounded-lg border border-[#CDE8E5] p-1.5 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-[#616F39] dark:hover:border-red-900/40 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </motion.section>
  );
}
