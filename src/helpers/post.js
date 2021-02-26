import axios from 'axios';

import constants from '../utils/helpers/constants';

export const fetchCommentsOnPost = (id, token) =>
  axios
    .get(constants.BASE_URL + `/post/comment/list/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    })
    .then(res => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    });

export const fetchReactionsOnPost = (id, token) =>
  axios
    .get(constants.BASE_URL + `/post/reaction/list/${id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
    })
    .then(res => {
      return res.data.data;
    })
    .catch(err => {
      return err;
    });
