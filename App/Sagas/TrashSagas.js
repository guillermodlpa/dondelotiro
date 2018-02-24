import { call, put, select } from 'redux-saga/effects'
import TrashActions from '../Redux/TrashRedux'
import { NavigationActions } from 'react-navigation';
import Secrets from 'react-native-config'
import axios from 'axios'

const LIMIT = 3;

export function* requestLocations(action) {
  const { trashTypes, geoPosition } = action
  let containerTypes = [];

  trashTypes.forEach(trashType => {
    switch (trashType) {
      case 'furniture':
      case 'electronics':
      case 'glass':
      case 'oil':
      case 'toxic':
        if (containerTypes.indexOf('clean_point') === -1) {
          containerTypes.push('clean_point')
        }
        break
      case 'dogShit':
        if (containerTypes.indexOf('dog_shit_trash') === -1) {
          containerTypes.push('dog_shit_trash')
        }
        break
      case 'batteries':
        if (containerTypes.indexOf('clean_point') === -1) {
          containerTypes.push('clean_point')
        }

        if (containerTypes.indexOf('battery_recycling_point') === -1) {
          containerTypes.push('battery_recycling_point')
        }
        break
    }
  })

  const bodyFormData = new FormData();
  bodyFormData.append('lat', geoPosition.latitude);
  bodyFormData.append('lon', geoPosition.longitude);
  bodyFormData.append('trash_types', containerTypes.join(','));

  const { response, error } = yield axios.post(
    Secrets.API_URL,
    bodyFormData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => ({ response }))
    .catch(error => ({ error }))

  if (response) {
    let locations = [
      ...response.data.battery_recycling_points.slice(0, 4),
      ...response.data.clean_points.slice(0, 4),
      ...response.data.dog_shits.slice(0, 4),
    ]

    yield put(TrashActions.locationsSuccess(locations))

    yield put(NavigationActions.navigate({
      routeName: 'MapScreen'
    }))
  } else {
    yield put(TrashActions.locationsFailure(error))
  }
}
