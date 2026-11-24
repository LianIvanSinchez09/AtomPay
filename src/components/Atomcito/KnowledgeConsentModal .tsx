import { Sparkles } from "lucide-react";

interface KnowledgeConsentModalProps {
  onAccept: () => void;
  onReject: () => void;
  loading?: boolean;
}

const KnowledgeConsentModal = ({
  onAccept,
  onReject,
  loading = false,
}: KnowledgeConsentModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#202725] p-6 text-white shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-[#343e3b] p-3">
            <Sparkles size={24} />
          </div>

          <h2 className="text-xl font-semibold">Personalizá Atomcito</h2>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-gray-300">
          ¿Querés que Atomcito utilice tus datos financieros almacenados en
          AtomPay para ofrecerte respuestas personalizadas?
        </p>

        <div className="mb-5 rounded-xl bg-[#181e1c] p-4 text-sm text-gray-300">
          Por ejemplo, podrá conocer tu AtomScore, tus servicios, tus gastos y
          tus insights financieros para ayudarte a comprender mejor tu
          situación.
        </div>

        <p className="mb-5 text-xs text-gray-400">
          Podés cambiar esta decisión posteriormente desde la configuración de
          Atomcito.
        </p>

        <div className="flex flex-col gap-3">
          <button
            disabled={loading}
            onClick={onAccept}
            className="rounded-xl bg-[#a6f0c6] px-4 py-3 font-semibold text-[#17221d] disabled:opacity-50"
          >
            {loading ? "Preparando Atomcito..." : "Sí, personalizar Atomcito"}
          </button>

          <button
            disabled={loading}
            onClick={onReject}
            className="rounded-xl border border-white/10 px-4 py-3 text-gray-300 hover:bg-white/5 disabled:opacity-50"
          >
            No por ahora
          </button>
        </div>
      </div>
    </div>
  );
};
