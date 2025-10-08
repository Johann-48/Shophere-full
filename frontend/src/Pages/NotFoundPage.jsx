// src/Pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="mb-6">Página não encontrada</p>
      <Link to="/" className="text-blue-600 underline">
        Voltar para a home
      </Link>
    </div>
  );
}
