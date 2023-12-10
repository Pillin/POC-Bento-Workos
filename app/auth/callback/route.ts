import AuthService, { REDIRECT_CALLBACK } from "@/services/AuthService";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code") || "";

  const response = await AuthService.getAuthentificationWithCode({ code });

  redirect(`${REDIRECT_CALLBACK}?token=${response.token}`);
}
