import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/auth/LoginForm";
import SignupForm from "../components/auth/SignupForm";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("login"); // 'login' or 'signup'

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-gray-900/60 border border-white/10 rounded-3xl p-8 shadow-2xl relative space-y-6">
        
        <div className="flex flex-col items-center space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-gray-950 shadow-lg shadow-amber-400/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-bold tracking-tight text-white mt-2">
            Lumina Books Registry
          </h2>
          <p className="text-xs text-gray-400">
            {tab === "login" ? "Sign in to access your digital library" : "Create an account to start cataloging ebooks"}
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-gray-950 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none cursor-pointer ${tab === "login" ? "bg-white/10 text-white shadow-xs" : "text-gray-400 hover:text-white"}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none cursor-pointer ${tab === "signup" ? "bg-white/10 text-white shadow-xs" : "text-gray-400 hover:text-white"}`}
          >
            Create Account
          </button>
        </div>

        {/* Dynamic Forms */}
        {tab === "login" ? (
          <LoginForm onSuccess={() => navigate("/")} />
        ) : (
          <SignupForm onSuccess={() => navigate("/")} />
        )}
      </div>
    </div>
  );
}
