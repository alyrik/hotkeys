import axios from 'axios';
import { API_URLS } from '@/config/config';
import { ISaveIndividualAnswerParams } from '@/models/Actions';

export async function saveIndividualAnswer(
  params: ISaveIndividualAnswerParams,
) {
  return axios.post(API_URLS.answers, params, { withCredentials: true });
}
