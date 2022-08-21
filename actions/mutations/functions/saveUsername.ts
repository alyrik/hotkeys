import axios from 'axios';

import { API_URLS } from '@/config/config';
import { ISaveUsernameParams } from '@/models/Actions';

export async function saveUsername(params: ISaveUsernameParams) {
  return axios.post(API_URLS.users, params, { withCredentials: true });
}
