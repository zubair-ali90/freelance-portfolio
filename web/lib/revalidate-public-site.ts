import { revalidatePath } from "next/cache";

/** Bust cached pages after admin saves site config or project overrides. */
export function revalidatePublicSite() {
  revalidatePath("/", "layout");
  revalidatePath("/work");
  revalidatePath("/viewer");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/contact");
  revalidatePath("/reviews");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/configuration");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/reviews");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/about");
  revalidatePath("/admin/services");
  revalidatePath("/admin/contact");
  revalidatePath("/admin/media");
}
