export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say'

export type UserDataSettings = {
    name: string
    gender: Gender | null
    improvements: string[]
    notificationsEnabled: boolean
    notificationsPerDay: number
    notificationStartHour: number
    notificationEndHour: number
    randomizeNotificationTimes: boolean
    selectedCategories: string[]
}