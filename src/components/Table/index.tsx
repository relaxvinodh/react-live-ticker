/* eslint-disable no-console */
import * as R from 'ramda';
import React, { useContext, useMemo } from 'react';
import BooksContext from '../../context';
import Chart from '../Chart';
import { ItemTotal, StateType } from '../reducer/types';
import './styles.scss';
import TableBody from './TableBody';
import TableField from './TableField';
import TableHeader from './TableHeader';
import TableLabel from './TableLabel';
import TableRow from './TableRow';

const Row = React.memo(({ item, total }: {item?: any, total?: number}) => (
  <TableRow>
    <TableField>
      <TableLabel>Count</TableLabel>
      {item?.count}
    </TableField>
    <TableField>
      <TableLabel>Amount</TableLabel>
      {item?.amount && Math.abs(item.amount)}
    </TableField>
    <TableField>
      <TableLabel>Total</TableLabel>
      {total && Math.abs(total)}
    </TableField>
    <TableField>
      <TableLabel>Price</TableLabel>
      {item?.price}
    </TableField>
  </TableRow>
));

const TableItem:React.FC<React.HTMLAttributes<HTMLDivElement> & { type: 'asks' | 'bids'}> = React.memo((
  { type, ...otherProps },
) => {
  const books = useContext(BooksContext);
  const { data, totals } = books![type];
  const items = R.values(data);
  const sortedItems = useMemo(() => {
    if (type === 'bids') {
      return R.sort(R.descend(R.prop('price')), items);
    }
    return items;
  }, [items]);
  return (
    <div className={`table ${type ?? ''}`} {...otherProps}>
      <TableHeader>
        <Row />
      </TableHeader>
      <TableBody>
        <Chart type={type} />
        {sortedItems.map((item, idx) => {
          console.log({ item, totals });
          return (
            <Row item={item} key={`${type}-${idx}`} total={totals[item.price].total} />
          );
        })}
      </TableBody>
    </div>
  );
});

export const initialState: StateType = {
  asks: {
    data: {}, priceSnap: [], totals: {} as ItemTotal, totalMax: 0,
  },
  bids: {
    data: {}, priceSnap: [], totals: {} as ItemTotal, totalMax: 0,
  },
};

const Tables: React.FC = () => (
  <div className="tableContainer">
    <TableItem type="bids" />
    <TableItem type="asks" />
  </div>
);
export default Tables;
