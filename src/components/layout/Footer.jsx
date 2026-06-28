import { Link } from "react-router-dom";
import { BookOpen, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gray-950 text-gray-500 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400 text-gray-950">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-black text-sm tracking-wider text-white">LUMINA BOOKS</span>
          </Link>
          <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
            A premium digital marketplace for curated, high-fidelity ebooks. Discover your next intellectual obsession.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Library</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:text-amber-400 transition-colors">Browse All Ebooks</Link></li>
            <li><Link to="/login" className="hover:text-amber-400 transition-colors">Sign In / Register</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Company</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="cursor-pointer hover:text-amber-400 transition-colors">Privacy Policy</span></li>
            <li><span className="cursor-pointer hover:text-amber-400 transition-colors">Terms of Service</span></li>
            <li><span className="cursor-pointer hover:text-amber-400 transition-colors">Contact</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <p className="text-center text-[11px] text-gray-600">
          &copy; {new Date().getFullYear()} Lumina Books Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
