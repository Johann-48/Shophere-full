import React from "react";
import { useNavigate } from "react-router-dom";
import Seller from "../Components/Seller";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

export default function SellerPage() {
  return (
    <>
      <Header />
      <Seller />
      <Footer />
    </>
  );
}
