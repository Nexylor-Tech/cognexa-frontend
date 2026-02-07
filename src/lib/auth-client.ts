import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { env } from './index'
export const authClient = createAuthClient({
  baseURL: env.API_URL, // Backend URL
  plugins: [
    organizationClient()
  ]
});
