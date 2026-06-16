import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const logoPath = join(root, "public/logo.png");

const letterboxBackground = { r: 18, g: 42, b: 92, alpha: 1 };

async function makeSquareIcon(size) {
  return sharp(logoPath)
    .resize(size, size, {
      fit: "contain",
      background: letterboxBackground,
    })
    .png()
    .toBuffer();
}

async function main() {
  const icon32 = await makeSquareIcon(32);
  const icon180 = await makeSquareIcon(180);
  const icon16 = await makeSquareIcon(16);
  const icon48 = await makeSquareIcon(48);

  await writeFile(join(root, "src/app/icon.png"), icon32);
  await writeFile(join(root, "src/app/apple-icon.png"), icon180);

  const ico = await toIco([icon16, icon32, icon48]);
  await writeFile(join(root, "public/favicon.ico"), ico);

  console.log("Generated src/app/icon.png, src/app/apple-icon.png, public/favicon.ico");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
