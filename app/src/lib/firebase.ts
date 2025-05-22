import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB5aUdHfTnHYDMrAICkYdb-YRmMnZ7HDrc",
  authDomain: "learn-21ffd.firebaseapp.com",
  projectId: "learn-21ffd",
  storageBucket: "learn-21ffd.firebasestorage.app",
  messagingSenderId: "11990743659",
  appId: "1:11990743659:web:fce2706aa80bc837b54f2e",
  measurementId: "G-5CZTWC5W99"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;