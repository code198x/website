export function getEntryIcon(category: string): string {
  const icons: Record<string, string> = {
    hardware: "🖥️",
    people: "👤",
    companies: "🏢",
    games: "🎮",
    demos: "🎬",
    "operating-systems": "💻",
    "programming-languages": "📝",
    techniques: "⚡",
    publications: "📖",
    events: "🎪",
    groups: "👥",
    formats: "💾",
    culture: "🌟",
    applications: "💼",
    "development-tools": "🔧",
    utilities: "🛠️",
    drivers: "⚙️",
    plugins: "🧩",
    emulators: "🔄",
    projects: "🎯"
  };
  return icons[category] || "📦";
}

export function getCategoryDisplayName(category: string): string {
  const names: Record<string, string> = {
    hardware: "Hardware",
    people: "People",
    companies: "Companies",
    games: "Games",
    demos: "Demos",
    "operating-systems": "Operating Systems",
    "programming-languages": "Programming Languages",
    techniques: "Techniques",
    publications: "Publications",
    events: "Events",
    groups: "Groups",
    formats: "Formats",
    culture: "Culture",
    applications: "Applications",
    "development-tools": "Development Tools",
    utilities: "Utilities",
    drivers: "Drivers",
    plugins: "Plugins",
    emulators: "Emulators",
    projects: "Projects"
  };
  return names[category] || category;
}