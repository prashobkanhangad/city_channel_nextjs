export type { Post, CreatePostInput, UpdatePostInput } from "./post";
export type { Category, CreateCategoryInput, UpdateCategoryInput } from "./category";
export type {
  Advertisement,
  CreateAdvertisementInput,
  UpdateAdvertisementInput,
} from "./advertisement";
export type { Video, CreateVideoInput, UpdateVideoInput } from "./video";

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: string;
  details?: Record<string, string[]>;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
