import { authRequest } from '@/services/auth'
import type {
  ILoginReqBodyDto,
  IRegisterReqBodyDto,
  IResetPasswordReqBodyDto,
  IVerifyOtpDto,
} from '@/services/auth/auth.req.dto'
import { protectedRequest } from '@/services/protected'
import type { IUserResDto } from '@/services/user/user.res.dto'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  accessToken: string | null
  user: IUserResDto | null
  isCanSignUp: boolean
  isCanResetPassword: boolean
}

interface AuthActions {
  setIsAuthenticated: (isAuthenticated: boolean) => void
  setAccessToken: (accessToken: string | null) => void
  setUser: (user: IUserResDto | null) => void
  clearAuthStore: () => void
  signOut: () => Promise<void>
  signIn: (body: ILoginReqBodyDto) => Promise<void>
  signUp: (body: IRegisterReqBodyDto) => Promise<void>
  resetPassword: (body: IResetPasswordReqBodyDto) => Promise<void>
  verifyEmail: (body: IVerifyOtpDto) => Promise<void>
  verifyResetPasswordEmail: (body: IVerifyOtpDto) => Promise<void>
}

const LOCAL_STORAGE_KEY = 'auth-storage'

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get, store) => ({
      isAuthenticated: false,
      accessToken: null,
      user: null,
      isCanSignUp: false,
      isCanResetPassword: false,
      setIsAuthenticated: (isAuthenticated: boolean) => {
        set({ isAuthenticated })
      },
      setAccessToken: (accessToken: string | null) => {
        set({ accessToken })
      },
      setUser: (user: IUserResDto | null) => {
        set({ user })
      },
      clearAuthStore: () => {
        set(store.getInitialState())
        localStorage.removeItem(LOCAL_STORAGE_KEY)
      },
      signIn: async (body: ILoginReqBodyDto) => {
        get().clearAuthStore()
        set({ isAuthenticated: true })
        try {
          const { accessToken } = await authRequest.signin(body)
          set({ accessToken })
          const userRes = await protectedRequest.getProfileWithAuth(accessToken)
          set({ user: userRes })
        } catch (error) {
          get().clearAuthStore()
          throw error
        }
      },
      signUp: async (body: IRegisterReqBodyDto) => {
        try {
          get().clearAuthStore()
          set({ isAuthenticated: true })
          const { accessToken } = await authRequest.signup(body)
          set({ accessToken })
          const userRes = await protectedRequest.getProfileWithAuth(accessToken)
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
          set({ isAuthenticated: true })
          const { accessToken } = await authRequest.resetPassword(body)
          set({ accessToken })
          const userRes = await protectedRequest.getProfileWithAuth(accessToken)
          set({ user: userRes })
          set({ isCanResetPassword: false })
        } catch (error) {
          get().clearAuthStore()
          throw error
        }
      },
      signOut: async () => {
        await authRequest.logout()
        get().clearAuthStore()
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
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        isCanSignUp: state.isCanSignUp,
        isCanResetPassword: state.isCanResetPassword,
      }),
    },
  ),
)
