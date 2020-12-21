import React from 'react';
import './App.scss';
import Header from './components/Header';
import Tables from './components/Table';
import BooksContext from './context';
import useWebSocket from './useWebSocket';

const App = () => {
  const state = useWebSocket();
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
