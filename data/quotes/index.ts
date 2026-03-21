import confidence from './confidence.json'
import discipline from './discipline.json'
import mindset from './mindset.json'
import resilience from './resilience.json'
import strength from './strength.json'

export const quotesByCategory = {
    discipline,
    mindset,
    strength,
    confidence,
    resilience,
} as const

export type Category = keyof typeof quotesByCategory

export const ALL_CATEGORIES: Category[] = [
    'discipline',
    'mindset',
    'strength',
    'confidence',
    'resilience',
]

export type Quote = {
    id: string
    text: string
    author?: string
}

export type FeedQuote = Quote & { category: Category }

export function buildFeed(categories: Category[]): FeedQuote[] {
    const quotes: FeedQuote[] = categories.flatMap((cat) => {
        console.log(quotesByCategory[cat] ?? "None", cat)
        return quotesByCategory[cat].map((q) => ({ ...q, category: cat }))
    }
    )
    // Fisher-Yates shuffle
    for (let i = quotes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quotes[i], quotes[j]] = [quotes[j], quotes[i]]
    }
    return quotes
}
