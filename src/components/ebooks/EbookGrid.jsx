import EbookCard from "./EbookCard";

export default function EbookGrid({ ebooks, onSelect }) {
  if (!ebooks || ebooks.length === 0) {
    return (
      <div className="bg-gray-900/40 rounded-3xl border border-dashed border-white/10 py-20 px-4 text-center max-w-md mx-auto">
        <h3 className="font-display font-bold text-lg text-white">No Ebooks Available</h3>
        <p className="text-xs text-gray-400 mt-1">
          There are no digital masterworks currently loaded in the cloud library catalogue. Check back later or add books as admin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {ebooks.map((ebook) => (
        <EbookCard key={ebook.id} ebook={ebook} onSelect={onSelect} />
      ))}
    </div>
  );
}
