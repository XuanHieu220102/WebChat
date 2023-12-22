import firebase from 'firebase/compat/app';
import 'firebase/compat/analytics';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDqE8paT7hx4O9hgFux_quzQR9x5_v9k-4",
  authDomain: "chata-defd6.firebaseapp.com",
  projectId: "chata-defd6",
  storageBucket: "chata-defd6.appspot.com",
  messagingSenderId: "915145165865",
  appId: "1:915145165865:web:87be3b34e22b426a2c6038",
  measurementId: "G-ZKCHM2RFV6"
};

build: {

  /** If you set esmExternals to true, this plugins assumes that 
    all external dependencies are ES modules */

  commonjsOptions: {
     esmExternals: true 
  }
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();


// firebase.auth().useEmulator("http://localhost:9099", { disableWarnings: true })
auth.useEmulator('http://localhost:9099');
if (window.location.hostname === 'localhost') {
  db.useEmulator('localhost', '8080');
}

export { db, auth };
export default firebase;

