import { create } from 'zustand'

interface IAppState {
  isLoading: boolean
}

interface IAppActions {
  setLoading: (isLoading: boolean) => void
}

export const useAppStore = create<IAppState & IAppActions>((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}))
