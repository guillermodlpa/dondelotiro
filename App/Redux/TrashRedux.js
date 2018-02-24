import { createActions, createReducer } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import { camelizeKeys } from 'humps';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setGeoPosition: ['latitude', 'longitude'],
  locationsRequest: ['trashTypes', 'geoPosition'],
  locationsSuccess: ['locations'],
  locationsFailure: ['error']
})

export const TrashTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  isLoading: false,
  isLoaded: false,
  geoPosition: {
    latitude: null,
    longitude: null
  },
  locations: [],
  error: null
})

/* ------------- Selectors ------------- */

export const TrashSelectors = {
  getGeoPosition: state => state.trash.geoPosition,
  getLocations: state => state.trash.locations
}

/* ------------- Reducers ------------- */

export const setGeoPosition = (state, { latitude, longitude }) => state.merge({
  geoPosition: {
    latitude: latitude,
    longitude: longitude
  }
})

export const locationsRequest = state => state.merge({
  isLoading: true,
  isLoaded: false,
  error: null
})

export const locationsSuccess = (state, { locations }) => state.merge({
  locations: camelizeKeys(locations),
  isLoading: false,
  isLoaded: true,
  error: null
})

export const locationsFailure = (state, { error }) => state.merge({
  locations: [],
  isLoading: false,
  isLoaded: false,
  error: null
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_GEO_POSITION]: setGeoPosition,
  [Types.LOCATIONS_REQUEST]: locationsRequest,
  [Types.LOCATIONS_SUCCESS]: locationsSuccess,
  [Types.LOCATIONS_FAILURE]: locationsFailure
})
