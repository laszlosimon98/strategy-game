import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes, ReactElement } from "react";
import { cn } from "utils/cn";

type ButtonProps = HTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    variant?: "primary" | "secondary";
    size?: "default" | "icon";
    round?: "default" | "rounded";
  };

const Button = ({
  className,
  variant,
  size,
  radius,
  ...props
}: ButtonProps): ReactElement => {
  return (
    <button
      {...props}
      className={cn(buttonVariants({ variant, size, radius }), className)}
    />
  );
};

const buttonVariants = cva(
  "font-semibold transition-all hover:shadow-lg hover:scale-105 hover:cursor-pointer active:scale-100",
  {
    variants: {
      variant: {
        primary: "bg-amber-900 text-yellow-500 text-xl",
        secondary: "bg-amber-800",
      },
      size: {
        default: "h-14 min-w-44 px-4",
        icon: "h-6 w-6",
      },
      radius: {
        default: "rounded-sm",
        rounded: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      radius: "default",
    },
  }
);

export default Button;
