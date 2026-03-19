import discipline from './discipline.json'
import mindset from './mindset.json'
import strength from './strength.json'

export const quotesByCategory = {
    discipline,
    mindset,
    strength,
} as const

export type Category = keyof typeof quotesByCategory

export const ALL_CATEGORIES: Category[] = ['discipline', 'mindset', 'strength']

export type Quote = {
    id: string
    text: string
    author?: string
}

export type FeedQuote = Quote & { category: Category }

export function buildFeed(categories: Category[]): FeedQuote[] {
    const quotes: FeedQuote[] = categories.flatMap((cat) =>
        quotesByCategory[cat].map((q) => ({ ...q, category: cat }))
    )
    // Fisher-Yates shuffle
    for (let i = quotes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quotes[i], quotes[j]] = [quotes[j], quotes[i]]
    }
    return quotes
}