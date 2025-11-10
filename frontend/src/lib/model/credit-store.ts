import { create } from "zustand"

type CreditState = {
    credit : number
    setCredit : (value : number) => void
    totalEarn : number,
    setTotalEarn : (value : number) => void
    totalSpent : number,
    setTotalSpent : (value : number) => void
    exchanges : number,
    setExchanges : (value : number) => void
    rating : number,
    setRating : (value : number) => void
}

export const useCreditState = create<CreditState>((set) => ({
    credit : 0,
    setCredit : (value) => set({credit : value}),
    totalEarn : 0,
    setTotalEarn : (value) => set({totalEarn : value}),
    totalSpent : 0,
    setTotalSpent : (value) => set({totalSpent : value}),
    exchanges : 0,
    setExchanges : (value) => set({exchanges : value}),
    rating : 0,
    setRating : (value) => set({rating : value})
}))