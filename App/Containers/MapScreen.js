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
  emoji: {
    ...ApplicationStyles.screen.sectionText,
    fontSize: 30,
    textAlign: 'left',
    marginBottom: Metrics.baseMargin,
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
  default: Images.whoopsMarkerImage,
};
const getMarkerImage = containerType => (markerImages[containerType] || markerImages.default);

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
  static defaultProps = {};

  handleListItemPress = (location) => {
    this.map.animateToCoordinate({
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }

  handleOpenMapPress = (location) => {
    openMap({ latitude: location.latitude, longitude: location.longitude });
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
        onMapReady={() => this.map.fitToElements(true)}
      >
        {this.props.locations.map((location, i) => (
          <Marker
            key={i}
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={getUserFriendlyLabel(location.containerType)}
            description={location.trashTypes.map(getUserFriendlyLabel).join(', ')}
          >
            <Image
              resizeMode="contain"
              style={{width: 60, height: 60}}
              source={getMarkerImage(location.containerType)}
            />
          </Marker>
        ))}
      </MapView>
    )
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          {this.renderMap()}

          <ScrollView style={{ padding: 20 }}>
            <Text style={styles.emoji}>
              😊 👌
            </Text>

            {this.props.locations.map((location, i) => {
              const distance = getRoundedDistance(location, this.props.geoPosition);

              return (
                <View
                  key={i}
                  style={{
                    paddingBottom: Metrics.baseMargin,
                    flex: 1,
                    flexDirection: 'row',
                  }}
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => this.handleListItemPress(location)}
                  >
                    <Text style={styles.sectionText}>
                      {getUserFriendlyLabel(location.containerType)} a {distance} metros!
                    </Text>
                    <Text style={styles.subSectionText}>
                      {location.trashTypes.map(getUserFriendlyLabel).join(', ')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.handleOpenMapPress(location)}>
                      <Image
                        source={Images.mapPinImage}
                        style={{width: 20, height: 20}}
                      />
                    </TouchableOpacity>
                </View>
              );
            })}
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
