import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseApp,
} from 'firebase/app';

import {
  getFirestore,
  type Firestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  type DocumentData,
  type QueryConstraint,
  setLogLevel,
} from 'firebase/firestore';

import {
  getAuth,
  type Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';

import {
  Product,
  Category,
  BuyingGuide,
  SiteSettings,
} from '../types';

/* =========================================================
   FIREBASE CONFIGURATION
   ========================================================= */

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    'gen-lang-client-0337239368.firebaseapp.com',

  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    'gen-lang-client-0337239368',

  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'gen-lang-client-0337239368.firebasestorage.app',

  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    '78380390892',

  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:78380390892:web:74bf29b461d4c565aa48c9',

  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

/*
 * IMPORTANT:
 * This is the Firestore database visible in your Firebase Console.
 */
const FIRESTORE_DATABASE_ID =
  'ai-studio-549596a6-9396-42b4-ba75-f2f151f94abf';

/* =========================================================
   VALIDATE CONFIGURATION
   ========================================================= */

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.authDomain &&
  firebaseConfig.appId
);

if (!firebaseConfig.apiKey) {
  console.error(
    'Firebase API key is missing. Check VITE_FIREBASE_API_KEY in .env'
  );
}

if (firebaseConfig.projectId !== 'gen-lang-client-0337239368') {
  console.error(
    'WARNING: Firebase project ID is not gen-lang-client-0337239368:',
    firebaseConfig.projectId
  );
}

/* =========================================================
   INITIALIZE FIREBASE
   ========================================================= */

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    /*
     * Reuse the existing Firebase app if Vite hot-reloaded
     * the application. Otherwise initialize it.
     */
    app = getApps().length > 0
      ? getApp()
      : initializeApp(firebaseConfig);

    /*
     * IMPORTANT:
     * Use the named Firestore database from your Firebase Console.
     */
    db = getFirestore(app, FIRESTORE_DATABASE_ID);

    /*
     * Firebase Authentication
     */
    auth = getAuth(app);

    /*
     * Keep Firebase logs available while we are debugging.
     * We can change this back to 'silent' after everything works.
     */
    setLogLevel('error');

    console.log('=================================');
    console.log('Firebase initialized successfully');
    console.log('Project:', firebaseConfig.projectId);
    console.log('Firestore database:', FIRESTORE_DATABASE_ID);
    console.log('Auth domain:', firebaseConfig.authDomain);
    console.log('=================================');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    app = null;
    db = null;
    auth = null;
  }
}

/* =========================================================
   EXPORT FIREBASE INSTANCES
   ========================================================= */

export { app, db, auth };

/* =========================================================
   FIRESTORE ERROR HANDLING
   ========================================================= */

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errMessage =
    error instanceof Error ? error.message : String(error);

  console.error(
    `Firestore ${operationType} failed on [${path}]:`,
    errMessage
  );

  console.error('Full Firestore error:', error);
}

/* =========================================================
   COLLECTION NAMES
   ========================================================= */

export const COLLECTIONS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  BUYING_GUIDES: 'buyingGuides',
  SETTINGS: 'siteSettings',
} as const;

/* =========================================================
   PRODUCTS
   ========================================================= */

export async function getFirestoreProducts(): Promise<Product[]> {
  if (!db) {
    console.error('Firestore is not initialized.');
    return [];
  }

  try {
    const q = query(
      collection(db, COLLECTIONS.PRODUCTS)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({
      ...(d.data() as Product),
      id: d.id,
    }));
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.LIST,
      COLLECTIONS.PRODUCTS
    );

    return [];
  }
}

export async function saveProductToFirestore(
  product: Product
): Promise<boolean> {
  if (!db) return false;

  try {
    const docRef = doc(
      db,
      COLLECTIONS.PRODUCTS,
      product.productId
    );

    await setDoc(
      docRef,
      {
        ...product,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.WRITE,
      `${COLLECTIONS.PRODUCTS}/${product.productId}`
    );

    return false;
  }
}

export async function saveProductsBatchToFirestore(
  products: Product[]
): Promise<{ success: number; failed: number }> {
  if (!db || products.length === 0) {
    return {
      success: 0,
      failed: 0,
    };
  }

  let success = 0;
  let failed = 0;

  const chunkSize = 400;

  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);

    const batch = writeBatch(db);

    for (const product of chunk) {
      const docRef = doc(
        db,
        COLLECTIONS.PRODUCTS,
        product.productId
      );

      batch.set(
        docRef,
        {
          ...product,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    try {
      await batch.commit();
      success += chunk.length;
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.WRITE,
        COLLECTIONS.PRODUCTS
      );

      failed += chunk.length;
    }
  }

  return {
    success,
    failed,
  };
}

export async function deleteProductFromFirestore(
  productId: string
): Promise<boolean> {
  if (!db) return false;

  try {
    await deleteDoc(
      doc(db, COLLECTIONS.PRODUCTS, productId)
    );

    return true;
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.DELETE,
      `${COLLECTIONS.PRODUCTS}/${productId}`
    );

    return false;
  }
}

/* =========================================================
   CATEGORIES
   ========================================================= */

