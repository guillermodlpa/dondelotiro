import { call, put, select } from 'redux-saga/effects'
import TrashActions from '../Redux/TrashRedux'
import { NavigationActions } from 'react-navigation';
import Secrets from 'react-native-config'
import axios from 'axios'

export function* requestLocations(action) {
  const { trashTypes, geoPosition } = action

  const bodyFormData = new FormData();
  bodyFormData.append('lat', geoPosition.latitude);
  bodyFormData.append('lon', geoPosition.longitude);
  bodyFormData.append('trash_types', trashTypes.join(','));

  const response = yield axios.post(
    Secrets.API_URL,
    bodyFormData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => response)
    .catch(error => error)

  if (response.data) {
    yield put(TrashActions.locationsSuccess(response.data.dist))
  } else {
    yield put(TrashActions.locationsFailure(error))
  }

  yield put(NavigationActions.navigate({
    routeName: 'MapScreen'
  }))
}
