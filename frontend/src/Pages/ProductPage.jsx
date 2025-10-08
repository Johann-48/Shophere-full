import React from "react";
import { useNavigate } from "react-router-dom";
import Product from "../Components/Product";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

export default function ProductPage() {
  return (
    <>
      <Header />
      <Product />
      <Footer />
    </>
  );
}
