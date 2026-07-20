import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "rounded-full px-6 py-3 font-semibold transition duration-300",
        variant === "primary"
          ? "bg-pink-600 text-white hover:bg-pink-700"
          : "border border-pink-300 bg-white text-pink-600 hover:bg-pink-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}