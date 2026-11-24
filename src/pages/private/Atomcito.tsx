
import { useEffect, useState } from "react";
import { JSX } from "react";

import Conversation from "../../components/Atomcito/Conversation";
import KnowledgeConsentModal from "../../components/Atomcito/KnowledgeConsentModal .tsx";

import { api } from "../../services/api";

type KnowledgeStatus = {
  consent: "PENDING" | "ACCEPTED" | "DECLINED";
  status: "NOT_SYNCED" | "SYNCING" | "SYNCED" | "ERROR";
};

const Atomcito = (): JSX.Element => {
  const [knowledge, setKnowledge] = useState<KnowledgeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadKnowledgeStatus = async () => {
    try {
      const { data } = await api.get("/chat/knowledge/status");
      setKnowledge(data);
    } catch (error) {
      console.error("Error consultando el conocimiento de Atomcito:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKnowledgeStatus();
  }, []);

  const handleConsent = async (accepted: boolean) => {
    try {
      setSaving(true);

      const { data } = await api.post("/chat/knowledge/consent", {
        accepted,
      });

      setKnowledge(data);
    } catch (error) {
      console.error("Error actualizando el consentimiento:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-gray-400">
          Preparando Atomcito...
        </span>
      </div>
    );
  }

  if (!knowledge) {
    return (
      <div className="p-4 text-center text-gray-400">
        No se pudo cargar Atomcito. Intentá nuevamente.
      </div>
    );
  }

  const showModal = knowledge.consent === "PENDING";

  const canChat =
    knowledge.consent === "DECLINED" ||
    (
      knowledge.consent === "ACCEPTED" &&
      knowledge.status === "SYNCED"
    );

  return (
    <div className="absolute right-0 w-full">
      {showModal && (
        <KnowledgeConsentModal
          onAccept={() => handleConsent(true)}
          onReject={() => handleConsent(false)}
          loading={saving}
        />
      )}

      {canChat && <Conversation />}

      {knowledge.consent === "ACCEPTED" &&
        knowledge.status === "ERROR" && (
          <div className="p-4 text-center text-red-400">
            No se pudo preparar tu información.
            Volvé a intentarlo.
          </div>
        )}
    </div>
  );
};

export default Atomcito;
