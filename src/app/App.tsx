import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { ReduxProvider } from "./providers/ReduxProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { router } from "./router";
import "@/locales";
import "@/styles/index.css";

function AppContent() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: { fontFamily: "Inter, system-ui, sans-serif" },
        }}
      />
    </ThemeProvider>
  );
}

export function App() {
  return (
    <HelmetProvider>
      <ReduxProvider>
        <AppContent />
      </ReduxProvider>
    </HelmetProvider>
  );
}
