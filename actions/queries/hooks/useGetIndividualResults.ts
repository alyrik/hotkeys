import { useQuery } from 'react-query';

import { getIndividualResults } from '@/queries/functions/getIndividualResults';
import { QueryKey } from '@/queries/index';

export function useGetIndividualResults({ enabled }: { enabled: boolean }) {
  return useQuery(QueryKey.GetIndividualResults, getIndividualResults, {
    enabled,
  });
}
