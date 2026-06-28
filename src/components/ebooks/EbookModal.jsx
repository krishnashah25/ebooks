import Modal from "../ui/Modal";
import { Download, Lock, FileText, Calendar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EbookModal({ ebook, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!ebook) return null;

  const handleDownload = () => {
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
    <Modal title="Ebook Details" onClose={onClose} maxWidth="max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Cover Preview */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-xl bg-gray-950/80 shadow-md border border-white/5">
            <img
              src={ebook.image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400"}
              alt={ebook.title}
              referrerpolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Ebook Info */}
        <div className="md:col-span-7 flex flex-col justify-between text-left space-y-4">
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight text-white leading-tight">
              {ebook.title}
            </h3>
            <p className="text-sm text-gray-400 mt-1">by <span className="text-white font-medium">{ebook.author}</span></p>
          </div>

          <div className="text-2xl font-display font-extrabold text-white">
            ${typeof ebook.price === "number" ? ebook.price.toFixed(2) : ebook.price}
            <span className="text-[10px] text-gray-400 font-normal ml-2 tracking-widest uppercase block">
              Instant Cloud Delivery
            </span>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
            <div className="bg-white/5 p-2.5 rounded-xl text-left">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-gray-400">Format</span>
              <span className="block text-xs font-bold text-gray-200 mt-0.5 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-amber-400" />
                PDF Document
              </span>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl text-left">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-gray-400">Added On</span>
              <span className="block text-xs font-bold text-gray-200 mt-0.5 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                {ebook.createdAt ? new Date(ebook.createdAt.seconds * 1000).toLocaleDateString() : "Just Now"}
              </span>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-4">
            <button
              onClick={handleDownload}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 px-5 py-3 text-sm font-bold shadow-md transition-colors focus:outline-none cursor-pointer"
            >
              {user ? (
                <>
                  <Download className="h-4 w-4" />
                  Download PDF Ebook
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Sign In to Unlock & Download
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
