import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'
import DondeLoTiroToast from '../Components/DondeLoTiroToast'

// Styles
import styles from './Styles/RootContainerStyles'

const barStyles = {
  LaunchScreen: 'light-content',
  MapScreen: 'dark-content',
  default: 'light-content',
};

class RootContainer extends Component {
  state = { showThankYouToast: false };

  componentDidMount() {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.screen === 'MapScreen' && this.props.screen === 'LaunchScreen') {
      this.setState({ showThankYouToast: true });
    }

    setTimeout(() => {
      this.setState({ showThankYouToast: false });
    }, 10000);
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle={barStyles[this.props.screen] || barStyles.default} />
        <ReduxNavigation />

        {this.state.showThankYouToast && (
          <DondeLoTiroToast />
        )}
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
