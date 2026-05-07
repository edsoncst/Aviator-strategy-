import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  initializeFirestore, 
  CACHE_SIZE_UNLIMITED 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWYbp801YgFWLIVZN-sqcp83esf7LVAeI",
  authDomain: "aviator-strategy-xi.firebaseapp.com",
  projectId: "aviator-strategy-xi",
  storageBucket: "aviator-strategy-xi.appspot.com",
  messagingSenderId: "95632541258",
  appId: "1:95632541258:web:7a8b9c1d2e3f4g5h"
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true,
  
});

export const auth = getAuth(app);
