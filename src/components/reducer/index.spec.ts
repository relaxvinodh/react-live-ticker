import * as R from 'ramda';
import { StateType } from './types';
import dataReducer, { initialState } from './index';
import ACTIONS from './actions';
import {
  convertToNum, mapHead, filterNegative, filterPositive,
} from './utils.spec';

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

  describe('test update "asks"', () => {
    it('should update the values from the payload', () => {
      const payload = [22922, 4, 0.0006];
      const state = dataReducer(initialState as StateType, [ACTIONS.INITIAL, mock]);
      const updatedState = dataReducer(state as StateType, [ACTIONS.UPDATE_ASKS, payload]);
      expect(updatedState.asks.data[22922].count).toEqual(payload[1]);
    });

    it('should add new values and update priceSnap from the payload', () => {
      const payload = [22927, 4, 0.0006];
      const state = dataReducer(initialState as StateType, [ACTIONS.INITIAL, mock]);
      const updatedState = dataReducer(state as StateType, [ACTIONS.UPDATE_ASKS, payload]);
      expect(updatedState.asks.data[22927]).toBeDefined();
      expect(updatedState.asks.priceSnap).toContain(22927);
    });

    it('should delete the value and priceSnap based on the payload', () => {
      const payload = [22928, 4, 0.0006];
      const state = dataReducer(initialState as StateType, [ACTIONS.INITIAL, mock]);
      const updatedState = dataReducer(state as StateType, [ACTIONS.DELETE_ASKS, payload]);
      expect(updatedState.asks.data[22928]).toBeUndefined();
      expect(updatedState.asks.priceSnap).not.toContain(22928);
    });
  });
  describe('test update "bids"', () => {
    it('should update the values from the payload', () => {
      const payload = [22922, 4, 0.0006];
      const state = dataReducer(initialState as StateType, [ACTIONS.INITIAL, mock]);
      const updatedState = dataReducer(state as StateType, [ACTIONS.UPDATE_BIDS, payload]);
      expect(updatedState.bids.data[22922].count).toEqual(payload[1]);
    });

    it('should add new values and update priceSnap from the payload', () => {
      const payload = [22927, 4, 0.0006];
      const state = dataReducer(initialState as StateType, [ACTIONS.INITIAL, mock]);
      const updatedState = dataReducer(state as StateType, [ACTIONS.UPDATE_BIDS, payload]);
      expect(updatedState.bids.data[22927]).toBeDefined();
      expect(updatedState.bids.priceSnap).toContain(22927);
    });

    it('should delete the value and priceSnap based on the payload', () => {
      const payload = [22928, 4, 0.0006];
      const state = dataReducer(initialState as StateType, [ACTIONS.INITIAL, mock]);
      const updatedState = dataReducer(state as StateType, [ACTIONS.DELETE_BIDS, payload]);
      expect(updatedState.bids.data[22928]).toBeUndefined();
      expect(updatedState.bids.priceSnap).not.toContain(22928);
    });
  });
});
