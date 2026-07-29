export type SnaptrCommand = 'init' | 'track';

export interface SnaptrInitOptions {
  user_email?: string;
  [key: string]: unknown;
}

export interface Snaptr {
  (command: 'init', pixelId: string, options?: SnaptrInitOptions): void;
  (command: 'track', eventName: string, eventData?: Record<string, unknown>): void;
  queue?: unknown[];
  handleRequest?: (...args: unknown[]) => void;
}
