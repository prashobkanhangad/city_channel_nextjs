import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

import {
  getFirebaseClientEmail,
  getFirebasePrivateKey,
  getFirebaseProjectId,
} from "@/lib/push/env";

let firebaseApp: App | undefined;

function getFirebaseApp(): App {
  if (firebaseApp) {
    return firebaseApp;
  }

  const existing = getApps();
  if (existing.length > 0) {
    firebaseApp = existing[0];
    return firebaseApp;
  }

  firebaseApp = initializeApp({
    credential: cert({
      projectId: getFirebaseProjectId(),
      clientEmail: getFirebaseClientEmail(),
      privateKey: getFirebasePrivateKey(),
    }),
  });

  return firebaseApp;
}

export type PushPayload = {
  tokens: string[];
  title: string;
  body: string;
  data: Record<string, string>;
};

export async function sendPushToTokens(payload: PushPayload): Promise<void> {
  if (payload.tokens.length === 0) {
    return;
  }

  const messaging = getMessaging(getFirebaseApp());
  const response = await messaging.sendEachForMulticast({
    tokens: payload.tokens,
    notification: {
      title: payload.title,
      body: payload.body,
    },
    data: payload.data,
    android: {
      priority: "high",
      notification: {
        channelId: "city_channel_news",
      },
    },
  });

  if (response.failureCount > 0) {
    const errors = response.responses
      .map((item, index) =>
        item.success ? null : `${payload.tokens[index]}: ${item.error?.message}`,
      )
      .filter(Boolean);

    console.warn("[push] Some notifications failed:", errors);
  }
}
