import { AuthProvider } from "@/contexts/auth-provider";
import React from "react";
import Footer from "./layout/footer";
import Navigation from "./layout/navigation";

interface WrapperProps {
  children: React.ReactNode;
}

function Wrapper({ children }: WrapperProps) {
  return (
    <>
      <AuthProvider>
        <Navigation />
        <main>{children}</main>
      </AuthProvider>
      <Footer />
    </>
  );
}

export default Wrapper;
