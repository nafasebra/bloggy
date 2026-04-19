import { RouterProvider } from "react-router";
import { router } from "./router";
import { AuthProvider } from "@/contexts/auth-provider";
import { Toaster } from "@repo/ui/sonner";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
