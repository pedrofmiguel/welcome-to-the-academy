"use server";

import { revalidatePath } from "next/cache";
import { isSignedIn, passwordIsCorrect, signIn, signOut } from "@/lib/auth";
import { supabaseAdmin, isConfigured } from "@/lib/supabase";

export interface SignInState {
  error?: string;
}

export async function signInAction(
  _prev: SignInState,
  formData: FormData
): Promise<SignInState> {
  const submitted = String(formData.get("password") ?? "");

  if (!process.env.ADMIN_PASSWORD) {
    return { error: "No proctor's word is set on the server. See .env.local." };
  }
  if (!passwordIsCorrect(submitted)) {
    return { error: "The lamp does not recognise that word." };
  }

  await signIn();
  revalidatePath("/admin");
  return {};
}

export async function signOutAction(): Promise<void> {
  await signOut();
  revalidatePath("/admin");
}

export async function deleteCharacter(id: string): Promise<{ error?: string }> {
  if (!(await isSignedIn())) return { error: "Not signed in." };
  if (!isConfigured()) return { error: "Supabase is not configured." };

  const { error } = await supabaseAdmin().from("characters").delete().eq("id", id);
  if (error) {
    console.error("[admin] delete failed:", error.message);
    return { error: "Could not remove that record." };
  }

  revalidatePath("/admin");
  return {};
}

export async function clearRoster(): Promise<{ error?: string }> {
  if (!(await isSignedIn())) return { error: "Not signed in." };
  if (!isConfigured()) return { error: "Supabase is not configured." };

  // Supabase requires a filter on delete; this one matches every row.
  const { error } = await supabaseAdmin().from("characters").delete().neq("id", "");
  if (error) {
    console.error("[admin] clear failed:", error.message);
    return { error: "Could not clear the roster." };
  }

  revalidatePath("/admin");
  return {};
}
