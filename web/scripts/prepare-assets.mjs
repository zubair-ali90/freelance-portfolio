import { cp } from "node:fs/promises";

await cp(new URL("../../Assets/", import.meta.url), new URL("../public/assets/", import.meta.url), {
  recursive: true,
  force: true,
});

console.log("Portfolio media copied to public/assets.");
