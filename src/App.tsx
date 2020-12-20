import React, { useCallback, useEffect, useReducer } from 'react';
import './App.scss';
import Header from './components/Header';
import dataReducer, { initialState } from './components/reducer';
import ACTIONS from './components/reducer/actions';
import Tables from './components/Table';
import BooksContext from './context';

const App = () => {
  const booksStore = localStorage.getItem('booksStore');
  const [state, dispatch] = useReducer(
    dataReducer, booksStore ? JSON.parse(booksStore) : initialState,
  );

  const saveStore = useCallback(() => localStorage.setItem('booksStore', JSON.stringify(state)), [state]);

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
    setTimeout(() => ws.close(), 5000);

    window.addEventListener('unload', saveStore, false);
    return () => {
      try {
        window.removeEventListener('unload', saveStore, false);
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
