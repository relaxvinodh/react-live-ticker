import * as R from 'ramda';
import { StateType } from './types';
import dataReducer from './index';
import ACTIONS from './actions';
import {
  convertToNum, mapHead, filterNegative, filterPositive,
} from './utils.spec';

import { initialState } from '../Table';

const mock = [
  [22923, 1, 0.0002],
  [22922, 3, 0.0006],
  [22921, 4, 0.0008],
  [22924, 4, -0.63455854],
  [22925, 4, -0.77162511],
  [22926, 1, -0.04386535],
];

describe('test reducer', () => {
  describe('test initial action', () => {
    it('should return state with "asks", "bids", "priceSnap" values ', () => {
      const state = dataReducer(initialState as StateType, [ACTIONS.INITIAL, mock]);
      const asks = convertToNum(R.keys(state.asks.data));
      const bids = convertToNum(R.keys(state.bids.data));
      const mockAsks = mapHead(filterNegative(mock));
      const mockBids = mapHead(filterPositive(mock));
      expect(asks).toEqual(expect.arrayContaining(mockAsks));
      expect(bids).toEqual(expect.arrayContaining(mockBids));
      expect(state.asks.priceSnap).toEqual(expect.arrayContaining(mockAsks));
      expect(state.bids.priceSnap).toEqual(expect.arrayContaining(mockBids));
    });
  });
});
