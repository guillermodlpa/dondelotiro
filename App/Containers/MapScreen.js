import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Text, Image, View, Button } from 'react-native'
import { Images, Metrics, ApplicationStyles } from '../Themes'

import { StyleSheet } from 'react-native'

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
    fontSize: 45,
  },
});

export default class MapScreen extends Component {
  static propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number,
  };
  static defaultProps = {
    lat: 40,
    lng: -3,
  };

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={{ width: '100%', height: 400, backgroundColor: '#345' }} >
          <Text style={styles.sectionText}>
            {this.props.lat} {this.props.lng}
          </Text>
        </View>

        <Text style={styles.sectionText}>
          El punto más cercano está a 500 metros!
        </Text>

        <Text style={styles.emoji}>
          😊
        </Text>

        <Button
          block
          style={styles.button}
          onPress={() => this.props.navigation.goBack()}
          title={'Back'}
        />
      </View>
    )

    // return (
    //   <View style={styles.mainContainer}>
    //     <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
    //     <ScrollView style={styles.container}>
    //       <View style={styles.centered}>
    //         <Image source={Images.launch} style={styles.logo} />
    //       </View>

    //       <View style={styles.section} >
    //         <Image source={Images.ready} />
    //         <Text style={styles.sectionText}>
    //           This probably isn't what your app is going to look like. Unless your designer handed you this screen and, in that case, congrats! You're ready to ship. For everyone else, this is where you'll see a live preview of your fully functioning app using Ignite.
    //         </Text>
    //       </View>

    //     </ScrollView>
    //   </View>
    // )
  }
}
