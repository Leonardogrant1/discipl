import { UserDataSettings } from "@/types/user-data";
import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";


const defaultUserSettings: UserDataSettings = {
    name: '',
    gender: null,
    improvements: [],
    notificationsEnabled: true,
    notificationsPerDay: 5,
    notificationStartHour: 10,
    notificationEndHour: 20,
    randomizeNotificationTimes: true,
    selectedCategories: ["discipline", "mindset", "strength"],
    selectedSport: null,
}

const defaultStreakData: StreakData = {
    currentStreak: 0,
    longestStreak: 0,
    lastOpenedDate: null,
    activeDays: [],
}

type StreakData = {
    currentStreak: number
    longestStreak: number
    lastOpenedDate: string | null
    activeDays: string[]  // ["2026-03-17", "2026-03-18", "2026-03-19"]
}

const initialState = {
    hasCompletedOnboarding: false,
    likedQuoteIds: [],
    settings: defaultUserSettings,
    streak: defaultStreakData,
};


export type UserDataState = {
    hasCompletedOnboarding: boolean
    likedQuoteIds: string[]

    settings: UserDataSettings
    streak: StreakData

    checkAndUpdateStreak: () => void
    completeOnboarding: () => void
    toggleLikedQuote: (id: string) => void
    updateSettings: (settings: Partial<UserDataSettings>) => void
}


const storage = createMMKV()

const zustandStorage: StateStorage = {
    getItem: (name: string) => {
        const value = storage.getString(name)
        return value ?? null
    },
    setItem: (name: string, value: string) => {
        storage.set(name, value)
    },
    removeItem: (name: string) => {
        storage.remove(name)
    },
}


export const useUserDataStore = create<UserDataState>()(
    persist(
        (set) => ({
            ...initialState,
            completeOnboarding: () => set({ hasCompletedOnboarding: true }),
            toggleLikedQuote: (id: string) => set((state) => ({
                likedQuoteIds: state.likedQuoteIds.includes(id)
                    ? state.likedQuoteIds.filter((likedId) => likedId !== id)
                    : [...state.likedQuoteIds, id],
            })),
            updateSettings: (settings: Partial<UserDataSettings>) => set((state) => ({
                settings: { ...state.settings, ...settings },
            })),
            checkAndUpdateStreak: () => set((state) => {
                const today = new Date().toISOString().split('T')[0]
                const last = state.streak.lastOpenedDate

                if (last === today) return state

                const activeDays = [...state.streak.activeDays, today]
                    .filter((date) => {
                        const diff = Math.round(
                            (new Date(today).getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
                        )
                        return diff < 7
                    })

                if (!last) {
                    return {
                        streak: {
                            currentStreak: 1,
                            longestStreak: 1,
                            lastOpenedDate: today,
                            activeDays,
                        }
                    }
                }

                const diffDays = Math.round(
                    (new Date(today).getTime() - new Date(last).getTime()) / (1000 * 60 * 60 * 24)
                )

                if (diffDays === 1) {
                    const newStreak = state.streak.currentStreak + 1
                    return {
                        streak: {
                            currentStreak: newStreak,
                            longestStreak: Math.max(newStreak, state.streak.longestStreak),
                            lastOpenedDate: today,
                            activeDays,
                        }
                    }
                }

                return {
                    streak: {
                        currentStreak: 1,
                        longestStreak: state.streak.longestStreak,
                        lastOpenedDate: today,
                        activeDays,
                    }
                }
            }),

        }),
        {
            name: "user-data-store",
            storage: createJSONStorage(() => zustandStorage),
        }
    )
);
