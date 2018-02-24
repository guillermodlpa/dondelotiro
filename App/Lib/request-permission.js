import { PermissionsAndroid, Platform } from 'react-native'

export const PERMISSIONS = {
  LOCATION: {
    type: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    title: 'Location permission',
    message: 'Location permission is needed for core functionality.'
  }
}

function requestPermission ({ type, title, message }) {
  return new Promise((resolve, reject) => {
    return PermissionsAndroid.request(
      type,
      {
        title,
        message
      }
    ).then(granted => {
      if (Platform.OS !== 'android' || granted === true || granted === PermissionsAndroid.RESULTS.GRANTED) {
        resolve()
      } else {
        reject()
      }
    }).catch(() => {
      if (Platform.OS !== 'android') {
        resolve()
      } else {
        reject()
      }
    })
  })
}

export default requestPermission
