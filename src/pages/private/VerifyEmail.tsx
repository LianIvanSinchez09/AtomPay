
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { api } from "../../services/api";
import ButtonForm from "../public/Register/ButtonForm";
import Logo from "../public/Home/Logo";

const BACKGROUND = {
  backgroundImage:
    "radial-gradient(45% 70% at 100% 0%, #A7D129 0%, rgba(167,209,41,0.35) 35%, #000000 75%)",
  backgroundColor: "#000000",
};

const NATIVE = 400;
const ORBIT2 = 1.2;
const SLOT = 60;
const SCALE = SLOT / (NATIVE * ORBIT2);

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No se encontró el token de verificación.");
      return;
    }

    const verify = async () => {
      try {
        const response = await api.post("/auth/verify-email", {
          token,
        });

        setMessage(response.data.message);
        setStatus("success");
      } catch (error) {
        console.error("Error al verificar el correo:", error);

        setMessage(
          "El enlace es inválido o ha expirado."
        );
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
      <div className="flex w-full max-w-md flex-col items-center justify-center border-white/10p-8 text-center">
        <div
          style={{
            width: NATIVE,
            height: NATIVE,
            zoom: SCALE,
          }}
        >
          <Logo
            spinning={true}
            circle={false}
            bubbles={false}
            width={NATIVE}
            height={NATIVE}
          />
        </div>

        <h1 className="text-xl font-bold text-[#A7D129]">
          AtomPay
        </h1>

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

            <p className="mt-3 text-neutral-300">
              {message}
            </p>

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

            <p className="mt-3 text-neutral-300">
              {message}
            </p>

            <Link
              to="/register"
              className="mt-6 inline-block text-white underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ButtonForm
                text="Volver al registro"
                p="p-2"
              />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default VerifyEmail;
