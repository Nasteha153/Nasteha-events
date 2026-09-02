export const EVENT_CATEGORIES = [
  { value: "education", label: "Education", icon: "🎓", tone: "violet" },
  { value: "technology", label: "Technology", icon: "💻", tone: "cyan" },
  { value: "business", label: "Business", icon: "💼", tone: "amber" },
  { value: "celebration", label: "Celebration", icon: "🎉", tone: "pink" },
  {
    value: "sports_competition",
    label: "Sports & Competition",
    icon: "🏆",
    tone: "emerald",
  },
  { value: "community", label: "Community", icon: "❤️", tone: "rose" },
  {
    value: "entertainment",
    label: "Entertainment",
    icon: "🎤",
    tone: "orange",
  },
  { value: "wedding", label: "Wedding", icon: "💍", tone: "fuchsia" },
  { value: "other", label: "Other", icon: "📌", tone: "slate" },
];

export function getCategory(value) {
  return (
    EVENT_CATEGORIES.find((category) => category.value === value) ??
    EVENT_CATEGORIES.at(-1)
  );
}
