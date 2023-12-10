import { WorkOS } from "@workos-inc/node";
import { jwtVerify, SignJWT } from "jose";

const DOMAIN = `https://wt43pj-3000.csb.app`;
const PROVIDER = "authkit";

export const REDIRECT_AUTH_URI = `${DOMAIN}/auth/callback`;
export const REDIRECT_CALLBACK = `${DOMAIN}/auth`;

const AuthorizationService = {
  getURL: async () => {
    const workos = new WorkOS(process.env.WORKOS_API_KEY);
    const WORKOS_CLIENT_ID = process.env.WORKOS_CLIENT_ID || "";
    const authKitUrl = await workos.userManagement.getAuthorizationUrl({
      clientId: WORKOS_CLIENT_ID,
      provider: PROVIDER,
      redirectUri: REDIRECT_AUTH_URI,
    });

    return authKitUrl;
  },
  getAuthentificationWithCode: async ({ code }: { code: string }) => {
    const workos = new WorkOS(process.env.WORKOS_API_KEY);
    const WORKOS_CLIENT_ID = process.env.WORKOS_CLIENT_ID || "";
    let response;

    try {
      response = await workos.userManagement.authenticateWithCode({
        clientId: WORKOS_CLIENT_ID,
        code,
      });
      const secret = AuthorizationService.getSecretJWTToken();
      const token = await new SignJWT({
        // Here you might lookup and retrieve user details from your database
        user: response.user,
      })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);
      response.token = token;
    } catch (error) {
      response = error;
    }

    return response;
  },
  getSecretJWTToken: () => {
    const secret = process.env.JWT_SECRET_KEY;

    if (!secret) {
      throw new Error("JWT_SECRET_KEY is not set");
    }

    const secretToken = new Uint8Array(Buffer.from(secret, "base64"));

    return secretToken;
  },
  verifyJwtToken: async (token: string) => {
    const secretToken = AuthorizationService.getSecretJWTToken();

    try {
      const { payload } = await jwtVerify(token, secretToken);
      return payload;
    } catch (error) {
      return null;
    }
  },
  decodeToken: (token: string) => {
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    return JSON.parse(jsonPayload);
  },
  getToken: async (token: string) => {
    const verifiedToken = token
      ? await AuthorizationService.verifyJwtToken(token)
      : null;
    return verifiedToken;
  },
};

export default AuthorizationService;
