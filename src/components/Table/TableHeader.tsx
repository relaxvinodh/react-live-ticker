import React from 'react';

/**
 * TableHeader Component
 * Wrapper component when creating the header
 *
 * @param children
 */

const TableHeader:React.FC = ({ children }) => (
  <div className="tableHeader">{children}</div>
);

export default TableHeader;
