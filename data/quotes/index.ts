import confidence from './confidence.json'
import discipline from './discipline.json'
import mentalStrength from './mental-strength.json'
import resilience from './resilience.json'
import winnerMindset from './winner-mindset.json'

export const quotesByCategory = {
    discipline,
    'winner-mindset': winnerMindset,
    'mental-strength': mentalStrength,
    confidence,
    resilience,
} as const

export type Category = keyof typeof quotesByCategory

export const ALL_CATEGORIES: Category[] = [
    'discipline',
    'winner-mindset',
    'mental-strength',
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
