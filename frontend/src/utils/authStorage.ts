/**
 * Helper to safely retrieve and clear auth tokens and user data.
 */
export interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const authStorage = {
  getAccessToken: (): string | null => localStorage.getItem('peoplepay_access_token'),
  setAccessToken: (token: string): void => localStorage.setItem('peoplepay_access_token', token),
  getRefreshToken: (): string | null => localStorage.getItem('peoplepay_refresh_token'),
  setRefreshToken: (token: string): void => localStorage.setItem('peoplepay_refresh_token', token),
  getUser: (): StoredUser | null => {
    try {
      const u = localStorage.getItem('peoplepay_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  setUser: (user: StoredUser): void => localStorage.setItem('peoplepay_user', JSON.stringify(user)),
  clearAuth: (): void => {
    localStorage.removeItem('peoplepay_access_token');
    localStorage.removeItem('peoplepay_refresh_token');
    localStorage.removeItem('peoplepay_user');
  }
};
