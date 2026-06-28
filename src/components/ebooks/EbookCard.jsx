import { Star, Download, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EbookCard({ ebook, onSelect }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAction = (e) => {
    e.stopPropagation();
    if (!user) {
      toast("Please sign in to download this ebook.", { icon: "🔒" });
      navigate("/login");
    } else if (ebook.fileURL) {
      window.open(ebook.fileURL, "_blank");
      toast.success("Download started!");
    } else {
      toast.error("Download link is missing for this ebook.");
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(ebook)}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-gray-900/60 p-3 shadow-md transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] cursor-pointer"
    >
      {/* Book cover frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-950/80 shadow-inner">
        <img
          src={ebook.image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400"}
          alt={ebook.title}
          referrerpolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay details */}
        <div className="absolute inset-0 bg-gray-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect && onSelect(ebook); }}
            className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-gray-950 shadow-md hover:bg-gray-100 transition-colors focus:outline-none"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 flex flex-1 flex-col text-left px-1">
        <h3 className="font-display font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
          {ebook.title}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">by {ebook.author}</p>

        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="font-display text-base font-extrabold text-white">
            ${typeof ebook.price === "number" ? ebook.price.toFixed(2) : ebook.price}
          </span>
          <button
            onClick={handleAction}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 focus:outline-none cursor-pointer"
          >
            {user ? (
              <>
                <Download className="h-3.5 w-3.5" />
                Download
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                Unlock Ebook
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
