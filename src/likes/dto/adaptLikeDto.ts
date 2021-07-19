/* eslint-disable prefer-const */
import { CreateLikeDto } from './create-like.dto';

/**
 * solves three problems:
 * dynamically convert to json or string[] to support array in sqlite,
 * Add 1 to likes property and removes the id  ❔ the id helps determine
 * if the query comes from the database.
 */

export const adaptLikeDto = (like: CreateLikeDto): CreateLikeDto => {
  let { id, movieId, customers, likes, customerEmail } = like;

  if (customerEmail.includes('[')) {
    customers = JSON.parse(customerEmail);
  } else if (id) {
    customers = JSON.parse(customers);
  } else {
    customers = JSON.stringify([customerEmail]);
  }

  if (!likes) {
    likes = 1;
  }

  return id
    ? { movieId, customers, likes }
    : { movieId, customers, likes, customerEmail };
};
