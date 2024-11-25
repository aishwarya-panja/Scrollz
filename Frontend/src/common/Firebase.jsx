import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDPEbakl-8wiaTKYDUHwN37c0oZzCrvADI",
  authDomain: "blogapp-c7eb0.firebaseapp.com",
  projectId: "blogapp-c7eb0",
  storageBucket: "blogapp-c7eb0.appspot.com",
  messagingSenderId: "654835710913",
  appId: "1:654835710913:web:19be788e6a883ef7f9cd40",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//google auth

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      console.log(err);
    });

    return user;
};
