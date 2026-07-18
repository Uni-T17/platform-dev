import { create } from "zustand"
import { persist } from "zustand/middleware"


type UserIdState = {
    id : number
    setId : (value : number) => void
}

export const useUserIdStore = create<UserIdState>()(
    persist(
        (set) => ({
            id: 0,
            setId: (value) => set({ id: value }),
        }),
        { name: "bookex-user-id" }
    )
)
