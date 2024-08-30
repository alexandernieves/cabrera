import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";

// Verificación y uso de valores predeterminados
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.apiKey || '',
  authDomain: Constants.expoConfig?.extra?.authDomain || '',
  projectId: Constants.expoConfig?.extra?.projectId || '',
  storageBucket: Constants.expoConfig?.extra?.storageBucket || '',
  messagingSenderId: Constants.expoConfig?.extra?.messagingSenderId || '',
  appId: Constants.expoConfig?.extra?.appId || '',
  databaseURL: Constants.expoConfig?.extra?.databaseURL || '',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getFirestore(app);
