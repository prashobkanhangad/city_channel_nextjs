export const ADMIN_EMAIL = "admin@citychannel.in";

export function isAdminEmail(email: string | null | undefined): boolean {
  return email?.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
