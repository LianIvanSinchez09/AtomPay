import type React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import FieldShell from "../Home/FieldShell/FieldShell";
import { Lock, User, Mail, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import type { RegisterFormData } from "./Register";
import { tr } from "../../../i18n/translate";

export interface FormBodyProps {
  errors: FieldErrors<RegisterFormData>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  inputClass: (hasError: boolean, paddingRight?: string) => string;
  register: UseFormRegister<RegisterFormData>;
  isSubmitting: boolean;
}

export const FormBody: React.FC<FormBodyProps> = ({
  errors,
  showPassword,
  setShowPassword,
  inputClass,
  register,
  isSubmitting,
}) => (
  <motion.div className="flex flex-col gap-5">
    <FieldShell
      id="name"
      label={tr("Nombre")}
      icon={<User className="h-4 w-4" />}
      error={errors.name?.message}
    >
      <input
        id="name"
        type="text"
        autoComplete="name"
        placeholder={tr("Tu nombre")}
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? "name-error" : undefined}
        className={inputClass(!!errors.name)}
        {...register("name")}
      />
    </FieldShell>
    <FieldShell
      id="email"
      label={tr("Correo electrónico")}
      icon={<Mail className="h-4 w-4" />}
      error={errors.email?.message}
    >
      <input
        id="email"
        type="email"
        autoComplete="email"
        placeholder={tr("tucorreo@ejemplo.com")}
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? "email-error" : undefined}
        className={inputClass(!!errors.email)}
        {...register("email")}
      />
    </FieldShell>
    <FieldShell
      id="password"
      label={tr("Contraseña")}
      icon={<Lock className="h-4 w-4" />}
      error={errors.password?.message}
    >
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder={tr("Mínimo 8 caracteres")}
        aria-invalid={!!errors.password}
        aria-describedby={errors.password ? "password-error" : undefined}
        className={inputClass(!!errors.password, "pr-11")}
        {...register("password")}
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={
          showPassword ? tr("Ocultar contraseñas") : tr("Mostrar contraseñas")
        }
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 transition-colors hover:text-neutral-700 focus-visible:outline focus-visible:outline-[#4D869C] dark:hover:text-white dark:focus-visible:outline-[#A7D129]"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </FieldShell>
    <FieldShell
      id="confirmPassword"
      label={tr("Repetir contraseña")}
      icon={<Lock className="h-4 w-4" />}
      error={errors.confirmPassword?.message}
    >
      <input
        id="confirmPassword"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder={tr("Repetí tu contraseña")}
        aria-invalid={!!errors.confirmPassword}
        aria-describedby={
          errors.confirmPassword ? "confirmPassword-error" : undefined
        }
        className={inputClass(!!errors.confirmPassword)}
        {...register("confirmPassword")}
      />
    </FieldShell>
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full rounded-lg bg-black py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4D869C] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#A7D129] dark:text-black dark:hover:bg-[#bde43a] dark:focus-visible:outline-[#A7D129]"
    >
      {isSubmitting ? tr("Creando cuenta...") : tr("Crear cuenta")}
    </button>
  </motion.div>
);
