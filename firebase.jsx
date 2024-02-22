import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAhlWDWLad5Juzw5L0JJet_ac9aStZ-f-Q",
  authDomain: "tenziesleaderboard.firebaseapp.com",
  projectId: "tenziesleaderboard",
  storageBucket: "tenziesleaderboard.appspot.com",
  messagingSenderId: "494496877895",
  appId: "1:494496877895:web:be60aa4bfd10db33b49062"
};



const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const leaderboard = collection(db, "scores")
