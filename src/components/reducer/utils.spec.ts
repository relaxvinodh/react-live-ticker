import * as R from 'ramda';
import { mapRec, accumalateTotal } from './utils';

export const isLastPositive = R.pipe(
  R.last,
  R.flip(R.gt)(0),
);

export const filterPositive = R.filter(isLastPositive);
export const filterNegative = R.reject(isLastPositive);
export const mapHead = R.map(R.head);
export const convertToNum = R.map(Number);

describe('test utils', () => {
  it('should check if last value is positive in array', () => {
    const negativeArr = [1, 3, -2];
    expect(isLastPositive(negativeArr)).toBeFalsy();
    const positiveArr = [1, 3, 2];
    expect(isLastPositive(positiveArr)).toBeTruthy();
  });

  it('should filter array with positive values', () => {
    const data = [[1, 2, 3], [4, 5, -6], [7, 8, -9]];
    expect(filterPositive(data)).toEqual([[1, 2, 3]]);
  });

  it('should filter array with negative values', () => {
    const data = [[1, 2, 3], [4, 5, -6], [7, 8, -9]];
    expect(filterNegative(data)).toEqual([[4, 5, -6], [7, 8, -9]]);
  });

  it('should map array numbers to "price", "count", "amount"', () => {
    const data = [1, 2, 3];
    expect(mapRec(data)).toEqual({ price: 1, count: 2, amount: 3 });
  });

  it('should accumulate total in the same order of snapshots', () => {
    const priceSnap = [3, 2, 1];
    const dataPositive = {
      3: { price: 3, count: 1, amount: 0.3 },
      2: { price: 2, count: 1, amount: 0.2 },
      1: { price: 1, count: 1, amount: 0.1 },
    };
    const totalsPositive = accumalateTotal(priceSnap, dataPositive);
    expect(totalsPositive).toEqual({
      3: { amount: 0.3, total: 0.3 },
      2: { amount: 0.2, total: 0.5 },
      1: { amount: 0.1, total: 0.6 },
    });
    const dataNegative = {
      3: { price: 3, count: 1, amount: -0.3 },
      2: { price: 2, count: 1, amount: -0.2 },
      1: { price: 1, count: 1, amount: -0.1 },
    };
    const totalsNegative = accumalateTotal(priceSnap, dataNegative);
    expect(totalsNegative).toEqual({
      3: { amount: -0.3, total: -0.3 },
      2: { amount: -0.2, total: -0.5 },
      1: { amount: -0.1, total: -0.6 },
    });
  });
});
