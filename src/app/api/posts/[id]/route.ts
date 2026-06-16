import { errorResponse, successResponse } from "@/lib/api/response";
import { requireApiAdmin } from "@/lib/auth/api";
import {
  deletePost,
  getPostById,
  updatePost,
} from "@/lib/db/posts";
import { updatePostSchema } from "@/lib/validations/post";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const post = await getPostById(id);

    if (!post) {
      return errorResponse("Post not found", 404);
    }

    return successResponse(post);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to fetch post",
      500,
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireApiAdmin();
  if (auth.error) {
    return auth.error;
  }

  const { id } = await context.params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const parsed = updatePostSchema.safeParse(body);
  if (!parsed.success) {
    const details = parsed.error.flatten().fieldErrors;
    return errorResponse("Validation failed", 422, details);
  }

  try {
    const post = await updatePost(id, parsed.data);

    if (!post) {
      return errorResponse("Post not found", 404);
    }

    return successResponse(post);
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to update post",
      500,
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireApiAdmin();
  if (auth.error) {
    return auth.error;
  }

  const { id } = await context.params;

  try {
    const deleted = await deletePost(id);

    if (!deleted) {
      return errorResponse("Post not found", 404);
    }

    return successResponse({ id });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Failed to delete post",
      500,
    );
  }
}
