import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Modern, szebb input stílus
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-12 w-full min-w-0 rounded-xl border-2 border-border bg-white/70 dark:bg-input/40 px-5 py-3 text-lg shadow-md transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-base file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Arany fókuszgyűrű
        "focus-visible:border-[--gold] focus-visible:ring-[--gold]/40 focus-visible:ring-4",
        // Animáció, finomabb placeholder
        "placeholder:italic placeholder:opacity-70",
        // Hibaállapotok
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
