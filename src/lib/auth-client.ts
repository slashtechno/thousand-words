import { usernameClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    // baseURL: "http://localhost:3000"
        plugins: [ 
        usernameClient() 
    ] 

})

// Export helpers from the configured client instance so plugin types are applied
export const { signIn, signUp, useSession, updateUser, deleteUser } = authClient
export type Session = typeof authClient.$Infer.Session
