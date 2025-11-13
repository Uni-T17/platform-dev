import { create } from "zustand"


type CreditState = {
    id : number
    setId : (value : number) => void
}

export const useUserIdStore = create<CreditState>((set) => ({
    id : 0,
    setId : (value) => set({id : value})
}))