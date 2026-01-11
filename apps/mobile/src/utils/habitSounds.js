// HabitPunch Sound Effects Configuration

export const STANDARD_SOUNDS = [
  {
    id: "punch_classic",
    name: "Classic Punch",
    description: "The original satisfying punch sound",
    uri: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3", // Punch/hit sound
  },
  {
    id: "success_chime",
    name: "Success Chime",
    description: "A simple success notification",
    uri: "https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3", // Success chime
  },
];

export const PREMIUM_SOUNDS = [
  {
    id: "magic_chime",
    name: "Magic Chime",
    description: "Magical achievement sound",
    uri: "https://www.soundjay.com/misc/sounds/magic-chime-05.wav",
    premium: true,
  },
  {
    id: "level_up",
    name: "Level Up",
    description: "Game-style level up sound",
    uri: "https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3",
    premium: true,
  },
  {
    id: "coin_collect",
    name: "Coin Collect",
    description: "Satisfying coin collection sound",
    uri: "https://assets.mixkit.co/active_storage/sfx/1998/1998-preview.mp3",
    premium: true,
  },
  {
    id: "achievement",
    name: "Achievement",
    description: "Epic achievement unlock sound",
    uri: "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3",
    premium: true,
  },
  {
    id: "power_up",
    name: "Power Up",
    description: "Energetic power-up sound",
    uri: "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3",
    premium: true,
  },
];

export const getAllSounds = (isPremium = false) => {
  if (isPremium) {
    return [...STANDARD_SOUNDS, ...PREMIUM_SOUNDS];
  }
  return STANDARD_SOUNDS;
};

export const getSoundById = (soundId) => {
  const allSounds = [...STANDARD_SOUNDS, ...PREMIUM_SOUNDS];
  return allSounds.find((s) => s.id === soundId) || STANDARD_SOUNDS[0];
};
