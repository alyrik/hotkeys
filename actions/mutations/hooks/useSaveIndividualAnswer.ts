import { useMutation } from 'react-query';

import { saveIndividualAnswer } from '@/mutations/functions/saveIndividualAnswer';

export function useSaveIndividualAnswer() {
  return useMutation(saveIndividualAnswer);
}
