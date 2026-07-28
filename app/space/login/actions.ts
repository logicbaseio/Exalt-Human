"use server";

import { redirect } from "next/navigation";
import { checkTeamCredentials, createSpaceSession } from "@/lib/space-auth";

export interface SpaceLoginState {
  error?: string;
}

export async function loginSpace(
  _prev: SpaceLoginState,
  formData: FormData,
): Promise<SpaceLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const code = String(formData.get("code") ?? "");

  if (!email || !code) {
    return { error: "Enter your email and the team access code." };
  }
  if (!checkTeamCredentials(email, code)) {
    return { error: "That email isn't on the team, or the code is wrong." };
  }

  await createSpaceSession(email);
  redirect("/space");
}
