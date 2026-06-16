export type Video = {
  id: string;
  title: string;
  youtubeVideoId: string | null;
  thumbnailUrl: string | null;
  isActive: boolean;
  showOnHomepage: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateVideoInput = {
  title: string;
  youtubeVideoId?: string | null;
  thumbnailUrl?: string | null;
  showOnHomepage?: boolean;
};

export type UpdateVideoInput = {
  title?: string;
  youtubeVideoId?: string | null;
  thumbnailUrl?: string | null;
  isActive?: boolean;
  showOnHomepage?: boolean;
  sortOrder?: number;
};
