import React from "react";
import { useNavigate } from "react-router-dom";
import Home from "../Components/Home";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

export default function HomePage() {
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
}
