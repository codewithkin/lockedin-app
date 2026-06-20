import * as SecureStore from "expo-secure-store";

import { emptyState, type PersistedState } from "./types";

const KEY = "lockedin.state.v1";

export async function loadState(): Promise<PersistedState> {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      ...emptyState,
      ...parsed,
      stats: { ...emptyState.stats, ...(parsed.stats ?? {}) },
      goals: parsed.goals ?? [],
      tasks: parsed.tasks ?? [],
      history: parsed.history ?? [],
    };
  } catch {
    return emptyState;
  }
}

export async function saveState(state: PersistedState): Promise<void> {
  try {
    await SecureStore.setItemAsync(KEY, JSON.stringify(state));
  } catch {
    // best-effort persistence
  }
}

export async function clearState(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(KEY);
  } catch {
    // ignore
  }
}
