import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(filename) {
  const filePath = resolve(process.cwd(), filename);

  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const email = "admin@citychannel.in";
const password = "Admin@123";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.",
  );
  process.exit(1);
}

const authHeaders = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  "Content-Type": "application/json",
};

async function authRequest(path, options = {}) {
  const response = await fetch(`${url}/auth/v1${path}`, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      body?.msg ||
      body?.message ||
      body?.error_description ||
      `Auth request failed (${response.status})`;
    throw new Error(message);
  }

  return body;
}

async function findUserByEmail(targetEmail) {
  let page = 1;

  while (true) {
    const body = await authRequest(`/admin/users?page=${page}&per_page=200`);
    const users = body.users ?? [];

    const user = users.find(
      (item) => item.email?.toLowerCase() === targetEmail.toLowerCase(),
    );

    if (user) {
      return user;
    }

    if (users.length < 200) {
      return null;
    }

    page += 1;
  }
}

async function main() {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    await authRequest(`/admin/users/${existingUser.id}`, {
      method: "PUT",
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: "admin" },
      }),
    });

    console.log(`Updated admin user: ${email}`);
    return;
  }

  await authRequest("/admin/users", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "admin" },
    }),
  });

  console.log(`Created admin user: ${email}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
