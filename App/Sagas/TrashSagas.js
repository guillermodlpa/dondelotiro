import { call, put, select } from 'redux-saga/effects'
import TrashActions, { trashSelectors } from '../Redux/TrashRedux'
import { NavigationActions } from 'react-navigation';

export function * requestLocations (action) {
  const { trashTypes, geoPosition } = action

  yield put(TrashActions.locationsSuccess([
    {
      trash_type: ['batteries', 'furniture'],
      container_type: 'clean_point',
      latitude: 40.5,
      longitude: -5.2,
      distance: 500
    },
    {
      trash_type: ['dog_shit'],
      container_type: 'dog_shit_trash',
      latitude: 41.5,
      longitude: -6.2,
      distance: 500
    },
    {
      trash_type: ['electronics'],
      container_type: 'clean_point',
      latitude: 41.5,
      longitude: -6.2,
      distance: 500
    }
  ]))

  yield put(NavigationActions.navigate({
    routeName: 'MapScreen'
  }))

}
