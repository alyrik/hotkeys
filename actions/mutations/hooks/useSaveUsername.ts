import { useMutation } from 'react-query';

import { saveUsername } from '@/mutations/functions/saveUsername';

export function useSaveUsername() {
  return useMutation(saveUsername);
}
