import type {
  ApiEngineConfig,
  PrepopulationConfig,
  PrepopulationEngine,
  PrepopulationResult,
} from "../types";

export class ApiEngine implements PrepopulationEngine {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static readonly DEFAULT_CACHE_TTL = 5 * 60 * 1000;
  private static readonly DEFAULT_TIMEOUT = 10_000;
  private static readonly DEFAULT_RETRY_ATTEMPTS = 3;
  private static readonly DEFAULT_RETRY_DELAY = 1000;

  async getValue(config: PrepopulationConfig): Promise<PrepopulationResult> {
    const startTime = Date.now();
    const apiConfig = config as ApiEngineConfig;

    try {
      if (!this.validateConfig(config)) {
        throw new Error("Invalid API configuration");
      }

      const cacheKey = this.generateCacheKey(config);
      const cached = this.getCachedValue(cacheKey, apiConfig.cacheTTL);

      if (cached) {
        const extractedValue = this.extractValue(cached, config.jsonPath);
        return {
          success: true,
          value: extractedValue,
          source: "api-cache",
          executionTime: Date.now() - startTime,
        };
      }

      const data = await this.makeRequestWithRetry(apiConfig);
      this.setCachedValue(cacheKey, data, apiConfig.cacheTTL);

      const extractedValue = this.extractValue(data, config.jsonPath);

      return {
        success: true,
        value: extractedValue,
        source: "api",
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        value: config.fallbackValue || null,
        error: error instanceof Error ? error.message : "Unknown API error",
        source: "api",
        executionTime: Date.now() - startTime,
      };
    }
  }

  validateConfig(config: PrepopulationConfig): boolean {
    return Boolean(config.apiEndpoint && this.isValidUrl(config.apiEndpoint));
  }

  private async makeRequestWithRetry(config: ApiEngineConfig): Promise<any> {
    const maxAttempts =
      config.retryAttempts || ApiEngine.DEFAULT_RETRY_ATTEMPTS;
    const retryDelay = config.retryDelay || ApiEngine.DEFAULT_RETRY_DELAY;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await this.makeRequest(config);
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }

        await this.delay(retryDelay * attempt);
      }
    }
  }

  private async makeRequest(config: ApiEngineConfig): Promise<any> {
    const controller = new AbortController();
    const timeout = config.timeout || ApiEngine.DEFAULT_TIMEOUT;

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const headers = {
        "Content-Type": "application/json",
        "User-Agent": "Ikiform-Prepopulation/1.0",
        ...config.apiHeaders,
      };

      const requestConfig: RequestInit = {
        method: config.apiMethod || "GET",
        headers,
        signal: controller.signal,
      };

      if (config.apiMethod === "POST" && config.apiBodyTemplate) {
        requestConfig.body = this.processBodyTemplate(config.apiBodyTemplate);
      }

      const response = await fetch(config.apiEndpoint!, requestConfig);

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`,
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      return await response.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private processBodyTemplate(template: string): string {
    return template;
  }

  private extractValue(data: any, jsonPath?: string): any {
    if (!jsonPath) return data;

    try {
      return this.evaluateJsonPath(data, jsonPath);
    } catch (error) {
      console.warn("Failed to extract value using JSONPath:", jsonPath, error);
      return null;
    }
  }

  private evaluateJsonPath(data: any, path: string): any {
    if (path === "$") return data;

    if (!path.startsWith("$.")) {
      throw new Error("JSONPath must start with $.");
    }

    const pathParts = path.substring(2).split(".");
    let current = data;

    for (const part of pathParts) {
      if (!current) return null;

      const arrayMatch = part.match(/^([^[]+)\[(\d+|\*)\]$/);
      if (arrayMatch) {
        const [, fieldName, indexOrWildcard] = arrayMatch;
        current = current[fieldName];

        if (Array.isArray(current)) {
          if (indexOrWildcard === "*") {
            return current;
          }
          const index = Number.parseInt(indexOrWildcard, 10);
          current = current[index];
        } else {
          return null;
        }
      } else {
        current = current[part];
      }
    }

    return current;
  }

  private generateCacheKey(config: PrepopulationConfig): string {
    return btoa(
      JSON.stringify({
        endpoint: config.apiEndpoint,
        method: config.apiMethod,
        headers: config.apiHeaders,
        body: config.apiBodyTemplate,
      }),
    );
  }

  private getCachedValue(key: string, customTtl?: number): any | null {
    const cached = ApiEngine.cache.get(key);
    if (!cached) return null;

    const ttl = customTtl || ApiEngine.DEFAULT_CACHE_TTL;
    if (Date.now() - cached.timestamp > ttl) {
      ApiEngine.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCachedValue(key: string, data: any, customTtl?: number): void {
    ApiEngine.cache.set(key, { data, timestamp: Date.now() });

    if (ApiEngine.cache.size > 100) {
      this.cleanupCache(customTtl);
    }
  }

  private cleanupCache(customTtl?: number): void {
    const ttl = customTtl || ApiEngine.DEFAULT_CACHE_TTL;
    const now = Date.now();

    for (const [key, value] of ApiEngine.cache.entries()) {
      if (now - value.timestamp > ttl) {
        ApiEngine.cache.delete(key);
      }
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static clearCache(): void {
    ApiEngine.cache.clear();
  }

  static getCacheSize(): number {
    return ApiEngine.cache.size;
  }
}
