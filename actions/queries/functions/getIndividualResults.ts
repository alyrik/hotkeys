import axios from 'axios';

import { API_URLS } from '@/config/config';

export async function getIndividualResults() {
  const response = await axios.get(API_URLS.answers, { withCredentials: true });
  return response.data;
}
