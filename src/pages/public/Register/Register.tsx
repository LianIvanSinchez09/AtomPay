import { useEffect, useState, type KeyboardEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { GoogleLogin } from "@react-oauth/google";
import { FormState, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext.tsx";
import { api } from "../../../services/api";
import FieldShell from "../Home/FieldShell/FieldShell.tsx";
import ButtonForm from "./ButtonForm.tsx";
import ExpenseEvolutionChart from "../../../components/analysis/ExpenseEvolutionChart.tsx";
import type { MonthlyExpense } from "../../types/types";
import { FormBody } from "./FormBody.tsx";


const previewData: MonthlyExpense[] = [
  { month: "Ene", amount: 82000 },
  { month: "Feb", amount: 95000 },
  { month: "Mar", amount: 78000 },
  { month: "Abr", amount: 110000 },
  { month: "May", amount: 98000 },
  { month: "Jun", amount: 125000 },
];

type RegisterFormData = z.infer<typeof registerSchema>;

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Ingresá tu nombre.")
      .max(100, "El nombre no puede superar los 100 caracteres."),
    email: z
      .string()
      .trim()
      .min(1, "Ingresá tu correo electrónico.")
      .email("Ingresá un correo electrónico válido."),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .max(72, "La contraseña no puede superar los 72 caracteres."),
    confirmPassword: z.string().min(1, "Repetí tu contraseña."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

const STEP_FIELDS: (keyof RegisterFormData)[][] = [
  ["name"],
  ["email"],
  ["password", "confirmPassword"],
];

const LAST_STEP = STEP_FIELDS.length - 1;

const inputBase =
  "w-full rounded-lg border bg-white py-2.5 pl-10 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:ring-2 dark:bg-black dark:text-white dark:placeholder:text-neutral-500";

const normalInput =
  "border-neutral-300 focus:border-[#4D869C] focus:ring-[#4D869C]/25 dark:border-white/20 dark:focus:border-[#A7D129] dark:focus:ring-[#A7D129]/25";

const inputInvalid =
  "border-red-500 focus:border-red-500 focus:ring-red-500/25";

const inputClass = (hasError: boolean, paddingRight = "pr-3") =>
  `${inputBase} ${paddingRight} ${hasError ? inputInvalid : normalInput}`;

const getRegisterErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "No se pudo conectar con el servidor.";
    }

    return error.response.data?.message ?? "Error desconocido del servidor.";
  }

  return "No se pudo completar el registro.";
};

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    trigger,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState(false);

  const check = async (fields: (keyof RegisterFormData)[]) => {
    const fromStep = step;
    const isValid = await trigger(fields, { shouldFocus: true });
    if (isValid) {
      setStep((current) =>
        current === fromStep ? Math.min(current + 1, LAST_STEP) : current,
      );
    }
  };

  useEffect(() => {
    const first = STEP_FIELDS[step]?.[0];
    if (step > 0 && first) setFocus(first);
  }, [step, setFocus]);

  const STEPS = [
    { id: "name", label: "Nombre" },
    { id: "email", label: "Correo electrónico" },
    { id: "password", label: "Contraseña" },
  ];

  const completeRegister = (
    user: Parameters<typeof registerUser>[0],
    token: string,
  ) => {
    registerUser(user, token);

    localStorage.setItem("token", token);

    setMessage("¡Registro exitoso! Redirigiendo al Dashboard...");

    setTimeout(() => {
      navigate("/dashboard");
    }, 1200);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setMessage(null);
      setErrorMessage(null);

      const response = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error("Error durante el registro:", error);

      setErrorMessage(getRegisterErrorMessage(error));
    }
  };

  const handleGoogleRegister = async (credential: string) => {
    try {
      setMessage(null);
      setErrorMessage(null);

      const response = await api.post("/auth/google/register", {
        idToken: credential,
      });

      completeRegister(response.data.user, response.data.token);
    } catch (error) {
      console.error("Error durante el registro:", error);

      setErrorMessage(getRegisterErrorMessage(error));
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen bg-white dark:bg-black">
        <AnimatePresence>
          {message && (
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

              <span className="text-sm font-semibold">{message}</span>
            </motion.div>
          )}

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
        </AnimatePresence>

        <section className="flex w-full flex-col px-6 py-8 sm:px-12 lg:w-1/2 lg:px-20">
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
              Crear una cuenta
            </h1>

            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Empezá a gestionar tus gastos con AtomPay.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8">
              <FormBody
                errors={errors}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                inputClass={inputClass}
                register={register}
                isSubmitting={isSubmitting}
              />
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
                  handleGoogleRegister(response.credential);
                }}
                onError={() => {
                  setErrorMessage("No se pudo autenticar con Google.");
                }}
                useOneTap={false}
                text="signup_with"
              />
            </div>

            <p className="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
              ¿Ya tenés una cuenta?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#4D869C] hover:underline dark:text-[#A7D129]"
              >
                Iniciá sesión
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
          <div className="my-auto w-full max-w-xl">
            <div className="relative pb-12 ">
              <ExpenseEvolutionChart data={previewData} />
            </div>

            <div className="mt-8 text-center">
              <h2 className="text-3xl font-semibold leading-tight">
                Todas tus facturas. En un solo lugar.
              </h2>
              <p className="mt-4 text-sm text-white/80">
                Conectá tu Gmail y AtomPay se encarga de encontrar, ordenar y
                analizar tus gastos recurrentes.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </MotionConfig>
  );
};

export default Register;
