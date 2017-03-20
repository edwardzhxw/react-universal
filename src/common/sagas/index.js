import { fork } from 'redux-saga/effects';
import discover from './DiscoverSaga';

export default function* root() {
  yield fork(discover);
}
