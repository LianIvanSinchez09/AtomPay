import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../services/api";

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
    <div className="flex min-h-screen items-center justify-center bg-white p-6 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 p-8 text-center dark:border-white/10">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          AtomPay
        </h1>

        {status === "loading" && (
          <p className="mt-6 text-neutral-500">
            Verificando tu correo electrónico...
          </p>
        )}

        {status === "success" && (
          <>
            <h2 className="mt-6 text-xl font-semibold text-green-600">
              ¡Correo verificado!
            </h2>

            <p className="mt-3 text-neutral-500">{message}</p>

            <Link
              to="/login"
              className="mt-6 inline-block rounded-lg bg-[#A7D129] px-6 py-3 font-semibold text-black"
            >
              Iniciar sesión
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="mt-6 text-xl font-semibold text-red-500">
              No se pudo verificar
            </h2>

            <p className="mt-3 text-neutral-500">{message}</p>

            <Link to="/register" className="mt-6 inline-block underline">
              Volver al registro
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
