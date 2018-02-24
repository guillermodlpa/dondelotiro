import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Text, Image, View, StyleSheet } from 'react-native'
import MapView, { Marker } from 'react-native-maps';

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
    fontSize: 35,
    textAlign: 'left',
    marginBottom: Metrics.baseMargin,
  },
  map: {
    width: '100%',
    height: 400,
    marginBottom: Metrics.baseMargin * 2,
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

function getDistanceFromLatLonInKm(
  { latitude: lat1, longitude: lon1 },
  { latitude: lat2, longitude: lon2 }
) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function getRoundedDistance(coord1, coord2) {
  const distanceInKm = getDistanceFromLatLonInKm(coord1, coord2);
  return Math.round(distanceInKm * 100) * 10;
}

export default class MapScreen extends Component {
  static propTypes = {
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  };
  static defaultProps = {
    points: [
      {
        establishmentType: 'Punto Limpio',
        thrashType: 'Electrónica',
        latitude: 40.3478177,
        longitude: -3.6985403,
      }
    ],
    userCoordinates: {
      latitude: 40.337828,
      longitude: -3.68864,
    },
  };

  componentDidMount() {
    this.map.fitToElements(true);
  }

  render () {
    const markers = this.props.points.map(point => ({
      latitude: point.latitude,
      longitude: point.longitude,
      title: 'Hey',
      description: 'tomates',
    }));

    return (
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <MapView
            style={styles.map}
            showsUserLocation
            initialRegion={{
              latitude: this.props.userCoordinates.latitude,
              longitude: this.props.userCoordinates.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            ref={ref => this.map = ref}
          >
            {markers.map((marker, i) => (
              <Marker
                key={i}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                title={marker.title}
                description={marker.description}
              />
            ))}
          </MapView>

          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Text style={styles.emoji}>
              😊 👌
            </Text>

            {this.props.points.map((point, i) => {
              const distance = getRoundedDistance(point, this.props.userCoordinates);

              return (
                <View style={styles.container} key={i}>
                  <Text style={styles.sectionText}>
                    {point.establishmentType || 'punto'} a {distance} metros!
                  </Text>
                  <Text style={styles.subSectionText}>
                    {point.thrashType}
                  </Text>
                </View>
              );
            })}
          </View>
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
