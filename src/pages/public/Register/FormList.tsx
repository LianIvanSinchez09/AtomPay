import { Check } from "lucide-react";

export interface FormListStep {
  id: string;
  label: string;
  description?: string;
  hasError?: boolean;
  disabled?: boolean;
}

export interface FormListProps {
  steps: FormListStep[];
  currentStep: number;
  onStepChange?: (index: number) => void;
  canNavigateTo?: (index: number) => boolean;
  ariaLabel?: string;
  className?: string;
}

type Status = "complete" | "current" | "upcoming";

const ACCENT = "bg-[#2F6E86] dark:bg-[#A7D129]";

const BADGE: Record<Status | "error", string> = {
  current: `${ACCENT} text-white dark:text-black`,
  complete: "bg-[#2F6E86]/15 text-[#2F6E86] dark:bg-[#A7D129]/20 dark:text-[#A7D129]",
  upcoming: "bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-neutral-300",
  error: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
};

const LABEL: Record<Status | "error", string> = {
  current: "font-semibold text-neutral-900 dark:text-white",
  complete: "text-neutral-900 dark:text-white",
  upcoming: "text-neutral-600 dark:text-neutral-400",
  error: "font-semibold text-red-700 dark:text-red-300",
};

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F6E86] dark:focus-visible:outline-[#A7D129]";

function statusOf(index: number, currentStep: number): Status {
  if (index < currentStep) return "complete";
  if (index === currentStep) return "current";
  return "upcoming";
}

export default function FormList({
  steps,
  currentStep,
  onStepChange,
  canNavigateTo,
  ariaLabel = "Pasos del formulario",
  className = "",
}: FormListProps) {
  if (steps.length === 0) return null;

  const isNavigable = (index: number, step: FormListStep) => {
    if (!onStepChange || step.disabled) return false;
    return canNavigateTo ? canNavigateTo(index) : index < currentStep;
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={`rounded-xl border border-neutral-200 bg-white p-4 dark:border-white/15 dark:bg-black ${className}`}
    >
      <ol>
        {steps.map((step, index) => {
          const status = statusOf(index, currentStep);
          const visual = step.hasError ? "error" : status;
          const isLast = index === steps.length - 1;
          const navigable = isNavigable(index, step);

          const content = (
            <>
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${BADGE[visual]}`}
              >
                {status === "complete" && !step.hasError ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  index + 1
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className={`block text-sm ${LABEL[visual]}`}>
                  {/* Los espacios van FUERA de los textos ocultos: al calcular el
                      nombre accesible, el espacio al borde de un <span> se pierde. */}
                  <span className="sr-only">Paso {index + 1}:</span>{" "}
                  {step.label}
                  {step.hasError && (
                    <>
                      {" "}
                      <span className="sr-only">(con errores)</span>
                    </>
                  )}
                  {status === "complete" && !step.hasError && (
                    <>
                      {" "}
                      <span className="sr-only">(completado)</span>
                    </>
                  )}
                </span>

                {step.description && (
                  <span className="block text-xs text-neutral-600 dark:text-neutral-400">
                    {step.description}
                  </span>
                )}
              </span>
            </>
          );

          const rowClass = "flex w-full items-center gap-3 rounded-lg px-1 py-1 text-left";

          return (
            <li key={step.id}>
              {navigable ? (
                <button
                  type="button"
                  onClick={() => onStepChange?.(index)}
                  aria-current={status === "current" ? "step" : undefined}
                  className={`${rowClass} cursor-pointer transition-colors hover:bg-neutral-100 motion-reduce:transition-none dark:hover:bg-white/10 ${FOCUS}`}
                >
                  {content}
                </button>
              ) : (
                <div
                  aria-current={status === "current" ? "step" : undefined}
                  className={rowClass}
                >
                  {content}
                </div>
              )}

              {!isLast && (
                <span
                  aria-hidden="true"
                  data-connector
                  className={`my-1 ml-[15.5px] block h-4 w-px ${
                    status === "complete"
                      ? ACCENT
                      : "bg-neutral-300 dark:bg-white/20"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
