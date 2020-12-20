import * as R from 'ramda';
import ACTIONS from './actions';
import { IndexedItemType, StateType, Totals } from './types';
import {
  accumalateTotal, getData, getItemTotalMax, mapRec,
} from './utils';

const dataReducer = <T extends Array<number>>(
  state: StateType, [type, payload]: [string, T[] | T],
) => {
  const {
    INITIAL, UPDATE_ASKS, DELETE_ASKS, UPDATE_BIDS, DELETE_BIDS,
  } = ACTIONS;
  switch (type) {
    case INITIAL: {
      const stateWithData = getData(payload as T[], state);
      const asksTotals = accumalateTotal(state.asks.priceSnap, state.asks.data);
      const bidsTotals = accumalateTotal(state.bids.priceSnap, state.bids.data);
      const totalMax = Math.max(getItemTotalMax(asksTotals), getItemTotalMax(bidsTotals));
      return R.pipe(
        R.assocPath<Totals, StateType>(['asks', 'totals'], asksTotals),
        R.assocPath(['asks', 'totalMax'], totalMax),
        R.assocPath(['bids', 'totalMax'], totalMax),
        R.assocPath(['bids', 'totals'], bidsTotals),
      )(stateWithData);
    }
    case UPDATE_ASKS: {
      const [id] = payload as T;
      const updatedData = R.assoc(String(id), mapRec(payload), state.asks.data);
      const updatedPriceSnap = R.ifElse(
        R.includes(id),
        R.identity,
        R.pipe(
          R.concat([id]),
          R.sort((a, b) => a - b),
        ),
      )(state.asks.priceSnap);
      const updatedTotals = accumalateTotal(updatedPriceSnap, updatedData);
      const updatedMax = Math.max(getItemTotalMax(updatedTotals), state.bids.totalMax);

      return R.pipe(
        R.assocPath<IndexedItemType, StateType>(['asks', 'data'], updatedData),
        R.assocPath(['asks', 'priceSnap'], updatedPriceSnap),
        R.assocPath(['asks', 'totals'], updatedTotals),
        R.assocPath(['asks', 'totalMax'], updatedMax),
      )(state);
    }
    case DELETE_ASKS: {
      const [id] = payload as T;
      const updatedData = R.dissoc<IndexedItemType>(String(id), state.asks.data);
      const updatedPriceSnap = R.without([id], state.asks.priceSnap);
      const updatedTotals = accumalateTotal(updatedPriceSnap, updatedData);
      const updatedMax = Math.max(getItemTotalMax(updatedTotals), state.bids.totalMax);

      return R.pipe(
        R.assocPath<IndexedItemType, StateType>(['asks', 'data'], updatedData),
        R.assocPath(['asks', 'priceSnap'], updatedPriceSnap),
        R.assocPath(['asks', 'totals'], updatedTotals),
        R.assocPath(['asks', 'totalMax'], updatedMax),
      )(state);
    }
    case UPDATE_BIDS: {
      const [id] = payload as T;
      const updatedData = R.assoc(String(id), mapRec(payload), state.bids.data);
      const updatedPriceSnap = R.ifElse(
        R.includes(id),
        R.identity,
        R.pipe(
          R.concat([id]),
          R.sort((a, b) => b - a),
        ),
      )(state.bids.priceSnap);
      const updatedTotals = accumalateTotal(updatedPriceSnap, updatedData);
      const updatedMax = Math.max(getItemTotalMax(updatedTotals), state.asks.totalMax);

      return R.pipe(
        R.assocPath<IndexedItemType, StateType>(['bids', 'data'], updatedData),
        R.assocPath(['bids', 'priceSnap'], updatedPriceSnap),
        R.assocPath(['bids', 'totals'], updatedTotals),
        R.assocPath(['bids', 'totalMax'], updatedMax),
      )(state);
    }
    case DELETE_BIDS: {
      const [id] = payload as T;
      const updatedData = R.dissoc<IndexedItemType>(String(id), state.bids.data);
      const updatedPriceSnap = R.without([id], state.bids.priceSnap);
      const updatedTotals = accumalateTotal(updatedPriceSnap, updatedData);
      const updatedMax = Math.max(getItemTotalMax(updatedTotals), state.asks.totalMax);

      return R.pipe(
        R.assocPath<IndexedItemType, StateType>(['bids', 'data'], updatedData),
        R.assocPath(['bids', 'priceSnap'], updatedPriceSnap),
        R.assocPath(['bids', 'totals'], updatedTotals),
        R.assocPath(['bids', 'totalMax'], updatedMax),
      )(state);
    }
    default:
      return state;
  }
};

export default dataReducer;
