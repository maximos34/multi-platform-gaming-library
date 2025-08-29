const admin = require('firebase-admin');
require('dotenv').config();

// Check if we're in a production environment with Firebase credentials
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  // Initialize Firebase Admin SDK with service account
  const serviceAccount = {
    type: process.env.FIREBASE_TYPE || 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
    token_uri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  };

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  }

  const db = admin.firestore();
  const auth = admin.auth();

  module.exports = { admin, db, auth };
} else {
  // Mock Firebase for development
  console.log('Firebase: Using mock configuration for development');

  const mockAdmin = {
    initializeApp: () => {
      console.log('Firebase: Initialized mock app');
    },
    auth: () => ({
      createUser: async () => ({ uid: 'mock-user-id' }),
      getUser: async () => ({ uid: 'mock-user-id', email: 'mock@example.com' }),
    }),
    firestore: () => ({
      collection: () => ({
        doc: () => ({
          set: async () => {},
          get: async () => ({ exists: false }),
        }),
      }),
    }),
  };

  const mockDb = {
    collection: () => ({
      doc: () => ({
        set: async () => {},
        get: async () => ({ exists: false }),
      }),
    }),
  };

  const mockAuth = {
    createUser: async () => ({ uid: 'mock-user-id' }),
    getUser: async () => ({ uid: 'mock-user-id', email: 'mock@example.com' }),
  };

  module.exports = { admin: mockAdmin, db: mockDb, auth: mockAuth };
}