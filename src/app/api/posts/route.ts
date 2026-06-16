import { errorResponse, successResponse } from "@/lib/api/response";
import { requireApiAdmin } from "@/lib/auth/api";
import {
  createPost,
  getAllPosts,
} from "@/lib/db/posts";
import { createPostSchema } from "@/lib/validations/post";

export async function GET() {
  try {
    const posts = await getAllPosts();
    return successResponse(posts);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to fetch posts",
      500,
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (auth.error) {
    return auth.error;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) {
    const details = parsed.error.flatten().fieldErrors;
    return errorResponse("Validation failed", 422, details);
  }

  try {
    const post = await createPost(parsed.data);
    return successResponse(post, 201);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to create post",
      500,
    );
  }
}
