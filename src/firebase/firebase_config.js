import firebase from "firebase/app";
// import "firebase/auth";
// import "firebase/firestore";
// import "firebase/functions";
import "firebase/analytics";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAxR5A4pPhIui_gp7jUnxbYJK3oKFnE1Dc",
    authDomain: "kenlab.firebaseapp.com",
    projectId: "kenlab",
    storageBucket: "kenlab.appspot.com",
    messagingSenderId: "696334830892",
    appId: "1:696334830892:web:ee963987e43bc41ca13089",
    measurementId: "G-GLX0QFJ5CY"
};

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    //     if (process.env.NODE_ENV === "development") {
    //         const localHost = "localhost";
    //         firebase.app().functions("asia-northEast1").useEmulator("localhost", 5001);
    //         firebase.firestore().useEmulator(localHost, 8080);
    //         firebase.auth().useEmulator(`http://${localHost}:9099/`);
    //     }
}
export default firebase;
