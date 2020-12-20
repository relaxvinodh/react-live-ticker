import React from 'react';

type TableFieldProps = {
  ratio?: string,
};

const TableField:React.FC<TableFieldProps> = ({ children, ratio }) => {
  const style = { '--ratio': ratio } as React.CSSProperties;
  return (
    <div className="tableField" style={style}>{children}</div>
  );
};

export default TableField;
