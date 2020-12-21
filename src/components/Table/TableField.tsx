import React from 'react';

type TableFieldProps = {
  ratio?: string,
};

/**
 * TableField Component
 * Each field in the row
 *
 * @param ratio Accepts a string, which is applied to the flex grow property
 * @param children
 */

const TableField:React.FC<TableFieldProps> = ({ children, ratio }) => {
  const style = { '--ratio': ratio } as React.CSSProperties;
  return (
    <div className="tableField" style={style}>{children}</div>
  );
};

export default TableField;
