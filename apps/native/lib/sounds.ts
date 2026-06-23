import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";

const SOURCES = {
  startFocus: require("../assets/sounds/start_focus_session.mp3"),
  taskAdd: require("../assets/sounds/task_add.mp3"),
  taskComplete: require("../assets/sounds/task_completed.mp3"),
} as const;

type SoundKey = keyof typeof SOURCES;

const players: Partial<Record<SoundKey, AudioPlayer>> = {};

export async function preloadSounds() {
  try {
    // Mix with other audio so a cue never pauses the user's background music.
    await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: "mixWithOthers" });
  } catch {
    // audio mode not critical
  }
  (Object.keys(SOURCES) as SoundKey[]).forEach((key) => {
    if (!players[key]) {
      try {
        players[key] = createAudioPlayer(SOURCES[key]);
      } catch {
        // ignore — sound is non-essential feedback
      }
    }
  });
}

function play(key: SoundKey) {
  try {
    let player = players[key];
    if (!player) {
      player = createAudioPlayer(SOURCES[key]);
      players[key] = player;
    }
    player.seekTo(0);
    player.play();
  } catch {
    // never let a missing/failed sound break the interaction
  }
}

export const playStartFocus = () => play("startFocus");
export const playTaskAdd = () => play("taskAdd");
export const playTaskComplete = () => play("taskComplete");
