/**
 * Logger utility for monitoring API requests and errors
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
  method?: string;
  path?: string;
  statusCode?: number;
  responseTime?: number;
  error?: Error;
  message?: string;
  [key: string]: any;
}

/**
 * Format log message with timestamp, level, and data
 */
function formatLog(level: LogLevel, data: LogData): string {
  const timestamp = new Date().toISOString();
  const parts = [`[${timestamp}] [${level.toUpperCase()}]`];
  
  // Add method and path if available
  if (data.method && data.path) {
    parts.push(`${data.method} ${data.path}`);
  }
  
  // Add status code if available
  if (data.statusCode !== undefined) {
    parts.push(`Status: ${data.statusCode}`);
  }
  
  // Add response time if available
  if (data.responseTime !== undefined) {
    parts.push(`${data.responseTime}ms`);
  }
  
  // Add message if available
  if (data.message) {
    parts.push(`- ${data.message}`);
  }
  
  return parts.join(' ');
}

/**
 * Format error details for logging
 */
function formatErrorDetails(error: Error): string {
  const details = [];
  
  details.push(`Error: ${error.message}`);
  
  // Add stack trace if available
  if (error.stack) {
    details.push(`Stack: ${error.stack}`);
  }
  
  return details.join('\n');
}

/**
 * Log request information
 */
export function logRequest(req: Request, statusCode: number, startTime?: number): void {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;
  
  const logData: LogData = {
    method,
    path,
    statusCode
  };
  
  // Calculate response time if startTime is provided
  if (startTime) {
    logData.responseTime = Date.now() - startTime;
  }
  
  // Choose log level based on status code
  let level: LogLevel = 'info';
  if (statusCode >= 400 && statusCode < 500) {
    level = 'warn';
  } else if (statusCode >= 500) {
    level = 'error';
  }
  
  console.log(formatLog(level, logData));
}

/**
 * Log error information
 */
export function logError(error: Error, req?: Request, additionalInfo?: Record<string, any>): void {
  const logData: LogData = {
    error,
    message: error.message,
    ...additionalInfo
  };
  
  // Add request information if available
  if (req) {
    const url = new URL(req.url);
    logData.method = req.method;
    logData.path = url.pathname;
  }
  
  console.error(formatLog('error', logData));
  console.error(formatErrorDetails(error));
}

/**
 * Log informational messages
 */
export function logInfo(message: string, additionalInfo?: Record<string, any>): void {
  console.log(formatLog('info', { message, ...additionalInfo }));
}