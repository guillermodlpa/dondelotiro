import React, { Component } from 'react'
import { Button, Image, ScrollView, Text, View } from 'react-native'
import { Images } from '../Themes'
import Geolocation from 'react-native-geolocation-service'
import { connect } from 'react-redux'
import requestPermission, { PERMISSIONS } from '../Lib/request-permission'
import TrashRedux from '../Redux/TrashRedux'
// Styles
import styles from './Styles/LaunchScreenStyles'

class LaunchScreen extends Component {
  constructor (props) {
    super(props)

    this.onLocationChanged = this.onLocationChanged.bind(this)
  }

  onLocationChanged (position) {
    console.tron.log(position)
    this.props.setGeoPosition(
      position.coords.latitude,
      position.coords.longitude
    )
  }

  componentDidMount () {
    requestPermission(PERMISSIONS.LOCATION).then(() => {
      Geolocation.getCurrentPosition(
        this.onLocationChanged,
        error => console.error(error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000
        }
      )
    })
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.logo} style={styles.logo} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionText}>
              Selecciona los tipos de residuos
            </Text>
          </View>

          <Button block color={'#EF5411'} onPress={() => this.props.navigation.navigate('MapScreen')} title={'Buscar'} />

        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.trash.isLoading,
    isLoaded: state.trash.isLoaded,
    error: state.trash.error
  }
}

const mapDispatchToProps = (dispatch) => ({
  setGeoPosition: (latitude, longitude) => dispatch(TrashRedux.setGeoPosition(latitude, longitude)),
  requestLocations: (trashTypes, geoPosition) => dispatch(TrashRedux.locationRequest(trashTypes, geoPosition))
})

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)
