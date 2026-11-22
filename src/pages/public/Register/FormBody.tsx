import FieldShell from "../Home/FieldShell/FieldShell";
import { Lock, User, Mail, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";

export const FormBody = ({ errors, showPassword, setShowPassword, inputClass, register, isSubmitting }) => (
  <motion.div className="flex flex-col gap-5">
    <FieldShell
      id="name"
      label="Nombre"
      icon={<User className="h-4 w-4" />}
      error={errors.name?.message}
    >
      <input
        id="name"
        type="text"
        autoComplete="name"
        placeholder="Tu nombre"
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? "name-error" : undefined}
        className={inputClass(!!errors.name)}
        {...register("name")}
      />
    </FieldShell>
    <FieldShell
      id="email"
      label="Correo electrónico"
      icon={<Mail className="h-4 w-4" />}
      error={errors.email?.message}
    >
      <input
        id="email"
        type="email"
        autoComplete="email"
        placeholder="tucorreo@ejemplo.com"
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? "email-error" : undefined}
        className={inputClass(!!errors.email)}
        {...register("email")}
      />
    </FieldShell>
    <FieldShell
      id="password"
      label="Contraseña"
      icon={<Lock className="h-4 w-4" />}
      error={errors.password?.message}
    >
      <input
        id="password"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        aria-invalid={!!errors.password}
        aria-describedby={errors.password ? "password-error" : undefined}
        className={inputClass(!!errors.password, "pr-11")}
        {...register("password")}
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
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
      label="Repetir contraseña"
      icon={<Lock className="h-4 w-4" />}
      error={errors.confirmPassword?.message}
    >
      <input
        id="confirmPassword"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Repetí tu contraseña"
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
      {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
    </button>
  </motion.div>
);
