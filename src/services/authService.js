import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

/**
 * Register a new user with email, password and display name.
 * Also creates a Firestore user profile document.
 */
export async function signUpUser(email, password, displayName) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const user = credential.user;

  // Set display name on the Auth profile
  await updateProfile(user, { displayName });

  // Create Firestore user profile
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email,
    displayName,
    createdAt: serverTimestamp(),
  });

  return user;
}

/**
 * Sign in an existing user.
 */
export async function signInUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Sign out the current user.
 */
export async function signOutUser() {
  await signOut(auth);
}
