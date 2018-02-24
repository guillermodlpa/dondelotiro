import { takeLatest, all } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { TrashTypes } from '../Redux/TrashRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { requestLocations } from './TrashSagas'

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(TrashTypes.LOCATIONS_REQUEST, requestLocations)
  ])
}
