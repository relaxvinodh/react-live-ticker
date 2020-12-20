/* eslint-disable no-param-reassign */
import * as R from 'ramda';
import {
  SideType, ItemTotal, StateType, ItemType,
} from './types';

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

export const accumalateTotal = (priceSnapshot: number[], data: SideType['data']) => priceSnapshot.reduce((hash, curr, idx, srcArray) => {
  if (hash[curr] === undefined) {
    hash[curr] = {} as ItemTotal;
  }

  const { amount } = data[curr];
  const { total: previousTotal = 0 } = hash[srcArray[idx - 1]] || {};
  hash[curr] = { amount, total: parseFloat((previousTotal + amount).toFixed(8)) };
  return hash;
}, {} as SideType['totals']);

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
