import { getDeviceTokens } from "@/lib/push/deviceTokens";
import { isPushConfigured } from "@/lib/push/env";
import { sendPushToTokens } from "@/lib/push/fcm";
import type { Post } from "@/types";

function buildNotificationBody(post: Post): string {
  const plain = post.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!plain) {
    return post.city ? `${post.city} • City Channel` : "City Channel";
  }
  return plain.length > 120 ? `${plain.slice(0, 117)}...` : plain;
}

export async function notifyPublishedPost(post: Post): Promise<void> {
  if (!isPushConfigured()) {
    return;
  }

  try {
    const tokens = await getDeviceTokens("android");
    if (tokens.length === 0) {
      return;
    }

    await sendPushToTokens({
      tokens,
      title: post.title,
      body: buildNotificationBody(post),
      data: {
        route: `/news/${post.id}`,
        post_id: post.id,
      },
    });
  } catch (error) {
    console.error("[push] Failed to send post notification:", error);
  }
}
