import { create } from 'zustand'

interface AppState {
  isLoading: boolean
}

interface AppActions {
  setLoading: (isLoading: boolean) => void
}

export const useAppStore = create<AppState & AppActions>((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}))
