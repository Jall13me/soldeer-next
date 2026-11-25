'use client';

interface ConfirmSubmitButtonProps {
  message: string;
  className?: string;
  children: React.ReactNode;
}

/** Botón de submit que pide confirmación antes de ejecutar una acción destructiva. */
export function ConfirmSubmitButton({ message, className, children }: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
