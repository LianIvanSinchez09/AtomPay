import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { GoogleLogin } from "@react-oauth/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Ingresá tu correo electrónico.")
    .email("Ingresá un correo electrónico válido."),
  password: z.string().min(1, "Ingresá tu contraseña."),
});

type LoginFormData = z.infer<typeof loginSchema>;

const DETECTED_SERVICES = [
  "Netflix",
  "Spotify",
  "Disney+",
  "YouTube Premium",
  "Crunchyroll",
  "Luz",
  "Gas",
  "Agua",
  "Internet",
];

const inputBase =
  "w-full rounded-lg border bg-white py-2.5 pl-10 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:ring-2 dark:bg-black dark:text-white dark:placeholder:text-neutral-500";

const inputNormal =
  "border-neutral-300 focus:border-[#4D869C] focus:ring-[#4D869C]/25 dark:border-white/20 dark:focus:border-[#A7D129] dark:focus:ring-[#A7D129]/25";

const inputInvalid =
  "border-red-500 focus:border-red-500 focus:ring-red-500/25";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const completeLogin = (user: Parameters<typeof login>[0], token: string) => {
    login(user, token);

    localStorage.setItem("token", token);

    setSuccessMessage("¡Inicio de sesión exitoso! Redirigiendo...");

    setTimeout(() => {
      navigate("/dashboard");
    }, 800);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage(null);

      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      completeLogin(response.data.user, response.data.token);
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 404)
      ) {
        setErrorMessage("Correo o contraseña incorrectos.");

        return;
      }

      console.error("Error durante el login:", error);

      setErrorMessage("No se pudo iniciar sesión. Intentá nuevamente.");
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    try {
      setErrorMessage(null);

      const response = await api.post("/auth/google", {
        idToken: credential,
      });

      completeLogin(response.data.user, response.data.token);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setErrorMessage(
          "No existe una cuenta AtomPay asociada a esta cuenta de Google. Registrate primero.",
        );

        return;
      }

      console.error("Error durante el login:", error);

      setErrorMessage("No se pudo iniciar sesión. Intentá nuevamente.");
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen bg-white dark:bg-black">
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              role="alert"
              className="fixed right-6 top-6 z-50 flex max-w-sm items-center gap-3 rounded-2xl bg-red-500 px-5 py-4 text-white shadow-xl"
            >
              <AlertCircle className="h-6 w-6 shrink-0" />

              <span className="text-sm font-semibold">{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              role="status"
              className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-500 px-5 py-4 text-white shadow-xl"
            >
              <CheckCircle2 className="h-6 w-6 shrink-0" />

              <span className="text-sm font-semibold">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="flex w-full flex-col px-6 py-8 sm:px-12 lg:w-1/2 lg:px-20 dark:lg:border-r dark:lg:border-white/10">
          <Link
            to="/"
            className="w-fit text-2xl font-bold tracking-tight text-neutral-900 dark:text-[#A7D129]"
          >
            AtomPay
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto my-auto w-full max-w-sm py-10"
          >
            <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
              Bienvenido de nuevo
            </h1>

            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Ingresá a tu cuenta para ver tus servicios, facturas y gastos.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mt-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-white"
                >
                  Correo electrónico
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tucorreo@ejemplo.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`${inputBase} pr-3 ${
                      errors.email ? inputInvalid : inputNormal
                    }`}
                    {...register("email")}
                  />
                </div>

                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="mt-1.5 text-sm text-red-600 dark:text-red-400"
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-white"
                >
                  Contraseña
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Ingresá tu contraseña"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }X
                    className={`${inputBase} pr-11 ${
                      errors.password ? inputInvalid : inputNormal
                    }`}
                    {...register("password")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 transition-colors hover:text-neutral-700 focus-visible:outline focus-visible:outline-[#4D869C] dark:hover:text-white dark:focus-visible:outline-[#A7D129]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p
                    id="password-error"
                    role="alert"
                    className="mt-1.5 text-sm text-red-600 dark:text-red-400"
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-black py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#4D869C] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#A7D129] dark:text-black dark:hover:bg-[#bde43a] dark:focus-visible:outline-[#A7D129]"
              >
                {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="h-px flex-1 bg-neutral-200 dark:bg-white/15" />
              o
              <span className="h-px flex-1 bg-neutral-200 dark:bg-white/15" />
            </div>

            <div className="flex w-full justify-center">
              <GoogleLogin
                onSuccess={(response) => {
                  if (!response.credential) {
                    setErrorMessage(
                      "Google no devolvió las credenciales necesarias.",
                    );
                    return;
                  }

                  handleGoogleLogin(response.credential);
                }}
                onError={() => {
                  setErrorMessage("No se pudo autenticar con Google.");
                }}
                useOneTap={false}
              />
            </div>

            <p className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
              ¿No tenés una cuenta?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#4D869C] hover:underline dark:text-[#A7D129]"
              >
                Registrate
              </Link>
            </p>
          </motion.div>
        </section>

        <aside
          className="hidden flex-col p-16 text-white lg:flex lg:w-1/2"
          style={{
            backgroundImage:
              "radial-gradient(90% 70% at 100% 0%, #A7D129 0%, rgba(167,209,41,0.35) 35%, #000000 75%)",
            backgroundColor: "#000000",
          }}
        >
          <motion.div
            className="my-auto max-w-lg"
          >
            <h2 className="text-5xl font-semibold leading-tight">
              Dejá de buscar facturas en tu correo.
            </h2>

            <p className="mt-6 text-lg text-white/80">
              AtomPay encuentra tus facturas, controla tus suscripciones y te
              muestra dónde podés ahorrar, sin que tengas que revisar tu correo.
            </p>
          </motion.div>

          <div>
            <div className="flex gap-2 justify-center items-center">
              <p className="text-sm text-white/70">Soporta</p>
              <span className="h-px flex-1 bg-neutral-200 dark:bg-white/15" />
            <ul className="mt-3 flex flex-wrap gap-2">
              {DETECTED_SERVICES.map((service) => (
                <li
                key={service}
                className="rounded-full border border-white/25 px-3 py-1 text-sm text-white/90"
                >
                  {service}
                </li>
              ))}
            </ul>
            </div>
          </div>
        </aside>
      </div>
    </MotionConfig>
  );
};

export default Login;
