import { usePrevious } from './usePrevious';

export const useCompare = <T>(value: T) => {
  const preValue = usePrevious(value);
  return preValue !== value;
};
