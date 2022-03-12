export interface ILoggerLike {
  debug: (...args: unknown[]) => unknown;
  info: (...args: unknown[]) => unknown;
}
