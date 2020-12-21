/* eslint-disable no-param-reassign */
import * as R from 'ramda';
import {
  SideType, ItemTotal, StateType, ItemType,
} from './types';

/**
 * mapRec
 *
 * @param array array of three numbers
 *
 * @return {object} object of 'price', 'count', 'amount'
 * @example
 *          const data = [1, 2, 3];
 *          const formattedData = mapRec(data);
 *
 *
 */

export const mapRec = R.applySpec<{ price: number, count: number, amount: number }>({
  price: R.view(R.lensIndex(0)),
  count: R.view(R.lensIndex(1)),
  amount: R.view(R.lensIndex(2)),
});

const getValues:(obj: SideType['totals']) => ItemTotal[] = R.values;

export const getItemTotalMax = R.pipe(
  getValues,
  R.map<ItemTotal, number>(R.prop('total')),
  R.apply(Math.max),
);

/**
 * accumalateTotal
 *
 * @param priceSnapShot array of numbers of the keys in sorted order
 * @param data data object indexed by the price
 *
 * @return total object indexed by the price
 * @example
 *          const priceSnap = [22221, 22222, 22223];
 *          const data = {
 *            22221: { 'price': 22221, 'count': 2, 'amount': 1}
 *            22222: { 'price': 22222, 'count': 3, 'amount': 1}
 *            22223: { 'price': 22223, 'count': 4, 'amount': 1}
 *          }
 *          accumalateTotal(priceSnap, data);
 */

export const accumalateTotal = (priceSnapshot: number[], data: SideType['data']) => priceSnapshot.reduce((hash, curr, idx, srcArray) => {
  if (hash[curr] === undefined) {
    hash[curr] = {} as ItemTotal;
  }

  const { amount } = data[curr];
  const { total: previousTotal = 0 } = hash[srcArray[idx - 1]] || {};
  hash[curr] = { amount, total: parseFloat((previousTotal + amount).toFixed(8)) };
  return hash;
}, {} as SideType['totals']);

/**
 * getData
 *
 * @param payload Array<Array<number>>
 * @param state state value
 *
 * @return updated state value
 */
export const getData = <T extends Array<number>>(
  payload: T[], state: StateType) => R.reduce(
    (hash: StateType, curr: T) => {
      const [price, , amount] = curr;
      const side = amount >= 0 ? 'bids' : 'asks';

      if (hash[side].data[price] === undefined) {
        hash[side].data[price] = {} as ItemType;
      }

      hash[side].priceSnap.push(price);
      hash[side].data[price] = mapRec(curr);

      return hash;
    }, state, payload,
  );
