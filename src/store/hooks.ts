import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store'; // adjust path to your store definition

export const useAppDispatch: () => AppDispatch = useDispatch;
