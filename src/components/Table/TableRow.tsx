import React from 'react';

/**
 * TableRow Component
 * Should be used for every row
 *
 * @param children
 */

const TableRow:React.FC = ({ children }) => (
  <div className="tableRow">{children}</div>
);

export default TableRow;
