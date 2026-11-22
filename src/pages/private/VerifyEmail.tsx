import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../services/api";
import ButtonForm from "../public/Register/ButtonForm";
import { Button } from "@n8n/chat/dist/src/components/index.js";


const BACKGROUND = {
  backgroundImage:
    "radial-gradient(45% 70% at 100% 0%, #A7D129 0%, rgba(167,209,41,0.35) 35%, #000000 75%)",
  backgroundColor: "#000000",
};

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No se encontró el token de verificación.");
      return;
    }

    const verify = async () => {
      const response = await api.post("/auth/verify-email", {
        token,
      });
      if (response.status == 200) {
        setMessage(response.data.message);
        setStatus("success");
      } else {
        setMessage("El enlace es inválido o ha expirado.");
        setStatus("error");
      }
    };

    void verify();
  }, [searchParams]);

  return (
    <main
      className="flex min-h-screen items-center justify-center p-6"
      style={BACKGROUND}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/70 p-8 text-center">
        <h1 className="text-2xl font-bold text-[#A7D129]">AtomPay</h1>

        {status === "loading" && (
          <p role="status" className="mt-6 text-neutral-300">
            Verificando tu correo electrónico...
          </p>
        )}

        {status === "success" && (
          <div role="status">
            <h2 className="mt-6 text-xl font-semibold text-[#A7D129]">
              ¡Correo verificado!
            </h2>

            <p className="mt-3 text-neutral-300">{message}</p>

            <Link
              to="/login"
              className="mt-6 inline-block rounded-lg bg-[#A7D129] px-6 py-3 font-semibold text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Iniciar sesión
            </Link>
          </div>
        )}

        {status === "error" && (
          <div role="alert">
            <h2 className="mt-6 text-xl font-semibold text-red-400">
              No se pudo verificar
            </h2>

            <p className="mt-3 text-neutral-300">{message}</p>

            <Link
              to="/register"
              className="mt-6 inline-block text-white underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ButtonForm text={"Volver al registro"} p={"p-2"}/>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default VerifyEmail;
