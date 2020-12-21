import React from 'react';

/**
 * TableBody Component
 * Wrapper component when creating the body of the table
 *
 * @param children
 */

const TableBody:React.FC = ({ children }) => (
  <div className="tableBody">{children}</div>
);

export default TableBody;
