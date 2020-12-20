import React, { useEffect, useReducer } from 'react';
import Header from './components/Header';
import dataReducer from './components/reducer';
import ACTIONS from './components/reducer/actions';
import { ItemTotal, StateType } from './components/reducer/types';
import Tables from './components/Table';
import BooksContext from './context';
import './App.scss';

export const initialState: StateType = {
  asks: {
    data: {}, priceSnap: [], totals: {} as ItemTotal, totalMax: 0,
  },
  bids: {
    data: {}, priceSnap: [], totals: {} as ItemTotal, totalMax: 0,
  },
};

const App = () => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  useEffect(() => {
    const ws = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
    ws.onopen = () => {
      ws.send(JSON.stringify({
        event: 'subscribe',
        channel: 'book',
        symbol: 'tBTCUSD',
      }));
    };
    ws.onmessage = ({ data }) => {
      const msg = JSON.parse(data);
      if (msg.event) return;
      if (msg[1] && msg[1][0] && Array.isArray(msg[1][0])) {
        dispatch([ACTIONS.INITIAL, msg[1]]);
      } else {
        const [, count, amount] = msg[1];
        if (count > 0) {
          dispatch([amount > 0 ? ACTIONS.UPDATE_BIDS : ACTIONS.UPDATE_ASKS, msg[1]]);
        } else {
          dispatch([amount > 0 ? ACTIONS.DELETE_BIDS : ACTIONS.DELETE_ASKS, msg[1]]);
        }
      }
    };
    return () => {
      try {
        ws.close();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e, 'error in closing websocket');
      }
    };
  }, []);
  return (
    <div className="App">
      <Header />
      <BooksContext.Provider value={state}>
        <Tables />
      </BooksContext.Provider>
    </div>
  );
};

export default App;
