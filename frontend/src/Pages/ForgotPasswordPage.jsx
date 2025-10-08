import React from "react";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../Components/ForgotPassword";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

export default function ForgotPasswordPage() {
  return (
    <>
      <Header />
      <ForgotPassword />
      <Footer />
    </>
  );
}
