import type { ReactNode } from 'react'
import { create } from 'zustand'

interface IAppState {
  isLoading: boolean
  appTitle: ReactNode
}

interface IAppActions {
  setLoading: (isLoading: boolean) => void
  setAppTitle: (appTitle: ReactNode) => void
}

export const useAppStore = create<IAppState & IAppActions>((set) => ({
  isLoading: false,
  appTitle: null,
  setLoading: (isLoading) => set({ isLoading }),
  setAppTitle: (appTitle) => set({ appTitle }),
}))
