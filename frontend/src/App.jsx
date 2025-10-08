import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";

import ContactSellerPage from "./Pages/ContactSellerPage";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ProductPage from "./Pages/ProductPage";
import SellerPage from "./Pages/SellerPage";
import AccountManagerPage from "./Pages/AccountManagerPage";
import AboutPage from "./Pages/AboutPage";
import CompareProductPage from "./Pages/CompareProductPage";
import ProductSearchPage from "./Pages/ProductSearchPage";
import CommercePage from "./Pages/CommercePage";
import CommerceSearchPage from "./Pages/CommerceSearchPage";
import LojaDashboardPage from "./Pages/LojaDashboardPage";
import NotFoundPage from "./Pages/NotFoundPage";
import ReviewPage from "./Pages/ReviewPage";

import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
      <Route path="/produto/:id" element={<ProductPage />} />
      <Route path="/seller" element={<SellerPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/comparar/:codigo" element={<CompareProductPage />} />
      <Route path="/compare" element={<CompareProductPage />} />
      <Route path="/search" element={<ProductSearchPage />} />
      <Route path="/commerce/:id" element={<CommercePage />} />
      <Route path="/commerces/search" element={<CommerceSearchPage />} />

      {/* rota só para usuários “user” */}
      <Route element={<ProtectedRoute requiredRole="user" />}>
        <Route path="/review/:id" element={<ReviewPage />} />
      </Route>

      <Route element={<ProtectedRoute requiredRole="user" />}>
        <Route path="/accountmanager" element={<AccountManagerPage />} />
      </Route>

      <Route element={<ProtectedRoute requiredRole="user" />}>
        <Route path="/contact" element={<ContactSellerPage />} />
      </Route>

      {/* rota só para “commerce” */}
      <Route element={<ProtectedRoute requiredRole="commerce" />}>
        <Route path="/lojadashboard" element={<LojaDashboardPage />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </ThemeProvider>
  );
}

export default App;
