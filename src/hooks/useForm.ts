import { useState, ChangeEvent } from 'react';

/**
 * Custom hook for handling form inputs
 * @param inputValues - Initial values for the form inputs
 * @returns Object containing values, handleChange function, and setValues function
 */
export function useForm<
  T extends Record<string, string | number | boolean | undefined>
>(inputValues: T) {
  const [values, setValues] = useState<T>(inputValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value } as T);
  };

  return { values, handleChange, setValues };
}
