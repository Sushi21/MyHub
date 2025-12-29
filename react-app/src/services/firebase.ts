import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, doc, setDoc, getDoc, increment } from 'firebase/firestore';

// Firebase configuration - you'll need to replace these with your own values
// Get these from Firebase Console > Project Settings > Your apps > SDK setup and configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

// Initialize Firebase (only if config is valid)
function initializeFirebase() {
  if (firebaseConfig.apiKey === "YOUR_API_KEY") {
    console.warn('Firebase not configured - hearts will only work locally');
    return false;
  }

  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return false;
  }
}

const isFirebaseEnabled = initializeFirebase();

// Generate a unique key for an album
export function getAlbumKey(artist: string, album: string): string {
  return `${artist}::${album}`.toLowerCase().replace(/\s+/g, '-');
}

// Increment heart count in Firebase
export async function incrementHeartCount(artist: string, album: string): Promise<void> {
  if (!isFirebaseEnabled || !db) {
    console.log('Firebase not enabled - heart count not synced');
    return;
  }

  try {
    const albumKey = getAlbumKey(artist, album);
    const heartRef = doc(db, 'hearts', albumKey);

    await setDoc(heartRef, {
      artist,
      album,
      count: increment(1),
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error incrementing heart count:', error);
  }
}

// Decrement heart count in Firebase
export async function decrementHeartCount(artist: string, album: string): Promise<void> {
  if (!isFirebaseEnabled || !db) {
    console.log('Firebase not enabled - heart count not synced');
    return;
  }

  try {
    const albumKey = getAlbumKey(artist, album);
    const heartRef = doc(db, 'hearts', albumKey);

    await setDoc(heartRef, {
      artist,
      album,
      count: increment(-1),
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error decrementing heart count:', error);
  }
}

// Get heart count for an album from Firebase
export async function getHeartCount(artist: string, album: string): Promise<number> {
  if (!isFirebaseEnabled || !db) {
    return 0;
  }

  try {
    const albumKey = getAlbumKey(artist, album);
    const heartRef = doc(db, 'hearts', albumKey);
    const heartDoc = await getDoc(heartRef);

    if (heartDoc.exists()) {
      return heartDoc.data().count || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting heart count:', error);
    return 0;
  }
}

export { isFirebaseEnabled };
