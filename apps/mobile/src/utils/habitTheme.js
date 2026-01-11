export const HABIT_COLORS = [
  { name: "Orange", value: "#FF6B35", light: "#FFE8E0" },
  { name: "Teal", value: "#00C896", light: "#E0F7F0" },
  { name: "Purple", value: "#9B7EDE", light: "#F0EBFF" },
  { name: "Blue", value: "#6B73FF", light: "#E8EAFF" },
  { name: "Pink", value: "#FF6BA9", light: "#FFE8F4" },
  { name: "Yellow", value: "#FFB800", light: "#FFF3D6" },
  { name: "Green", value: "#5CB85C", light: "#E8F5E8" },
  { name: "Red", value: "#E74C3C", light: "#FDE8E6" },
];

export const HABIT_ICONS = [
  // Fitness & Health
  "💪",
  "🏃",
  "🧘",
  "🚴",
  "🏊",
  "⚽",
  "🏀",
  "🎾",
  "🥊",
  "🤸",
  "🧗",
  "⛹️",
  "🏋️",
  "🤾",
  "🚣",
  "🧘‍♀️",

  // Food & Nutrition
  "🥗",
  "🍎",
  "🥑",
  "🥤",
  "☕",
  "🍵",
  "🥛",
  "🍇",
  "🥕",
  "🌮",
  "🍱",
  "🥦",
  "🍊",
  "🥒",
  "🍓",
  "🫐",

  // Productivity & Learning
  "📚",
  "✍️",
  "💻",
  "📝",
  "🎯",
  "📊",
  "🧠",
  "🎓",
  "📖",
  "🖊️",
  "💡",
  "🔬",
  "🎨",
  "🎭",
  "🎵",
  "🎸",

  // Wellness & Self-care
  "😴",
  "🛌",
  "🧖",
  "💆",
  "🚿",
  "🪥",
  "🧴",
  "💅",
  "🌸",
  "🌺",
  "🌻",
  "🌼",
  "🌙",
  "⭐",
  "✨",
  "💫",

  // Habits & Routines
  "⏰",
  "📅",
  "✅",
  "🔔",
  "📌",
  "🎁",
  "🏆",
  "🥇",
  "💎",
  "🔥",
  "⚡",
  "🌟",
  "👍",
  "❤️",
  "🙏",
  "🎉",
];

export const PREMIUM_COLORS = [
  { name: "Gold", value: "#FFD700", light: "#FFF9E6" },
  { name: "Rose Gold", value: "#E0A899", light: "#F9F0ED" },
  { name: "Lavender", value: "#B39DDB", light: "#F3F0FF" },
  { name: "Mint", value: "#81C784", light: "#F0F9F0" },
  { name: "Coral", value: "#FF7B72", light: "#FFEEED" },
  { name: "Sky", value: "#64B5F6", light: "#E8F4FF" },
  { name: "Peach", value: "#FFB74D", light: "#FFF3E0" },
  { name: "Emerald", value: "#26A69A", light: "#E0F2F1" },
  { name: "Crimson", value: "#DC143C", light: "#FDE8EB" },
  { name: "Indigo", value: "#5C6BC0", light: "#E8EAF6" },
];

export const getColorByName = (colorName) => {
  const color = HABIT_COLORS.find((c) => c.name === colorName);
  return color || HABIT_COLORS[0];
};

export const getPremiumColorByName = (colorName) => {
  const color = PREMIUM_COLORS.find((c) => c.name === colorName);
  return color || PREMIUM_COLORS[0];
};
