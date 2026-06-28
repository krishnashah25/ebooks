import { initializeApp, getApps, deleteApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

const CONFIG_KEY = "lumina_firebase_config";

// Retrieve config from Env or LocalStorage
export function getFirebaseConfig() {
  const localConfigStr = localStorage.getItem(CONFIG_KEY);
  if (localConfigStr) {
    try {
      const parsed = JSON.parse(localConfigStr);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse local firebase config:", e);
    }
  }

  // Fallback to Vite env variables
  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig;
  }

  return null;
}

export function saveFirebaseConfig(config) {
  if (!config) {
    localStorage.removeItem(CONFIG_KEY);
  } else {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }
}

// Global active instances
let appInstance = null;
let authInstance = null;
let dbInstance = null;
let storageInstance = null;
let connectionStatus = "Disconnected";
let connectionError = null;

export function getFirebaseStatus() {
  return {
    status: connectionStatus,
    error: connectionError,
    hasConfig: !!getFirebaseConfig()
  };
}

// Core Initialization
export function initFirebase() {
  const config = getFirebaseConfig();
  
  // Clean up existing apps if initializing again
  const activeApps = getApps();
  if (activeApps.length > 0) {
    for (const activeApp of activeApps) {
      try {
        deleteApp(activeApp);
      } catch (err) {
        console.error("Error tearing down Firebase app:", err);
      }
    }
  }

  appInstance = null;
  authInstance = null;
  dbInstance = null;
  storageInstance = null;

  if (!config) {
    connectionStatus = "Disconnected";
    connectionError = "No configuration found. Add Firebase credentials to get started.";
    return false;
  }

  try {
    appInstance = initializeApp(config);
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
    storageInstance = getStorage(appInstance);
    connectionStatus = "Connected";
    connectionError = null;
    console.log("Firebase initialized successfully with project:", config.projectId);
    return true;
  } catch (err) {
    connectionStatus = "Error";
    connectionError = err.message || "Failed to initialize Firebase App.";
    console.error("Firebase init error:", err);
    return false;
  }
}

// Initial initialization on load
initFirebase();

