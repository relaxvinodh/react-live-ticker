import { createContext } from 'react';
import { StateType } from '../components/reducer/types';

const BooksContext = createContext<StateType | null>(null);

export default BooksContext;
