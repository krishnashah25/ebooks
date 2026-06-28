import { useState } from "react";
import { signInUser } from "../../services/authService";
import toast from "react-hot-toast";

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInUser(email, password);
      toast.success("Successfully logged in!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[11px] font-bold text-gray-400 uppercase">Email Address</label>
        <input
          type="email"
          required
          placeholder="alex@lumina.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1.5 p-3 text-sm rounded-xl border border-white/10 bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-gray-400 uppercase">Password</label>
        <input
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1.5 p-3 text-sm rounded-xl border border-white/10 bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs rounded-xl transition-colors focus:outline-none shadow-md mt-6 disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Signing In..." : "Log In"}
      </button>
    </form>
  );
}
