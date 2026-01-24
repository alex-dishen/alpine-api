import type { UserProvider } from 'src/db/types/db.types';

export type OAuthUserData = {
  email: string;
  firstName: string;
  lastName: string;
  providerId: string;
  provider: UserProvider;
};

export interface IOAuthStrategy {
  readonly provider: UserProvider;
  authenticate(code: string): Promise<OAuthUserData>;
}
