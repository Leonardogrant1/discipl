import WidgetKit
import SwiftUI

struct QuoteData: Codable {
    let id: String
    let text: String
    let author: String?
    let category: String
}

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> QuoteEntry {
        QuoteEntry(date: Date(), quote: "Your discipline today determines your success tomorrow.", image: "athletics/0")
    }

    func getSnapshot(in context: Context, completion: @escaping (QuoteEntry) -> Void) {
        completion(QuoteEntry(date: Date(), quote: "Your discipline today determines your success tomorrow.", image: "athletics/0"))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<QuoteEntry>) -> Void) {
        var entries: [QuoteEntry] = []

        let sharedDefaults = UserDefaults(suiteName: "group.studio.northbyte.discipl")
        let quotesJsonString = sharedDefaults?.string(forKey: "quotes") ?? "[]"
        let sportsJsonString = sharedDefaults?.string(forKey: "sportCategories") ?? "[\"athletics\"]"
        let startHour = sharedDefaults?.object(forKey: "startHour") as? Int ?? 8
        let endHour = sharedDefaults?.object(forKey: "endHour") as? Int ?? 20
        let notificationsPerDay = sharedDefaults?.object(forKey: "notificationsPerDay") as? Int ?? 5
        print("quotesJsonString: \(quotesJsonString)")
        print("sportsJsonString: \(sportsJsonString)")
        print("startHour: \(startHour)")
        print("endHour: \(endHour)")
        print("notificationsPerDay: \(notificationsPerDay)")

        var quotes: [QuoteData] = []
        if let data = quotesJsonString.data(using: .utf8) {
            quotes = (try? JSONDecoder().decode([QuoteData].self, from: data)) ?? []
        }

        var sportCategories: [String] = ["athletics"]
        if let sportsData = sportsJsonString.data(using: .utf8),
           let decodedSports = try? JSONDecoder().decode([String].self, from: sportsData),
           !decodedSports.isEmpty {
            sportCategories = decodedSports
        }

        let currentDate = Date()

        if quotes.isEmpty {
            for hourOffset in 0 ..< 5 {
                let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
                let entry = QuoteEntry(date: entryDate, quote: "Your discipline today determines your success tomorrow.", image: "athletics/0")
                entries.append(entry)
            }
        } else {
            let totalHours = max(1, endHour - startHour)
            let interval = max(1, totalHours / max(1, notificationsPerDay))

            for i in 0 ..< notificationsPerDay {
                if i >= quotes.count { break }
                let quoteObj = quotes[i]

                let entryDate = Calendar.current.date(byAdding: .hour, value: i * interval, to: currentDate)!

                let randomSport = sportCategories.randomElement() ?? "athletics"
                let randomImageNumber = Int.random(in: 0...5)
                let image = "\(randomSport)/\(randomImageNumber)"

                entries.append(QuoteEntry(date: entryDate, quote: quoteObj.text, image: image))
            }
        }

        completion(Timeline(entries: entries, policy: .atEnd))
    }
}

struct QuoteEntry: TimelineEntry {
    let date: Date
    let quote: String
    let image: String
}

struct QuoteWidgetView: View {
    var entry: QuoteEntry
    @Environment(\.widgetFamily) var family

    var fontSize: CGFloat {
        switch family {
        case .systemLarge: return 26
        case .systemMedium: return 22
        default: return 20
        }
    }

    var body: some View {
        Text(entry.quote)
            .font(.system(size: fontSize, design: .serif))
            .italic()
            .foregroundColor(.white)
            .multilineTextAlignment(.center)
            .minimumScaleFactor(0.7)
            .padding(.all, family == .systemLarge ? 24 : nil)
            .containerBackground(for: .widget) {
                ZStack {
                    Image(entry.image)
                        .resizable()
                        .scaledToFill()

                    Color.black.opacity(0.45)
                }
            }
    }
}

struct widget: Widget {
    let kind: String = "widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            QuoteWidgetView(entry: entry)
        }
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

#Preview(as: .systemMedium) {
    widget()
} timeline: {
    QuoteEntry(date: .now, quote: "Your discipline today determines your success tomorrow.", image: "athletics/0")
    QuoteEntry(date: .now, quote: "Your discipline today determines your success tomorrow.", image: "athletics/1")
}
