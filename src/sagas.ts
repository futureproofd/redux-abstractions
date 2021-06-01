import { all, put, takeEvery } from 'redux-saga/effects'

// Simulate network activity
const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

// Our worker Saga: will perform the async increment task
export function* incrementAsync() {
  yield delay(1000)
  yield put({ type: 'SAGA_INCREMENT' })
}

// Our watcher Saga: spawn a new incrementAsync task on each CREATE_TODO action
export function* watchIncrementAsync() {
  yield takeEvery('CREATE_TODO', incrementAsync)
}

export function* helloSaga() {
  console.log('hello saga world.')
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([
    helloSaga(),
    watchIncrementAsync()
  ])
}