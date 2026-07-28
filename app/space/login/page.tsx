import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSpaceSession } from "@/lib/space-auth";
import { SpaceLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Exalt Space — Team access",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SpaceLoginPage() {
  if (await getSpaceSession()) redirect("/space");

  return (
    <div className="space-login">
      <style>{CSS}</style>
      <div className="space-login-card">
        <div className="space-login-brand">
          <img src="/favicon.png" alt="Exalt Human" width="40" height="40" />
          <div>
            <h1>Exalt Space</h1>
            <p>Editorial mission control · team access</p>
          </div>
        </div>
        <SpaceLoginForm />
        <p className="space-login-note">
          Access is limited to team members on the allowlist. Ask an admin to add
          your email.
        </p>
      </div>
    </div>
  );
}

const CSS = `
  .space-login {
    min-height: 100dvh; display: grid; place-items: center; padding: 24px;
    background:
      radial-gradient(120% 80% at 50% -10%, rgba(255,90,44,.14), transparent 55%),
      #0a0a0c;
    color: #f3f4f6;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  .space-login-card {
    width: 100%; max-width: 380px; background: #131418;
    border: 1px solid #24262d; border-top: 2px solid #ff5a2c;
    padding: 28px 26px; box-shadow: 0 24px 60px -30px rgba(0,0,0,.8);
  }
  .space-login-brand { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }
  .space-login-brand img { width: 40px; height: 40px; border-radius: 9px; background: #fff; padding: 3px; }
  .space-login-brand h1 { margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -.01em; }
  .space-login-brand p { margin: 3px 0 0; font-size: 11.5px; color: #9a9ea8; }
  .space-login-form { display: flex; flex-direction: column; gap: 14px; }
  .space-login-form label { display: flex; flex-direction: column; gap: 6px; }
  .space-login-form label span {
    font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 10.5px;
    letter-spacing: .16em; text-transform: uppercase; color: #636872;
  }
  .space-login-form input {
    background: #0e0f12; border: 1px solid #24262d; color: #f3f4f6;
    padding: 11px 12px; font-size: 14px; border-radius: 8px; font-family: inherit;
  }
  .space-login-form input:focus { outline: 2px solid #ff5a2c; outline-offset: 1px; border-color: #ff5a2c; }
  .space-login-form input::placeholder { color: #4d525b; }
  .space-login-error {
    margin: 0; font-size: 13px; color: #ff9a80; background: rgba(255,90,44,.1);
    border: 1px solid rgba(255,90,44,.3); padding: 9px 11px; border-radius: 8px;
  }
  .space-login-form button {
    margin-top: 4px; background: #ff5a2c; color: #140a06; border: 0;
    padding: 12px; font-size: 14px; font-weight: 700; border-radius: 8px; cursor: pointer;
  }
  .space-login-form button:hover { filter: brightness(1.06); }
  .space-login-form button:disabled { opacity: .6; cursor: default; }
  .space-login-note { margin: 18px 0 0; font-size: 11.5px; line-height: 1.5; color: #636872; }
`;
