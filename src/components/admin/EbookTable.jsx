import { Edit2, Trash2 } from "lucide-react";
import { deleteEbook } from "../../services/ebookService";
import toast from "react-hot-toast";

export default function EbookTable({ ebooks, onEdit }) {
  const handleDelete = async (ebook) => {
    if (confirm(`Are you sure you want to remove "${ebook.title}" from the catalog?`)) {
      try {
        await deleteEbook(ebook.id, ebook.image, ebook.fileURL);
        toast.success("Ebook removed from inventory successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete ebook. Please try again.");
      }
    }
  };

  if (!ebooks || ebooks.length === 0) {
    return (
      <div className="bg-gray-900/40 rounded-2xl border border-white/5 py-12 text-center text-gray-400 text-sm">
        No ebooks in the inventory catalog. Use the form to add one.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-gray-900/40 shadow-sm">
      <table className="w-full border-collapse text-left text-xs">
        <thead className="bg-gray-950/60 text-gray-400 font-bold uppercase border-b border-white/10">
          <tr>
            <th className="p-4">Ebook Details</th>
            <th className="p-4">Genre / Type</th>
            <th className="p-4">Price</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-gray-200">
          {ebooks.map((ebook) => (
            <tr key={ebook.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="p-4 flex items-center gap-3">
                <img
                  src={ebook.image || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=100"}
                  className="h-10 w-7 rounded object-cover shadow-xs border border-white/5"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-white truncate">{ebook.title}</h4>
                  <p className="text-[10px] text-gray-400">by {ebook.author}</p>
                </div>
              </td>
              <td className="p-4 font-mono text-gray-400 uppercase text-[10px] tracking-wide">
                PDF Document
              </td>
              <td className="p-4 font-mono font-bold text-white">
                ${typeof ebook.price === "number" ? ebook.price.toFixed(2) : ebook.price}
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={() => onEdit(ebook)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors focus:outline-none cursor-pointer"
                    title="Edit details"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ebook)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors focus:outline-none cursor-pointer"
                    title="Remove book"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
