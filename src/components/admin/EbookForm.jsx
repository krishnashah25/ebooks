import { useState, useEffect } from "react";
import { addEbook, updateEbook } from "../../services/ebookService";
import { uploadCoverImage, uploadPdfFile } from "../../services/storageService";
import toast from "react-hot-toast";

export default function EbookForm({ ebookToEdit, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  
  const [existingImage, setExistingImage] = useState("");
  const [existingFile, setExistingFile] = useState("");

  const [imageProgress, setImageProgress] = useState(0);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (ebookToEdit) {
      setTitle(ebookToEdit.title || "");
      setAuthor(ebookToEdit.author || "");
      setPrice(ebookToEdit.price || "");
      setExistingImage(ebookToEdit.image || "");
      setExistingFile(ebookToEdit.fileURL || "");
    } else {
      setTitle("");
      setAuthor("");
      setPrice("");
      setExistingImage("");
      setExistingFile("");
    }
    setCoverFile(null);
    setPdfFile(null);
    setImageProgress(0);
    setPdfProgress(0);
  }, [ebookToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coverFile && !existingImage) {
      toast.error("Please choose a cover image file.");
      return;
    }
    if (!pdfFile && !existingFile) {
      toast.error("Please choose a PDF document file.");
      return;
    }

    setSaving(true);
    try {
      let imageUrl = existingImage;
      let pdfUrl = existingFile;

      if (coverFile) {
        imageUrl = await uploadCoverImage(coverFile, (progress) => {
          setImageProgress(progress);
        });
      }

      if (pdfFile) {
        pdfUrl = await uploadPdfFile(pdfFile, (progress) => {
          setPdfProgress(progress);
        });
      }

      const ebookData = {
        title,
        author,
        price: parseFloat(price) || 0,
        image: imageUrl,
        fileURL: pdfUrl,
      };

      if (ebookToEdit) {
        await updateEbook(ebookToEdit.id, ebookData);
        toast.success("Ebook details updated successfully!");
      } else {
        await addEbook(ebookData);
        toast.success("New Ebook added successfully!");
      }
      onSave();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label className="block text-[11px] font-bold text-gray-400 uppercase">Ebook Title</label>
        <input
          type="text"
          required
          placeholder="Beyond the Horizon"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mt-1.5 p-2.5 rounded-xl border border-white/10 bg-gray-800 text-white text-xs focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-gray-400 uppercase">Author Name</label>
        <input
          type="text"
          required
          placeholder="Evelyn St. Claire"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full mt-1.5 p-2.5 rounded-xl border border-white/10 bg-gray-800 text-white text-xs focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-gray-400 uppercase">Price ($)</label>
        <input
          type="number"
          step="0.01"
          required
          placeholder="24.99"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full mt-1.5 p-2.5 rounded-xl border border-white/10 bg-gray-800 text-white text-xs focus:outline-none"
        />
      </div>

      {/* Cover Image Upload */}
      <div>
        <label className="block text-[11px] font-bold text-gray-400 uppercase">Cover Image (JPEG/PNG)</label>
        {existingImage && !coverFile && (
          <div className="mt-1 mb-2 flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
            <img src={existingImage} className="h-10 w-7 object-cover rounded" />
            <span className="text-[10px] text-gray-400 truncate">Existing Cover Link</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCoverFile(e.target.files[0])}
          className="w-full mt-1.5 text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
        />
        {imageProgress > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full transition-all duration-300" style={{ width: `${imageProgress}%` }}></div>
            </div>
            <span className="text-[9px] font-mono text-gray-400 mt-1 block">Uploading Cover: {imageProgress}%</span>
          </div>
        )}
      </div>

      {/* PDF Document Upload */}
      <div>
        <label className="block text-[11px] font-bold text-gray-400 uppercase">PDF Document File</label>
        {existingFile && !pdfFile && (
          <div className="mt-1 mb-2 bg-white/5 p-2 rounded-lg border border-white/5 text-[10px] text-gray-400 truncate">
            Existing PDF file: {existingFile.split("/").pop().split("?")[0]}
          </div>
        )}
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          className="w-full mt-1.5 text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
        />
        {pdfProgress > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full transition-all duration-300" style={{ width: `${pdfProgress}%` }}></div>
            </div>
            <span className="text-[9px] font-mono text-gray-400 mt-1 block">Uploading PDF: {pdfProgress}%</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-gray-950 text-xs font-bold py-3 transition-colors focus:outline-none cursor-pointer"
        >
          {saving ? "Saving Changes..." : ebookToEdit ? "Update Ebook" : "Add Ebook To Catalog"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/10 hover:bg-white/5 text-white text-xs font-bold px-4 py-3 transition-colors focus:outline-none cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
