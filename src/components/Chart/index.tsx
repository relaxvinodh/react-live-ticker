/* eslint-disable no-console */
import * as R from 'ramda';
import React, { useContext, useMemo } from 'react';
import BooksContext from '../../context';
import './chart.scss';

type ChartProps = {
  type: 'asks' | 'bids',
};

const Rect: React.FC<
React.SVGProps<SVGRectElement> & {
  value: number, totalMax: number
}> = React.memo(({ value, totalMax, ...otherProps }) => {
  const width = useMemo(() => `${(Math.abs(value) * 100) / totalMax}%`, [value, totalMax]);
  return <rect {...otherProps} width={width} />;
});

const Chart: React.FC<ChartProps> = React.memo(({ type }) => {
  const books = useContext(BooksContext);
  const { totals, totalMax } = books![type];

  const sortedItems = useMemo(() => {
    if (type === 'bids') {
      return R.sort(R.ascend(R.prop('total')), R.values(totals));
    }
    return R.values(totals);
  }, [totals, type]);
  return (
    <div className="chart container">
      <svg className={type}>
        {sortedItems?.map(({ total }, idx) => (
          <Rect x="1" y={17 * idx} height="17" value={total} totalMax={totalMax} fillOpacity="1" key={`${type}-${idx}`} />
        ))}
      </svg>
    </div>
  );
});

export default Chart;
