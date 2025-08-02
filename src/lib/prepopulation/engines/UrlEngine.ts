import type { PrepopulationConfig, PrepopulationResult, PrepopulationEngine } from '../types';

export class UrlEngine implements PrepopulationEngine {
  private urlParams: URLSearchParams;

  constructor() {
    this.urlParams = typeof window !== 'undefined' 
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  }

  async getValue(config: PrepopulationConfig): Promise<PrepopulationResult> {
    const startTime = Date.now();
    
    try {
      if (!config.urlParam) {
        throw new Error('URL parameter name is required');
      }

      const value = this.urlParams.get(config.urlParam);
      
      if (value === null || value === '') {
        return {
          success: false,
          value: config.fallbackValue || null,
          error: 'Parameter not found in URL',
          source: 'url',
          executionTime: Date.now() - startTime
        };
      }

     
      const sanitizedValue = this.sanitizeValue(decodeURIComponent(value));
      
      return {
        success: true,
        value: sanitizedValue,
        source: 'url',
        executionTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        value: config.fallbackValue || null,
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'url',
        executionTime: Date.now() - startTime
      };
    }
  }

  validateConfig(config: PrepopulationConfig): boolean {
    return Boolean(config.urlParam && config.urlParam.trim());
  }

  private sanitizeValue(value: string): string {
   
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .trim();
  }

 
  static generatePreviewUrl(baseUrl: string, fieldMappings: Record<string, string>): string {
    const url = new URL(baseUrl);
    Object.entries(fieldMappings).forEach(([param, value]) => {
      url.searchParams.set(param, encodeURIComponent(value));
    });
    return url.toString();
  }

 
  getAllParameters(): Record<string, string> {
    const params: Record<string, string> = {};
    this.urlParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }

 
  hasParameter(paramName: string): boolean {
    return this.urlParams.has(paramName);
  }
}