export async function getFirestoreCategories(): Promise<Category[]> {
  if (!db) {
    console.error('Firestore is not initialized.');
    return [];
  }

  try {
    const q = query(
      collection(db, COLLECTIONS.CATEGORIES)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({
      ...(d.data() as Category),
      id: d.id,
    }));
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.LIST,
      COLLECTIONS.CATEGORIES
    );

    return [];
  }
}

export async function saveCategoryToFirestore(
  category: Category
): Promise<boolean> {
  if (!db) return false;

  try {
    const docRef = doc(
      db,
      COLLECTIONS.CATEGORIES,
      category.id
    );

    await setDoc(
      docRef,
      category,
      { merge: true }
    );

    return true;
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.WRITE,
      `${COLLECTIONS.CATEGORIES}/${category.id}`
    );

    return false;
  }
}

export async function deleteCategoryFromFirestore(
  categoryId: string
): Promise<boolean> {
  if (!db) return false;

  try {
    await deleteDoc(
      doc(
        db,
        COLLECTIONS.CATEGORIES,
        categoryId
      )
    );

    return true;
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.DELETE,
      `${COLLECTIONS.CATEGORIES}/${categoryId}`
    );

    return false;
  }
}

/* =========================================================
   BUYING GUIDES
   ========================================================= */

export async function getFirestoreBuyingGuides(): Promise<BuyingGuide[]> {
  if (!db) {
    console.error('Firestore is not initialized.');
    return [];
  }

  try {
    const q = query(
      collection(db, COLLECTIONS.BUYING_GUIDES)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({
      ...(d.data() as BuyingGuide),
      id: d.id,
    }));
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.LIST,
      COLLECTIONS.BUYING_GUIDES
    );

    return [];
  }
}

export async function saveBuyingGuideToFirestore(
  guide: BuyingGuide
): Promise<boolean> {
  if (!db) return false;

  try {
    const docRef = doc(
      db,
      COLLECTIONS.BUYING_GUIDES,
      guide.id
    );

    await setDoc(
      docRef,
      {
        ...guide,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.WRITE,
      `${COLLECTIONS.BUYING_GUIDES}/${guide.id}`
    );

    return false;
  }
}

export async function deleteBuyingGuideFromFirestore(
  guideId: string
): Promise<boolean> {
  if (!db) return false;

  try {
    await deleteDoc(
      doc(
        db,
        COLLECTIONS.BUYING_GUIDES,
        guideId
      )
    );

    return true;
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.DELETE,
      `${COLLECTIONS.BUYING_GUIDES}/${guideId}`
    );

    return false;
  }
}

/* =========================================================
   SITE SETTINGS
   ========================================================= */

export async function getFirestoreSiteSettings(): Promise<SiteSettings | null> {
  if (!db) {
    console.error('Firestore is not initialized.');
    return null;
  }

  try {
    const docRef = doc(
      db,
      COLLECTIONS.SETTINGS,
      'main'
    );

    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as SiteSettings;
    }

    return null;
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.GET,
      `${COLLECTIONS.SETTINGS}/main`
    );

    return null;
  }
}

export async function saveFirestoreSiteSettings(
  settings: SiteSettings
): Promise<boolean> {
  if (!db) return false;

  try {
    const docRef = doc(
      db,
      COLLECTIONS.SETTINGS,
      'main'
    );

    await setDoc(
      docRef,
      settings,
      { merge: true }
    );

    return true;
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.WRITE,
      `${COLLECTIONS.SETTINGS}/main`
    );

    return false;
  }
}

/* =========================================================
   ADMIN HELPERS
   ========================================================= */

export async function checkAdminAccess(
  uid: string
): Promise<boolean> {
  if (!db) {
    throw new Error(
      'Firestore is not initialized.'
    );
  }

  try {
    const adminRef = doc(
      db,
      'admins',
      uid
    );

    const adminSnapshot = await getDoc(
      adminRef
    );

    if (!adminSnapshot.exists()) {
      console.warn(
        'Admin document does not exist:',
        uid
      );

      return false;
    }

    const adminData = adminSnapshot.data();

    return adminData?.active === true;
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.GET,
      `admins/${uid}`
    );

    throw error;
  }
}

/* =========================================================
   GOOGLE AUTHENTICATION
   ========================================================= */

export async function signInWithGoogle(): Promise<User | null> {
  if (!auth) {
    throw new Error(
      'Firebase Authentication is not initialized.'
    );
  }

  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: 'select_account',
  });

  const result = await signInWithPopup(
    auth,
    provider
  );

  return result.user;
}

/* =========================================================
   EMAIL/PASSWORD AUTHENTICATION
   ========================================================= */

export async function signInWithEmail(
  email: string,
  password: string
): Promise<User | null> {
  if (!auth) {
    throw new Error(
      'Firebase Authentication is not initialized.'
    );
  }

  const result =
    await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

  return result.user;
}

/* =========================================================
   LOGOUT
   ========================================================= */

export async function logOut(): Promise<void> {
  if (!auth) return;

  await signOut(auth);
}

/* =========================================================
   AUTH STATE
   ========================================================= */

export function subscribeToAuthState(
  callback: (user: User | null) => void
) {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(
    auth,
    callback
  );
}