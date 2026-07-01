export function isPushConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

export function getFirebaseProjectId(): string {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error(
      "Missing FIREBASE_PROJECT_ID. Add Firebase service account env vars to .env.local.",
    );
  }
  return projectId;
}

export function getFirebaseClientEmail(): string {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  if (!clientEmail) {
    throw new Error(
      "Missing FIREBASE_CLIENT_EMAIL. Add Firebase service account env vars to .env.local.",
    );
  }
  return clientEmail;
}

export function getFirebasePrivateKey(): string {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "Missing FIREBASE_PRIVATE_KEY. Add Firebase service account env vars to .env.local.",
    );
  }
  return privateKey.replace(/\\n/g, "\n");
}