// AUTH ENTRIES
export async function firebaseRegister(email, password, displayName) {
  if (!authInstance) throw new Error("Firebase Auth is not initialized.");
  const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
  const user = userCredential.user;
  await updateProfile(user, {
    displayName: displayName
  });
  
  // Initialize user profile in Firestore
  await setDoc(doc(dbInstance, "users", user.uid), {
    name: displayName,
    email: email,
    membership: "Standard",
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150`,
    library: []
  });

  return user;
}

export async function firebaseLogin(email, password) {
  if (!authInstance) throw new Error("Firebase Auth is not initialized.");
  const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
  return userCredential.user;
}

export async function firebaseLogout() {
  if (!authInstance) return;
  await signOut(authInstance);
}

export function subscribeToAuth(callback) {
  if (!authInstance) return () => {};
  return onAuthStateChanged(authInstance, callback);
}

// FIRESTORE ENTRIES

// Fetch complete books collection
export async function getFirestoreBooks() {
  if (!dbInstance) return null;
  try {
    const querySnapshot = await getDocs(collection(dbInstance, "books"));
    const books = [];
    querySnapshot.forEach((doc) => {
      books.push({ id: doc.id, ...doc.data() });
    });
    return books;
  } catch (e) {
    console.error("Firestore getBooks error:", e);
    return null;
  }
}

// Add book to Firestore (Admin operation)
export async function addFirestoreBook(book) {
  if (!dbInstance) return;
  const bookRef = doc(dbInstance, "books", book.id);
  await setDoc(bookRef, book);
}

// Delete book from Firestore (Admin operation)
export async function deleteFirestoreBook(bookId) {
  if (!dbInstance) return;
  await deleteDoc(doc(dbInstance, "books", bookId));
}

// Fetch community reviews
export async function getFirestoreReviews() {
  if (!dbInstance) return null;
  try {
    const q = query(collection(dbInstance, "reviews"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    return reviews;
  } catch (e) {
    console.error("Firestore getReviews error:", e);
    return null;
  }
}

// Submit a review
export async function addFirestoreReview(review) {
  if (!dbInstance) return;
  // Firestore needs a real timestamp to sort by newest
  const reviewRef = doc(dbInstance, "reviews", review.id);
  await setDoc(reviewRef, {
    ...review,
    timestamp: Date.now()
  });
}

// Fetch user profile info
export async function getFirestoreUserProfile(uid) {
  if (!dbInstance) return null;
  try {
    const docRef = doc(dbInstance, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (e) {
    console.error("Firestore getUserProfile error:", e);
    return null;
  }
}

// Sync complete user data (Library, Membership, Avatar etc.)
export async function syncFirestoreUserProfile(uid, profileData) {
  if (!dbInstance) return;
  try {
    const docRef = doc(dbInstance, "users", uid);
    await setDoc(docRef, profileData, { merge: true });
  } catch (e) {
    console.error("Firestore syncUserProfile error:", e);
  }
}

// Sync cart data to Firestore
export async function syncFirestoreUserCart(uid, cart) {
  if (!dbInstance) return;
  try {
    const docRef = doc(dbInstance, "carts", uid);
    await setDoc(docRef, { cart });
  } catch (e) {
    console.error("Firestore syncUserCart error:", e);
  }
}

// Fetch cart data from Firestore
export async function getFirestoreUserCart(uid) {
  if (!dbInstance) return null;
  try {
    const docRef = doc(dbInstance, "carts", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().cart || [];
    }
  } catch (e) {
    console.error("Firestore getCart error:", e);
  }
  return [];
}

// Sync wishlist to Firestore
export async function syncFirestoreUserWishlist(uid, wishlist) {
  if (!dbInstance) return;
  try {
    const docRef = doc(dbInstance, "wishlists", uid);
    await setDoc(docRef, { wishlist });
  } catch (e) {
    console.error("Firestore syncUserWishlist error:", e);
  }
}

// Fetch wishlist from Firestore
export async function getFirestoreUserWishlist(uid) {
  if (!dbInstance) return null;
  try {
    const docRef = doc(dbInstance, "wishlists", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().wishlist || [];
    }
  } catch (e) {
    console.error("Firestore getWishlist error:", e);
  }
  return [];
}

// Sync orders history
export async function getFirestoreOrders(uid) {
  if (!dbInstance) return null;
  try {
    const docRef = doc(dbInstance, "orders", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().orders || [];
    }
  } catch (e) {
    console.error("Firestore getOrders error:", e);
  }
  return [];
}

export async function syncFirestoreOrders(uid, orders) {
  if (!dbInstance) return;
  try {
    const docRef = doc(dbInstance, "orders", uid);
    await setDoc(docRef, { orders });
  } catch (e) {
    console.error("Firestore syncOrders error:", e);
  }
}

// Seed Initial Data to Firestore
export async function seedFirestoreDatabase(initialBooks, initialReviews) {
  if (!dbInstance) throw new Error("Firestore is not connected.");
  
  // 1. Seed Books
  console.log("Seeding books to firestore...");
  for (const book of initialBooks) {
    const bookRef = doc(dbInstance, "books", book.id);
    await setDoc(bookRef, book);
  }

  // 2. Seed Reviews
  console.log("Seeding reviews to firestore...");
  for (const review of initialReviews) {
    const reviewRef = doc(dbInstance, "reviews", review.id);
    await setDoc(reviewRef, {
      ...review,
      timestamp: Date.now() - 1000 * 60 * 60 * 24 // offset by a day
    });
  }

  console.log("Seeding complete!");
}

// Upload file to Firebase Storage
export function uploadFirestoreFile(file, folder, onProgress) {
  return new Promise((resolve, reject) => {
    if (!storageInstance) {
      reject(new Error("Firebase Storage is not initialized."));
      return;
    }
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const storageRef = ref(storageInstance, `${folder}/${fileName}`);
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

// Delete file from Storage by its download URL
export async function deleteFirestoreFile(url) {
  if (!storageInstance) return;
  try {
    const fileRef = ref(storageInstance, url);
    await deleteObject(fileRef);
  } catch (err) {
    console.warn("Could not delete file:", err.message);
  }
}
