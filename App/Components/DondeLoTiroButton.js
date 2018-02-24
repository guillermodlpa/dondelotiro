import React, { Component } from 'react'
import { TouchableHighlight } from 'react-native'

import { Colors, Fonts } from '../Themes'

/** USAGE:
 *

<DondeLoTiroButton onPress={() => this.props.navigation.goBack()}>
    <Text style={DondeLoTiroButton.innerTextStyles}>
        BUSCAR
    </Text>
</DondeLoTiroButton>

 *
 */

export default DondeLoTiroButton = (props) => (
    <TouchableHighlight
        {...props}
        style={{
            alignSelf: 'flex-end',
            width: '100%',
            padding: 20,
            backgroundColor: props.secondary ? '#764682' : '#EF5411',
        }}
    >
        {props.children}
    </TouchableHighlight>
);

DondeLoTiroButton.innerTextStyles = {
    textAlign: 'center',
    color: Colors.snow,
    fontSize: 23,
};
