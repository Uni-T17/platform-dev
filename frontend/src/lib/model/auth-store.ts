import {create} from "zustand"

type AuthState = {
    isAuth : boolean
    authOpen : boolean
    openAuth : () => void
    closeAuth : () => void
    setIsAuth : (value : boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuth : false,
    authOpen : false,
    openAuth : () => set({authOpen : true}),
    closeAuth : () => set({authOpen : false}),
    setIsAuth : (value) => set({ isAuth : value})
}))

