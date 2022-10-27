import isEmail from 'validator/lib/isEmail';

export type ValidateReturn<ErrorsType> = {
  isValid: boolean;
  errors?: ErrorsType;
  fields?: Map<string, string>;
};

export const validateIsEmail = (str: string) => isEmail(str);

// @todo duplicate of infrastructure/**/cognitoUserPool.ts */
export const passwordPolicy = {
  minimumLength: 8,
  requireLowercase: true,
  requireSymbols: true,
  requireNumbers: true,
  requireUppercase: true,
};

export const validatePasswordRequirements = (str: string) => {
  const symbolsRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const hasNumberRegex = /\d/;
  
  return {
    hasMinimumLength: str.length >= passwordPolicy.minimumLength,
    isBelowMaximumLength: str.length <= 99,
    hasLowercase: str.toUpperCase() !== str,
    hasSymbols: symbolsRegex.test(str),
    hasNumbers: hasNumberRegex.test(str),
    hasUppercase: str.toLowerCase() !== str,
  };
}

export const validatePassword = (str: string) => {
 return !(new Set(Object.values(validatePasswordRequirements(str))).has(false));
};

export enum BlacklistedStatus {
  Blacklisted = 'blacklisted',
  Whitelisted = 'whitelisted',
  Unknown = 'unknown',
}

export const validateIsEmailBlacklisted = async (str: string) => {
  const domain = str.split('@')?.[1];
  const provider = domain.split('.')?.[0];
  if (!provider) {
    throw new Error('Could not extract provider from email. Please provide a valid email address.');
  }
  const response = await fetch(`https://v2.trashmail-blacklist.org/check/json/${provider}`);
  const body: {
    status: BlacklistedStatus,
    domain: string,
    added: number,
    lastchecked: number,
  } = await response.json();

  return body.status === BlacklistedStatus.Blacklisted;
};
