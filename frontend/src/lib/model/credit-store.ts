import { create } from "zustand"

type CreditState = {
    credit : number
    setCredit : (value : number) => void
}

export const useCreditState = create<CreditState>((set) => ({
    credit : 0,
    setCredit : (value) => set({credit : value})
}))