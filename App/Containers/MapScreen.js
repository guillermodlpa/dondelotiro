import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Text, Image, View, StyleSheet, TouchableOpacity, TouchableHighlight, StatusBar } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux'
import openMap from 'react-native-open-maps';

import { TrashSelectors } from '../Redux/TrashRedux'
import getRoundedDistance from '../Lib/getRoundedDistance';

import DondeLoTiroButton from '../Components/DondeLoTiroButton';
import { Images, Metrics, ApplicationStyles } from '../Themes'

// Styles
const styles = StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    paddingBottom: Metrics.baseMargin
  },
  logo: {
    marginTop: Metrics.doubleSection,
    height: Metrics.images.logo,
    width: Metrics.images.logo,
    resizeMode: 'contain'
  },
  centered: {
    alignItems: 'center'
  },
  map: {
    width: '100%',
    height: 350,
  },
  sectionText: {
    ...ApplicationStyles.screen.sectionText,
    textAlign: 'left',
    marginVertical: 0,
  },
  subSectionText: {
    ...ApplicationStyles.screen.subSectionText,
    textAlign: 'left',
    marginVertical: 0,
  },
});

const userFriendlyLabels = {
  batteries: 'Baterías',
  battery_recycling_point: 'Contenedor',
  furniture: 'Muebles',
  clean_point: 'Punto Limpio',
  dog_shit_trash: 'Papelera con bolsas',
  dog_shit: 'Caca de perro',
  electronics: 'Electrónica',
};
const getUserFriendlyLabel = key => (userFriendlyLabels[key] || key);

const markerImages = {
  clean_point: Images.cleanPointMakerImage,
  battery_recycling_point: Images.batteryMakerImage,
  dog_shit_trash: Images.dogShitMakerImage,
  pharmacy: Images.pharmacyMarkerImage,
  default: Images.whoopsMarkerImage,
};
const getMarkerImage = (containerType, active) => (
  `${markerImages[containerType] || markerImages.default}${active ? 'Active' : ''}`
);

export class MapScreen extends Component {
  static propTypes = {
    geoPosition: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }).isRequired,

    locations: PropTypes.arrayOf(
      PropTypes.shape({
        trashTypes: PropTypes.arrayOf(PropTypes.string),
        containerType: PropTypes.string,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        distance: PropTypes.number,
      }),
    ).isRequired,
  };

  state = {
    selectedLocation: null,
  };

  handleListItemPress = (location, index) => {
    const middleCoordinates = {
      latitude: (location.latitude + this.props.geoPosition.latitude) / 2,
      longitude: (location.longitude + this.props.geoPosition.longitude) / 2,
    };

    this.map.animateToCoordinate(middleCoordinates);
    this.setState(state => ({ ...state, selectedLocation: index }))
  }

  handleOpenMapPress = (location) => {
    openMap({ latitude: location.latitude, longitude: location.longitude });
  }

  handleSelectMarker = (index) => {
    this.setState(state => ({ ...state, selectedLocation: index }))
  }

  handleDeelectMarker = () => {
    this.setState(state => ({ ...state, selectedLocation: null }))
  }

  renderMap() {
    return (
      <MapView
        style={styles.map}
        showsUserLocation
        initialRegion={{
          latitude: this.props.geoPosition.latitude,
          longitude: this.props.geoPosition.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        ref={ref => this.map = ref}
        showsMyLocationButton
      >
        {this.props.locations.map((location, i) => {
          const active = this.state.selectedLocation === i;
          const image = getMarkerImage(location.containerType, active);

          return (
            <Marker
              key={i}
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title={getUserFriendlyLabel(location.containerType)}
              description={location.trashTypes.map(getUserFriendlyLabel).join(', ')}
              onSelect={() => this.handleSelectMarker(i)}
              onDeselect={() => this.handleDeelectMarker()}
              zIndex={active ? 999 : 0}
            >
              <Image
                resizeMode="contain"
                style={{width: 60, height: 60}}
                source={image}
              />
            </Marker>
          );
        })}
      </MapView>
    )
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          {this.renderMap()}

          {(!this.props.locations || !this.props.locations.length) && (
            <View style={{ padding: 20 }}>
              <Text style={styles.sectionText}>
                Ups. No hay nada cerca!
              </Text>
            </View>
          )}

          <ScrollView style={{ padding: 20 }}>
            {this.props.locations.map((location, i) => {
              const distance = getRoundedDistance(location, this.props.geoPosition);
              const labeledDistance = distance > 1000
                ? `${parseInt(distance / 100, 10) / 10} km`
                : `${distance} metros`

              return (
                <View
                  key={i}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: this.state.selectedLocation === i ? '#EF5411' : 'transparent',
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flex: 1,
                    }}
                    onPress={() => this.handleListItemPress(location, i)}
                  >
                    <Text style={styles.sectionText}>
                      {getUserFriendlyLabel(location.containerType)} a {labeledDistance}!
                    </Text>
                    <Text style={styles.subSectionText}>
                      {location.trashTypes.map(getUserFriendlyLabel).join(', ')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => this.handleOpenMapPress(location)}
                    style={{ justifyContent: 'center' }}
                  >
                    <Image
                      source={Images.mapPinImage}
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}

            <View style={{ padding: 25 }} />
          </ScrollView>
        </View>

        <DondeLoTiroButton
          secondary
          block
          onPress={() => this.props.navigation.goBack()}
        >
          <Text style={DondeLoTiroButton.innerTextStyles}>
            HECHO
          </Text>
        </DondeLoTiroButton>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  geoPosition: TrashSelectors.getGeoPosition(state),
  locations: TrashSelectors.getLocations(state),
});

export default connect(mapStateToProps, {})(MapScreen)
