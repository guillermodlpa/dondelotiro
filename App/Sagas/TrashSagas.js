import { call, put, select } from 'redux-saga/effects'
import TrashActions from '../Redux/TrashRedux'
import { NavigationActions } from 'react-navigation';

export function * requestLocations (action) {
  const { trashTypes, geoPosition } = action

  yield put(TrashActions.locationsSuccess([
    {
      trash_types: ['batteries', 'furniture'],
      container_type: 'clean_point',
      latitude: 40.3578177,
      longitude: -3.6975403,
    },
    {
      trash_types: ['dog_shit'],
      container_type: 'dog_shit_trash',
      latitude: 40.3588177,
      longitude: -3.6475403,
    },
    {
      trash_types: ['electronics'],
      container_type: 'clean_point',
      latitude: 40.3408177,
      longitude: -3.5975403,
    }
  ]))

  yield put(NavigationActions.navigate({
    routeName: 'MapScreen'
  }))

}
