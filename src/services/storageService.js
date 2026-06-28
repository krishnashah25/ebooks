import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../config/firebase";

/**
 * Upload a file to Firebase Storage with progress reporting.
 * @param {File} file - The file to upload.
 * @param {string} folder - Storage folder (e.g. "covers" or "pdfs").
 * @param {function} onProgress - Called with (0-100) upload percentage.
 * @returns {Promise<string>} - Download URL.
 */
export function uploadFile(file, folder, onProgress) {
  return new Promise((resolve, reject) => {
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

/**
 * Upload a cover image.
 */
export function uploadCoverImage(file, onProgress) {
  return uploadFile(file, "covers", onProgress);
}

/**
 * Upload a PDF file.
 */
export function uploadPdfFile(file, onProgress) {
  return uploadFile(file, "pdfs", onProgress);
}

/**
 * Delete a file from Storage by its full download URL.
 */
export async function deleteFileByUrl(url) {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (err) {
    console.warn("Could not delete file:", err.message);
  }
}
