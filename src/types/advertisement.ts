import type { AdPlacement } from "@/lib/constants/adPlacements";

export type Advertisement = {
  id: string;
  title: string;
  placement: AdPlacement;
  imageUrl: string;
  linkUrl: string | null;
  altText: string;
  aspectClass: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateAdvertisementInput = {
  title: string;
  placement: AdPlacement;
  imageUrl: string;
  linkUrl?: string;
  altText?: string;
  aspectClass?: string;
};

export type UpdateAdvertisementInput = Partial<CreateAdvertisementInput> & {
  isActive?: boolean;
  sortOrder?: number;
};
