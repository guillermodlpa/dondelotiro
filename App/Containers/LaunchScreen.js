import React, { Component } from 'react'
import { Button, Image, ScrollView, Text, View, ActivityIndicator } from 'react-native'
import { Images } from '../Themes'
import Geolocation from 'react-native-geolocation-service'
import { connect } from 'react-redux'
import requestPermission, { PERMISSIONS } from '../Lib/request-permission'
import TrashRedux from '../Redux/TrashRedux'
import DondeLoTiroButton from '../Components/DondeLoTiroButton'
import TrashButton from '../Components/TrashButton'
// Styles
import styles from './Styles/LaunchScreenStyles'

class LaunchScreen extends Component {
  constructor(props) {
    super(props)

    this.onLocationChanged = this.onLocationChanged.bind(this)
    this.toggle = this.toggle.bind(this)
    this.requestLocations = this.requestLocations.bind(this)
  }

  state = {
    geoPosition: {
      latitude: null,
      longitude: null
    },
    trashTypes: {
      furniture: false,
      electronics: false,
      batteries: false,
      dogShit: false,
    }
  }

  onLocationChanged(position) {
    this.setState({
      ...this.state,
      geoPosition: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    })

    this.props.setGeoPosition(
      position.coords.latitude,
      position.coords.longitude
    )
  }

  toggle(trashType) {
    this.setState({
      ...this.state,
      trashTypes: {
        ...this.state.trashTypes,
        [trashType]: !this.state.trashTypes[trashType]
      }
    })
  }

  requestLocations() {
    let trashTypes = []

    for (trashType in this.state.trashTypes) {
      if (this.state.trashTypes[trashType]) {
        trashTypes.push(trashType)
      }
    }

    if (!trashTypes.length) {
      return
    }

    this.props.locationsRequest(trashTypes, this.state.geoPosition)
  }

  componentDidMount() {
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

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={{ flex: 1 }}>
          <View style={styles.centered}>
            <Image source={Images.logo} style={styles.logo} />
          </View>

          <View>
            <Text style={styles.sectionText}>
              Selecciona los tipos de residuos
            </Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              <TrashButton text="Muebles" icon="archive" selected={this.state.trashTypes.furniture} onPress={() => this.toggle('furniture')} />
              <TrashButton text="Electrónica" icon="desktop" selected={this.state.trashTypes.electronics} onPress={() => this.toggle('electronics')} />
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              <TrashButton text="Pilas" icon="bolt" selected={this.state.trashTypes.batteries} onPress={() => this.toggle('batteries')} />
              <TrashButton text="Caca" icon="fire" selected={this.state.trashTypes.dogShit} onPress={() => this.toggle('dogShit')} />
            </View>
          </View>
        </View>
        <DondeLoTiroButton onPress={() => this.requestLocations()}>
          <View style={{ flexDirection: 'column' }}>
            {(!this.props.isLoading ?
              <Text style={DondeLoTiroButton.innerTextStyles}>BUSCAR</Text> :
              <ActivityIndicator size="small" color="#ffffff" />)}
          </View>
        </DondeLoTiroButton>
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
  locationsRequest: (trashTypes, geoPosition) => dispatch(TrashRedux.locationsRequest(trashTypes, geoPosition))
})

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)
