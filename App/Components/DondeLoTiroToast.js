import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-root-toast';

export default DondeLoTiroToast = props => (
    <Toast
        visible
        position={50}
        shadow={false}
        animation={false}
        hideOnPress
    >
        <Text style={{ fontSize: 20 }}>
            🌱🌱🌱🌱{"\n"}
            🌱🌱🌱🌱{"\n"}
            {"\n"}
            🌍{"\n"}
            {"\n"}
            Muchas gracias por contribuir a un mundo más sostenible!
        </Text>
    </Toast>
);

