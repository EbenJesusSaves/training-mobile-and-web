import { useCallback, useState } from 'react';

import { appConfig } from '@/config/app-config';

type Validators<T> = Partial<{ [K in keyof T]: (value: T[K], values: T) => string | null }>;

/**
 * Small form helper (adapted from the team guide's useForm): values, per-field errors,
 * client validation, and a way to merge field errors returned by the API.
 */
export function useForm<T extends Record<string, string>>(initialValues: T, validators: Validators<T> = {}) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setValue = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => (previous[name] ? { ...previous, [name]: undefined } : previous));
  }, []);

  const validate = useCallback(() => {
    const next: Partial<Record<keyof T, string>> = {};
    for (const name of Object.keys(validators) as (keyof T)[]) {
      const message = validators[name]?.(values[name], values);
      if (message) next[name] = message;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [validators, values]);

  const applyServerErrors = useCallback((fieldErrors: Record<string, string>) => {
    setErrors((previous) => ({ ...previous, ...(fieldErrors as Partial<Record<keyof T, string>>) }));
  }, []);

  return { values, errors, setValue, validate, applyServerErrors, setValues };
}

export const validateEmail = (value: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? null : 'Enter a valid email address.');

export const validatePassword = (value: string) =>
  value.length >= appConfig.validation.minPasswordLength && /[A-Za-z]/.test(value) && /\d/.test(value)
    ? null
    : `Use at least ${appConfig.validation.minPasswordLength} characters with a letter and a number.`;

export const validateFullName = (value: string) =>
  value.trim().length >= appConfig.validation.minNameLength ? null : 'Please enter your full name.';
