export type ItemType = {
  price: number,
  count: number,
  amount: number,
};

export type ItemTotal = {
  amount: number,
  total: number,
};

export type Totals = {
  [key : number]: ItemTotal,
};

export type IndexedItemType = {
  [key : number]: ItemType,
};

export type SideType = {
  data: IndexedItemType,
  priceSnap: number[],
  totals: Totals,
  totalMax: number,
};

export type StateType = {
  asks: SideType,
  bids: SideType,
};
