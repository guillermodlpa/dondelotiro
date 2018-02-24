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

export default DondeLoTiroButton = (props) => {
    const {
        disabled,
        children,
        secondary,
        ...restProps
    } = props;

    return (
        <TouchableHighlight
            {...restProps}
            style={{
                alignSelf: 'flex-end',
                width: '100%',
                padding: 20,
                backgroundColor: secondary ? '#764682' : '#EF5411',
                opacity: disabled ? 0.4 : 1,
            }}
        >
            {children}
        </TouchableHighlight>
    );
};

DondeLoTiroButton.innerTextStyles = {
    textAlign: 'center',
    color: Colors.snow,
    fontSize: 23,
};
