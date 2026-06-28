import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, ShoppingCart, Shield, Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { signOutUser } from "../../services/authService";
import toast from "react-hot-toast";

export default function Navbar({ cartCount = 0 }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    try {
      await signOutUser();
      toast.success("Signed out successfully");
      navigate("/");
    } catch {
      toast.error("Failed to sign out");
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-gray-950 shadow-lg shadow-amber-400/20 group-hover:bg-amber-300 transition-colors">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="hidden sm:block text-left">
            <span className="font-black text-lg tracking-tight text-white">LUMINA</span>
            <span className="ml-1.5 rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">Books</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">
            Browse
          </Link>
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 transition-all">
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 border border-white/10">
                <div className="h-6 w-6 rounded-full bg-amber-400 flex items-center justify-center text-gray-950 text-xs font-bold">
                  {(user.displayName || user.email)?.[0]?.toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-gray-200 max-w-[120px] truncate">
                  {user.displayName || user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="rounded-xl p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all focus:outline-none"
                title="Sign Out"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 text-sm font-bold px-4 py-2.5 transition-colors"
            >
              <User className="h-4 w-4" />
              Sign In
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all focus:outline-none"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-gray-950 px-4 py-4 space-y-2">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">Browse</Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-amber-400 hover:bg-amber-400/10 transition-all">
              <Shield className="h-4 w-4" /> Admin Panel
            </Link>
          )}
          {user ? (
            <button
              onClick={() => { setMenuOpen(false); handleSignOut(); }}
              className="w-full text-left rounded-xl px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-2.5 text-sm font-bold text-center bg-amber-400 text-gray-950 hover:bg-amber-300 transition-colors">
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
