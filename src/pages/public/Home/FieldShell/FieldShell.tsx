import React from 'react'

type FieldShellProps = {
    id: string;
    label: string;
    icon: ReactNode;
    error?: string;
    children: ReactNode;
};

const FieldShell = ({
    id,
    label,
    icon,
    error,
    children,
}: FieldShellProps) => (
    <div>
        <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-neutral-900 dark:text-white"
        >
            {label}
        </label>

        <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                {icon}
            </span>

            {children}
        </div>

        {error && (
            <p
                id={`${id}-error`}
                role="alert"
                className="mt-1.5 text-sm text-red-600 dark:text-red-400"
            >
                {error}
            </p>
        )}
    </div>
);

export default FieldShell
