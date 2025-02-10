import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebase_config";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 