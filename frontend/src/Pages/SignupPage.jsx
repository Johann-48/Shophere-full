import React from "react";
import { useNavigate } from "react-router-dom";
import SignUp from "../Components/Signup";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

export default function SignupPage() {
  return (
    <>
      <Header />
      <SignUp />
      <Footer />
    </>
  );
}
