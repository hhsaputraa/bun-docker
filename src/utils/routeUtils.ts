/**
 * Utility functions for routing and request handling
 */

// Extract path parameters from URL
export function extractPathParams(url: string, pattern: string): Record<string, string> | null {
  const urlParts = url.split('/');
  const patternParts = pattern.split('/');
  
  if (urlParts.length !== patternParts.length) {
    return null;
  }
  
  const params: Record<string, string> = {};
  
  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    
    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params[paramName] = urlParts[i];
    } else if (patternPart !== urlParts[i]) {
      return null;
    }
  }
  
  return params;
}

// Check if a URL matches a pattern
export function matchRoute(url: string, pattern: string): boolean {
  const urlPath = new URL(url, 'http://localhost').pathname;
  const urlParts = urlPath.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);
  
  if (urlParts.length !== patternParts.length) {
    return false;
  }
  
  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    
    if (!patternPart.startsWith(':') && patternPart !== urlParts[i]) {
      return false;
    }
  }

  return true;
}
