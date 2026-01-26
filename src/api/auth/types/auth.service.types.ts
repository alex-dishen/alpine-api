import type { UserProvider } from 'src/db/types/db.types';

export type SignInInput = {
  email: string;
  password: string;
};

export type TokensOutput = {
  access_token: string;
  refresh_token: string;
};

export type SignUpInput = {
  email: string;
  avatar?: string;
  password: string;
  last_name: string;
  first_name: string;
  confirmation_password: string;
};

export type OAuthSignInInput = {
  code: string;
  provider: UserProvider;
};
