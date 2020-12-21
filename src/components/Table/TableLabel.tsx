import React from 'react';

/**
 * TableLabel Component
 * To be used inside the TableField component
 * Should be used for only the table headers/title
 * As this will be hidden for the TableBody component
 *
 * @param children
 */

const TableLabel:React.FC = ({ children }) => (
  <p className="tableLabel">{children}</p>
);

export default TableLabel;
