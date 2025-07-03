
import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { theme } = useTheme();
  
  return (
    <SonnerToaster
      theme={theme as "light" | "dark" | "system"}
      className="toaster-container"
      toastOptions={{
        classNames: {
          toast: "group toast",
          title: "toast-title",
          description: "toast-description",
          actionButton: "toast-action",
          closeButton: "toast-close",
          success: "bg-green-500",
          error: "bg-red-500",
          warning: "bg-yellow-500",
          info: "bg-blue-500",
        }
      }}
    />
  );
}
