import React, { Component } from 'react'
import { Button, Image, ScrollView, Text, View, ActivityIndicator } from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import { connect } from 'react-redux'
import Toast from 'react-native-root-toast';

import { Images } from '../Themes'
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
    trashTypes: {}
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
      Toast.show('Elige un tipo de residuo 🙏')
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoaded) {
      this.setState(state => ({
        ...state,
        trashTypes: {},
      }))
    }
  }

  render() {
    const anyTrashTypeSelected = Object.values(this.state.trashTypes).filter(Boolean).length;

    return (
      <View style={styles.mainContainer}>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.centered}>
            <Image source={Images.logo} style={styles.logo} />
          </View>

          <View style={{ paddingBottom: 40 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              <TrashButton text="Muebles" image={Images.menuFurniture} selected={this.state.trashTypes.furniture} onPress={() => this.toggle('furniture')} />
              <TrashButton text="Electrónica" image={Images.menuElectronics} selected={this.state.trashTypes.electronics} onPress={() => this.toggle('electronics')} />
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              <TrashButton text="Pilas" image={Images.menuBattery} selected={this.state.trashTypes.batteries} onPress={() => this.toggle('batteries')} />
              <TrashButton text="Caca de perro" image={Images.menuPoop} selected={this.state.trashTypes.dogShit} onPress={() => this.toggle('dogShit')} />
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              <TrashButton text="jQuery" image={Images.menuJquery} selected={this.state.trashTypes.glass} onPress={() => this.toggle('glass')} />
              <TrashButton text="Aceite" image={Images.menuOil} selected={this.state.trashTypes.oil} onPress={() => this.toggle('oil')} />
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              <TrashButton text="Medicinas" image={Images.menuMedicines} selected={this.state.trashTypes.medicines} onPress={() => this.toggle('medicines')} />
              <TrashButton text="Tóxicos" image={Images.menuToxic} selected={this.state.trashTypes.toxic} onPress={() => this.toggle('toxic')} />
            </View>
          </View>
        </ScrollView>

        <DondeLoTiroButton
          onPress={() => this.requestLocations()}
          disabled={!anyTrashTypeSelected}
        >
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
