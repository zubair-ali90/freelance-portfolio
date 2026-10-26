import { revalidatePath } from "next/cache";

/** Bust cached pages after admin saves site config or project overrides. */
export function revalidatePublicSite() {
  revalidatePath("/", "layout");
  revalidatePath("/work");
  revalidatePath("/viewer");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/configuration");
}
