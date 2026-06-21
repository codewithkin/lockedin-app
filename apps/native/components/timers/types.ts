export type TimerVariantProps = {
  taskTitle: string;
  goalTitle?: string;
  remaining: number;
  total: number;
  elapsed: number;
  index: number;
  count: number;
  timeUp: boolean;
  onDone: () => void;
  onSkip: () => void;
};
