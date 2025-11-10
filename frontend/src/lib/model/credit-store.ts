import { create } from "zustand"

type CreditState = {
    credit : number
}

export const useCreditState = create<CreditState>((set) => ({
    credit : 0
}))