import React from "react";
import { useNavigate } from "react-router-dom";
import LogIn from "../Components/Login";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

export default function LoginPage() {
  return (
    <>
      <Header />
      <LogIn />
      <Footer />
    </>
  );
}
