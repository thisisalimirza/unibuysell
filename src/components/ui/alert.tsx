import * as React from "react";

import { cn } from "@/lib/utils";

function Alert({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm",
        className
      )}
      role="alert"
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn("mb-1 font-semibold leading-none", className)} {...props} />;
}

function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-6", className)} {...props} />;
}

export { Alert, AlertDescription, AlertTitle };
