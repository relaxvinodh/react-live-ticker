import React from 'react';
import './header.scss';

const Header: React.FC = () => (
  <div className="header">
    Order Book
    {' '}
    <span className="subText"> BTC/USD</span>
  </div>
);

export default Header;
