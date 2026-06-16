export type Category = {
  id: string;
  slug: string;
  title: string;
  titleMl: string;
  navLabel: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryInput = {
  title: string;
  titleMl: string;
  slug: string;
  navLabel: string;
  description: string;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput> & {
  isActive?: boolean;
  sortOrder?: number;
};
