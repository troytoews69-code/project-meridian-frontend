export type AuthUser = {
  id: string;
  name: string;
  email: string;
  menopauseStage?: string;
  dateOfBirth?: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type DailyCheckin = {
  _id: string;
  checkinDate: string;
  symptomSeverity: number;
  mood: number;
  sleepQuality: number;
  energyLevel: number;
  activityMinutes: number;
  hydrationCups: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type Note = {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Reminder = {
  _id: string;
  title: string;
  message: string;
  time: string;
  daysOfWeek: string[];
  isEnabled: boolean;
  lastTriggeredAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Preference = {
  units?: 'metric' | 'imperial';
  reminderTime?: string;
  notificationsEnabled?: boolean;
  privacyMode?: boolean;
  timezone?: string;
};

export type ProfileResponse = {
  user: AuthUser & {
    createdAt: string;
    updatedAt: string;
  };
  preferences?: Preference;
};

export type TrendDay = {
  _id: string;
  avgMood?: number;
  avgSleepQuality?: number;
  avgEnergyLevel?: number;
  avgSymptomSeverity?: number;
};

export type TrendSummary = {
  range: {
    days: number;
    from: string;
    to: string;
  };
  overall: {
    totalCheckins: number;
    avgMood?: number;
    avgSleepQuality?: number;
    avgEnergyLevel?: number;
    avgSymptomSeverity?: number;
    avgHydrationCups?: number;
    avgActivityMinutes?: number;
  };
  daily: TrendDay[];
};

export type ProfileUpdatePayload = {
  name?: string;
  menopauseStage?: string;
  dateOfBirth?: string;
};

export type PreferenceUpdatePayload = {
  units?: 'metric' | 'imperial';
  reminderTime?: string;
  notificationsEnabled?: boolean;
  privacyMode?: boolean;
  timezone?: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('EXPO_PUBLIC_API_URL is not configured. Please set it in .env');
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  token?: string | null;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as { message?: string };
      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Keep fallback message when API does not return JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export const api = {
  register: (payload: { name: string; email: string; password: string }) =>
    request<AuthResponse>('/api/auth/register', { method: 'POST', body: payload }),

  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>('/api/auth/login', { method: 'POST', body: payload }),

  me: (token: string) => request<{ user: AuthUser }>('/api/auth/me', { token }),

  getProfile: (token: string) => request<ProfileResponse>('/api/profile', { token }),

  updateProfile: (token: string, payload: ProfileUpdatePayload) =>
    request<AuthUser>('/api/profile', { method: 'PUT', body: payload, token }),

  updatePreferences: (token: string, payload: PreferenceUpdatePayload) =>
    request<Preference>('/api/profile/preferences', { method: 'PUT', body: payload, token }),

  getCheckins: (token: string) => request<DailyCheckin[]>('/api/checkins', { token }),

  getCheckinById: (token: string, id: string) => request<DailyCheckin>(`/api/checkins/${id}`, { token }),

  upsertCheckin: (
    token: string,
    payload: {
      symptomSeverity: number;
      mood: number;
      sleepQuality: number;
      energyLevel: number;
      activityMinutes?: number;
      hydrationCups?: number;
      notes?: string;
      checkinDate?: string;
    }
  ) => request<DailyCheckin>('/api/checkins', { method: 'POST', body: payload, token }),

  getTrendSummary: (token: string, days: number) =>
    request<TrendSummary>(`/api/trends/summary?days=${days}`, { token }),

  getNotes: (token: string) => request<Note[]>('/api/notes', { token }),

  createNote: (
    token: string,
    payload: { title: string; content: string; tags?: string[]; isPinned?: boolean }
  ) => request<Note>('/api/notes', { method: 'POST', body: payload, token }),

  updateNote: (
    token: string,
    id: string,
    payload: { title?: string; content?: string; tags?: string[]; isPinned?: boolean }
  ) => request<Note>(`/api/notes/${id}`, { method: 'PUT', body: payload, token }),

  deleteNote: (token: string, id: string) =>
    request<{ message: string }>(`/api/notes/${id}`, { method: 'DELETE', token }),

  getReminders: (token: string) => request<Reminder[]>('/api/reminders', { token }),

  createReminder: (
    token: string,
    payload: {
      title: string;
      time: string;
      message?: string;
      daysOfWeek?: string[];
      isEnabled?: boolean;
    }
  ) => request<Reminder>('/api/reminders', { method: 'POST', body: payload, token }),

  updateReminder: (
    token: string,
    id: string,
    payload: {
      title?: string;
      time?: string;
      message?: string;
      daysOfWeek?: string[];
      isEnabled?: boolean;
    }
  ) => request<Reminder>(`/api/reminders/${id}`, { method: 'PUT', body: payload, token }),

  deleteReminder: (token: string, id: string) =>
    request<{ message: string }>(`/api/reminders/${id}`, { method: 'DELETE', token }),
};
