import React from "react";
import { useNavigate } from "react-router-dom";
import ContactSeller from "../Components/ContactSeller";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

export default function ContactSellerPage() {
  return (
    <>
      <Header />
      <ContactSeller />
      <Footer />
    </>
  );
}
