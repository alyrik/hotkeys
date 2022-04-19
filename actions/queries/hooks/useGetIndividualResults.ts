import { useQuery } from 'react-query';

import { getIndividualResults } from '@/queries/functions/getIndividualResults';
import { QueryKey } from '@/queries/index';

export function useGetIndividualResults({
  enabled,
  onError,
}: {
  enabled: boolean;
  onError(e: Error): void;
}) {
  return useQuery([QueryKey.GetIndividualResults], getIndividualResults, {
    enabled,
    onError,
  });
}
