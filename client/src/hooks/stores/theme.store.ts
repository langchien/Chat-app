import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDarkMode: boolean
}
interface ThemeActions {
  toggleDarkMode: () => void
  setDarkMode: (isDarkMode: boolean) => void
}

export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      toggleDarkMode: () => {
        const currentMode = get().isDarkMode
        set({ isDarkMode: !currentMode })
        if (!currentMode) document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
      },
      setDarkMode: (isDarkMode: boolean) => {
        set({ isDarkMode })
        if (isDarkMode) document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
      },
    }),
    {
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
      name: 'theme-storage',
    },
  ),
)
