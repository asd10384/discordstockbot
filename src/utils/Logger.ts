import colors from "colors/safe";
import { Timestamp } from "./Timestamp";

type logType = "log" | "info" | "warn" | "error" | "debug" | "load" | "ready";

export const log = (content: string, type: logType) => {
  const timestamp = colors.white(`[${Timestamp()}]`);

  switch (type) {
    case "log":
      return console.log(`${colors.gray("[LOG]")} ${timestamp} ${content}`);
      
    case "info":
      return console.log(`${colors.cyan("[INFO]")} ${timestamp} ${colors.cyan(content)}`);
      
    case "warn":
      return console.log(`${colors.yellow("[WARN]")} ${timestamp} ${colors.yellow(content)}`);
      
    case "error":
      return console.log(`${colors.red("[ERROR]")} ${timestamp} ${colors.red(content)}`);
      
    case "debug":
      return console.log(`${colors.magenta("[DEBUG]")} ${timestamp} ${colors.magenta(content)}`);
      
    case "ready":
      return console.log(`${colors.green("[READY]")} ${timestamp} ${colors.green(content)}`);
      
    default:
      throw new TypeError("Logger 타입이 올바르지 않습니다.");
  }
};

export const Logger = {
  log: (content: string) => log(content, "log"),
  warn: (content: string) => log(content, "warn"),
  error: (content: string) => log(content, "error"),
  debug: (content: string) => log(content, "debug"),
  load: (content: string) => log(content, "load"),
  ready: (content: string) => log(content, "ready")
}
