import { create } from "zustand";
import { persist } from "zustand/middleware";
import { request } from "@/lib/base-client";
import { POST_CONFIG } from "@/lib/rest-utils";

type AuthState = {
    isAuth: boolean;
    authOpen: boolean;
    openAuth: () => void;
    closeAuth: () => void;
    setIsAuth: (value: boolean) => void;
    logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuth: false,
            authOpen: false,
            openAuth: () => set({ authOpen: true }),
            closeAuth: () => set({ authOpen: false }),
            setIsAuth: (value) => set({ isAuth: value }),
            logout: async () => {
                try {
                    // Best-effort: clear the httpOnly cookies on the server.
                    await request("api/v1/logout", {
                        ...POST_CONFIG,
                        credentials: "include",
                    });
                } catch {
                    // Even if the server call fails, clear local auth state.
                } finally {
                    set({ isAuth: false });
                }
            },
        }),
        {
            name: "bookex-auth",
            // Only persist the authenticated flag, not the dialog open state.
            partialize: (state) => ({ isAuth: state.isAuth }),
        }
    )
);
