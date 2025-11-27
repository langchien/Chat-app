import chalk from 'chalk'

enum LogLevel {
  Info = 'info',
  Success = 'success',
  Error = 'error',
  Warn = 'warn',
  Debug = 'debug',
  Pending = 'pending',
}

const levelColor: Record<LogLevel, (msg: string) => string> = {
  [LogLevel.Info]: chalk.blue,
  [LogLevel.Success]: chalk.green,
  [LogLevel.Error]: chalk.red,
  [LogLevel.Warn]: chalk.yellow,
  [LogLevel.Debug]: chalk.magenta,
  [LogLevel.Pending]: chalk.cyan,
}

class Logger {
  private log(level: LogLevel, ...args: any[]) {
    const timestamp = new Date().toISOString()
    const colorFn = levelColor[level]
    if (args.length === 0) return
    const [message, ...rest] = args
    console.log(colorFn(`[${timestamp}] ${message}`), ...rest)
  }

  info(...args: any[]) {
    this.log(LogLevel.Info, ...args)
  }
  success(...args: any[]) {
    this.log(LogLevel.Success, ...args)
  }
  error(...args: any[]) {
    this.log(LogLevel.Error, ...args)
  }
  warn(...args: any[]) {
    this.log(LogLevel.Warn, ...args)
  }
  debug(...args: any[]) {
    this.log(LogLevel.Debug, ...args)
  }
  pending(...args: any[]) {
    this.log(LogLevel.Pending, ...args)
  }
}

export const logger = new Logger()
