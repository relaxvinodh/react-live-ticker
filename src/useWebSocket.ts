import { useCallback, useEffect, useReducer } from 'react';
import './App.scss';
import dataReducer, { initialState } from './components/reducer';
import ACTIONS from './components/reducer/actions';

const useWebSocket = () => {
  const booksStore = localStorage.getItem('booksStore');
  const [state, dispatch] = useReducer(
    dataReducer, booksStore ? JSON.parse(booksStore) : initialState,
  );

  const saveStore = useCallback(() => localStorage.setItem('booksStore', JSON.stringify(state)), [state]);

  useEffect(() => {
    const ws = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
    let i = 0;
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
        i += 1;
        if (count > 0) {
          setTimeout(() => {
            dispatch([amount > 0 ? ACTIONS.UPDATE_BIDS : ACTIONS.UPDATE_ASKS, msg[1]]);
          }, i * 200);
        } else {
          setTimeout(() => {
            dispatch([amount > 0 ? ACTIONS.DELETE_BIDS : ACTIONS.DELETE_ASKS, msg[1]]);
          }, i * 100);
        }
      }
    };

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

  return state;
};

export default useWebSocket;
