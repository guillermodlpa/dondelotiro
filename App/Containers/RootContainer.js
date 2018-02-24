import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'

// Styles
import styles from './Styles/RootContainerStyles'

const barStyles = {
  LaunchScreen: 'light-content',
  MapScreen: 'dark-content',
  default: 'light-content',
};

class RootContainer extends Component {
  componentDidMount () {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle={barStyles[this.props.screen] || barStyles.default} />
        <ReduxNavigation />
      </View>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup())
})

const mapStateToProps = (state) => {
  // console.log('state', state);
  return {
    screen: state.nav.routes[state.nav.index].routeName,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
