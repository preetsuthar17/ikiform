import type { FormProgress, ProgressStorageAdapter } from "../types";

export class LocalStorageAdapter implements ProgressStorageAdapter {
  private prefix = "ikiform_progress_";

  async save(key: string, data: FormProgress): Promise<void> {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(`${this.prefix}${key}`, serialized);
    } catch (error) {
      throw new Error(`Failed to save progress to localStorage: ${error}`);
    }
  }

  async load(key: string): Promise<FormProgress | null> {
    try {
      const stored = localStorage.getItem(`${this.prefix}${key}`);
      if (!stored) return null;

      const data = JSON.parse(stored) as FormProgress;

      if (new Date() > new Date(data.expiresAt)) {
        await this.delete(key);
        return null;
      }

      return data;
    } catch (error) {
      console.warn(`Failed to load progress from localStorage: ${error}`);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(`${this.prefix}${key}`);
    } catch (error) {
      console.warn(`Failed to delete progress from localStorage: ${error}`);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith(this.prefix),
      );

      keys.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn(`Failed to clear progress from localStorage: ${error}`);
    }
  }
}

export class SessionStorageAdapter implements ProgressStorageAdapter {
  private prefix = "ikiform_progress_";

  async save(key: string, data: FormProgress): Promise<void> {
    try {
      const serialized = JSON.stringify(data);
      sessionStorage.setItem(`${this.prefix}${key}`, serialized);
    } catch (error) {
      throw new Error(`Failed to save progress to sessionStorage: ${error}`);
    }
  }

  async load(key: string): Promise<FormProgress | null> {
    try {
      const stored = sessionStorage.getItem(`${this.prefix}${key}`);
      if (!stored) return null;

      const data = JSON.parse(stored) as FormProgress;

      if (new Date() > new Date(data.expiresAt)) {
        await this.delete(key);
        return null;
      }

      return data;
    } catch (error) {
      console.warn(`Failed to load progress from sessionStorage: ${error}`);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      sessionStorage.removeItem(`${this.prefix}${key}`);
    } catch (error) {
      console.warn(`Failed to delete progress from sessionStorage: ${error}`);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = Object.keys(sessionStorage).filter((key) =>
        key.startsWith(this.prefix),
      );

      keys.forEach((key) => sessionStorage.removeItem(key));
    } catch (error) {
      console.warn(`Failed to clear progress from sessionStorage: ${error}`);
    }
  }
}

/**
 * Server Storage adapter for form progress
 * Stores data on the server via API endpoints
 */
export class ServerStorageAdapter implements ProgressStorageAdapter {
  private baseUrl = "/api/form-progress";

  async save(key: string, data: FormProgress): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Failed to save progress to server: ${error}`);
    }
  }

  async load(key: string): Promise<FormProgress | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${key}`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = (await response.json()) as FormProgress;

      if (new Date() > new Date(data.expiresAt)) {
        await this.delete(key);
        return null;
      }

      return data;
    } catch (error) {
      console.warn(`Failed to load progress from server: ${error}`);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/${key}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.warn(`Failed to delete progress from server: ${error}`);
    }
  }

  async clear(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.warn(`Failed to clear progress from server: ${error}`);
    }
  }
}
