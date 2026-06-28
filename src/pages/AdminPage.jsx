import { useState } from "react";
import { useEbooks } from "../hooks/useEbooks";
import EbookForm from "../components/admin/EbookForm";
import EbookTable from "../components/admin/EbookTable";
import Loader from "../components/ui/Loader";
import { PlusCircle, ShieldCheck, Database, DollarSign } from "lucide-react";

export default function AdminPage() {
  const { ebooks, loading } = useEbooks();
  const [ebookToEdit, setEbookToEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (ebook) => {
    setEbookToEdit(ebook);
    setShowForm(true);
  };

  const handleSave = () => {
    setEbookToEdit(null);
    setShowForm(false);
  };

  const handleCancel = () => {
    setEbookToEdit(null);
    setShowForm(false);
  };

  const totalCatalogValue = ebooks ? ebooks.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-left space-y-1 mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-400/20">
          <ShieldCheck className="h-4 w-4" />
          Admin Operations Portal
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-white mt-2">
          Ebook Inventory Management
        </h1>
        <p className="text-sm text-gray-400">
          Upload and edit ebooks, set pricing models, and monitor live Firestore collections.
        </p>
      </div>

      {/* Stats row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 text-left">
        <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-400/10 text-amber-400">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Catalogue Items</span>
            <span className="block text-xl font-extrabold text-white mt-0.5">{loading ? "..." : ebooks.length}</span>
          </div>
        </div>

        <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-400/10 text-emerald-400">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Cumulative Value</span>
            <span className="block text-xl font-extrabold text-white mt-0.5">${loading ? "..." : totalCatalogValue.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-5 flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <button
            onClick={() => { setEbookToEdit(null); setShowForm(true); }}
            className="w-full h-full min-h-[52px] rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            Add Ebook to Registry
          </button>
        </div>
      </section>

      {/* Admin Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {showForm && (
          <div className="lg:col-span-4 bg-gray-900/60 p-6 rounded-3xl border border-white/10 shadow-lg">
            <h3 className="font-display font-bold text-sm text-white border-b border-white/5 pb-3 mb-4 uppercase tracking-wider">
              {ebookToEdit ? "Edit Catalogue Item" : "Create Catalogue Item"}
            </h3>
            <EbookForm
              ebookToEdit={ebookToEdit}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        )}

        <div className={showForm ? "lg:col-span-8 space-y-4" : "lg:col-span-12 space-y-4"}>
          <h2 className="text-base font-bold text-white text-left">Active Bookstore Ebooks</h2>
          {loading ? (
            <div className="py-12 bg-gray-900/40 rounded-2xl border border-white/5">
              <Loader size="md" text="Synching live catalog..." />
            </div>
          ) : (
            <EbookTable ebooks={ebooks} onEdit={handleEdit} />
          )}
        </div>
      </div>
    </div>
  );
}
