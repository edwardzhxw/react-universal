import { call, take, put } from 'redux-saga/effects';
import { discover } from '../actions';
import Types from '../actions/types';
import api from '../helpers/api';

export default function* discoverSaga() {
  while (true) {
    const { payload } = yield take(`${Types.DISCOVER}_REQUEST`);
    const params = Object.assign({}, { page: 1, sort_by: 'popularity.desc', primary_release_year: 2017 }, payload);
    const { res, error } = yield call(api.get, '/discover/movie', params);
    if (res) {
      yield put(discover.receive({ movies: res.results }));
    } else {
      yield put(discover.failure(error));
    }
  }
}
