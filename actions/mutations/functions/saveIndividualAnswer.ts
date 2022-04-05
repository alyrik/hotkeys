import axios from 'axios';
import { API_URLS } from '@/config/config';

interface ISaveIndividualAnswerParams {
  questionId: number;
  answer: string;
}

export async function saveIndividualAnswer(
  params: ISaveIndividualAnswerParams,
) {
  return axios.post(API_URLS.answers, params);
}
