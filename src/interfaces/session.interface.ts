export interface Session {
  accessToken: string;
}

export type AppSession = Record<string, Session>;