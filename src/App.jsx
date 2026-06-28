import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { firebaseError } from "./config/firebase";

export default function App() {
  if (firebaseError) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center font-sans text-gray-100">
        <div className="max-w-md w-full bg-gray-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-6 text-xl">
            ⚠️
          </div>
          <h1 className="text-lg font-bold text-white mb-2">Firebase Configuration Error</h1>
          <p className="text-sm text-red-400 font-semibold mb-4">
            Firebase configuration error: Please check API key
          </p>
          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-left font-mono text-[10px] text-gray-300 space-y-2 mb-6">
            <div className="text-red-400 font-bold">Error detail: {firebaseError.message}</div>
            <div className="text-gray-500 mt-2">// Setup VITE_FIREBASE_ env values in .env.local</div>
            <div>VITE_FIREBASE_API_KEY="your_api_key"</div>
            <div>VITE_FIREBASE_PROJECT_ID="your_project_id"</div>
          </div>
          <p className="text-[11px] text-gray-500">
            Please get a valid API Key from Firebase Console &rarr; Project Settings and configure it locally.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-950 flex flex-col font-sans text-gray-100 selection:bg-amber-400/20 selection:text-amber-300">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#18181b",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                fontSize: "12px",
              },
            }}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
