import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { deleteFileByUrl } from "./storageService";

const COLLECTION = "ebooks";

/**
 * Subscribe to the ebooks collection in real-time.
 * @param {function} callback - Called with array of ebook objects on every change.
 * @returns {function} Unsubscribe function.
 */
export function subscribeToEbooks(callback) {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const ebooks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(ebooks);
  });
}

/**
 * Add a new ebook document to Firestore.
 */
export async function addEbook(data) {
  return await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

/**
 * Update an existing ebook document.
 */
export async function updateEbook(id, data) {
  const ref = doc(db, COLLECTION, id);
  return await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete an ebook document and its associated Storage files.
 */
export async function deleteEbook(id, imageUrl, fileUrl) {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);

  // Clean up storage files
  if (imageUrl) {
    try { await deleteFileByUrl(imageUrl); } catch (_) {}
  }
  if (fileUrl) {
    try { await deleteFileByUrl(fileUrl); } catch (_) {}
  }
}
