import { APP_PAGES } from '@/constants/link.const'
import type {
  ILoginReqBodyDto,
  IRegisterReqBodyDto,
  IResetPasswordReqBodyDto,
  IVerifyOtpDto,
} from '@/features/auth/services'
import { authRequest } from '@/features/auth/services'
import { protectedRequest } from '@/features/user/services/protected'
import type { IUser } from '@/types/api.types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAppStore } from './app.store'
import { useSocketStore } from './socket.store'

interface IAuthState {
  accessToken: string | null
  user: IUser | null
  isCanSignUp: boolean
  isCanResetPassword: boolean
}

interface IAuthActions {
  setAccessToken: (accessToken: string | null) => void
  setUser: (user: IUser | null) => void
  clearAuthStore: () => void
  signOut: () => Promise<void>
  signIn: (body: ILoginReqBodyDto) => Promise<void>
  signInWithOAuth2: (accessToken: string) => Promise<void>
  signUp: (body: IRegisterReqBodyDto) => Promise<void>
  resetPassword: (body: IResetPasswordReqBodyDto) => Promise<void>
  verifyEmail: (body: IVerifyOtpDto) => Promise<void>
  verifyResetPasswordEmail: (body: IVerifyOtpDto) => Promise<void>
  signOutAllDevices: () => Promise<void>
}

const LOCAL_STORAGE_KEY = 'auth-storage'

export const useAuthStore = create<IAuthState & IAuthActions>()(
  persist(
    (set, get, store) => ({
      accessToken: null,
      user: null,
      isCanSignUp: false,
      isCanResetPassword: false,
      setAccessToken: (accessToken: string | null) => {
        set({ accessToken })
      },
      setUser: (user: IUser | null) => {
        set({ user })
      },
      clearAuthStore: () => {
        set(store.getInitialState())
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        useSocketStore.getState().disconnect()
      },
      signIn: async (body: ILoginReqBodyDto) => {
        get().clearAuthStore()
        try {
          const { accessToken } = await authRequest.signin(body, {
            headers: {
              'x-skip-auth-refresh': 'true',
            },
          })
          set({ accessToken })
          const userRes = await protectedRequest.getProfile()
          set({ user: userRes })
        } catch (error) {
          get().clearAuthStore()
          throw error
        }
      },
      signInWithOAuth2: async (accessToken: string) => {
        useAppStore.getState().setLoading(true)
        get().clearAuthStore()
        try {
          set({ accessToken })
          const userRes = await protectedRequest.getProfile()
          set({ user: userRes })
        } catch (error) {
          get().clearAuthStore()
          throw error
        } finally {
          useAppStore.getState().setLoading(false)
        }
      },
      signUp: async (body: IRegisterReqBodyDto) => {
        try {
          get().clearAuthStore()
          const { accessToken } = await authRequest.signup(body)
          set({ accessToken })
          const userRes = await protectedRequest.getProfile()
          set({ user: userRes })
          set({ isCanSignUp: false })
        } catch (error) {
          get().clearAuthStore()
          throw error
        }
      },
      resetPassword: async (body: IResetPasswordReqBodyDto) => {
        try {
          get().clearAuthStore()
          const { accessToken } = await authRequest.resetPassword(body)
          set({ accessToken })
          const userRes = await protectedRequest.getProfile()
          set({ user: userRes })
          set({ isCanResetPassword: false })
        } catch (error) {
          get().clearAuthStore()
          throw error
        }
      },
      signOut: async () => {
        const setLoading = useAppStore.getState().setLoading
        setLoading(true)
        try {
          if (get().accessToken) {
            await authRequest.logout()
          }
        } finally {
          setLoading(false)
          get().clearAuthStore()
          window.location.href = APP_PAGES.SIGNIN
        }
      },
      signOutAllDevices: async () => {
        const setLoading = useAppStore.getState().setLoading
        setLoading(true)
        try {
          await authRequest.logoutAllDevices()
        } finally {
          setLoading(false)
          get().clearAuthStore()
          window.location.href = APP_PAGES.SIGNIN
        }
      },
      verifyEmail: async (body: IVerifyOtpDto) => {
        try {
          await authRequest.verifyEmail(body)
          set({ isCanSignUp: true })
        } catch (error) {
          set({ isCanSignUp: false })
          throw error
        }
      },
      verifyResetPasswordEmail: async (body: IVerifyOtpDto) => {
        try {
          await authRequest.verifyResetPasswordEmail(body)
          set({ isCanResetPassword: true })
        } catch (error) {
          set({ isCanResetPassword: false })
          throw error
        }
      },
    }),
    {
      name: LOCAL_STORAGE_KEY,
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isCanSignUp: state.isCanSignUp,
        isCanResetPassword: state.isCanResetPassword,
      }),
    },
  ),
)
