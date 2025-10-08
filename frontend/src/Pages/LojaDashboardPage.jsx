import React from "react";
import { useNavigate } from "react-router-dom";
import LojaDashboard from "../Components/LojaDashboard";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

export default function LojaDashboardPage() {
  return (
    <>
      <Header />
      <LojaDashboard />
      <Footer />
    </>
  );
}
