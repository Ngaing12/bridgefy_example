/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, DeviceEventEmitter, PermissionsAndroid} from 'react-native';
import Bridgefy from 'react-native-bridgefy-sdk'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

console.disableYellowBox = true;

async function requestPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Location Permission',
        'message': 'Activeev needs to access your location.'
      }
    )
    console.log('here', granted);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Location Permitted")
    } else {
      console.log("Location permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}

type Props = {};
export default class App extends Component<Props> {
  componentWillMount() {
    requestPermission()
    console.log('componentWillMount', Bridgefy)
    Bridgefy.init("055a88e3-e730-46a3-b4ae-8154f3bc8000",
      (errorCode, message)=>{
        console.log(errorCode + ":" + message);
      },
      (client) => {
        console.log(client);
        Bridgefy.start();

      }
    );

    DeviceEventEmitter.addListener('onMessageReceived', (message)=> {
        console.log('onMessageReceived: '+ JSON.stringify(message));
      }
    );

    DeviceEventEmitter.addListener('onMessageSent', (message)=> {
        console.log('onMessageSent: '+ JSON.stringify(message));
      }
    );

    DeviceEventEmitter.addListener('onMessageReceivedException', (error)=> {

        console.log('onMessageReceivedException: '+ error);
        console.log('sender: ' + error.sender); // User ID of the sender
        console.log('code: ' + error.code); // error code
        console.log('message' + error.message); // message object empty
        console.log('description' + error.description); // Error cause

      }
    );

    DeviceEventEmitter.addListener('onMessageFailed', (error)=> {
        console.log('onMessageFailed: '+ error);

        console.log('code: ' + error.conde); // error code
        console.log('message' + error.message); // message object
        console.log('description' + error.description); // Error cause

      }
    );

    DeviceEventEmitter.addListener('onBroadcastMessageReceived', (message)=> {
        console.log('onBroadcastMessageReceived: '+ JSON.stringify(message));
        if (message.content.text)
          this.setState((previousState) => {
            return {
              messages: GiftedChat.append(previousState.messages, message.content),
            };
          });
      }
    );

    //
    // BridgefyStateListener
    //

    DeviceEventEmitter.addListener('onStarted', (device)=> {
        console.log('onStarted: '+ JSON.stringify(device));

      var message = {
        content:{ // Custom content
          message:"Hello world!!"
        }
      };
      Bridgefy.sendBroadcastMessage(message);
      console.log('message sent');
      }
    );

    DeviceEventEmitter.addListener('onStartError', (error)=> {
        console.log('onStartError: ', error);
        console.log('code: ', error.conde); // error code
        console.log('description', error.description); // Error cause
      }
    );

    DeviceEventEmitter.addListener('onStopped', ()=> {
        console.log('onStopped');
      }
    );

    DeviceEventEmitter.addListener('onDeviceConnected', (device)=> {
        BridgefyClient.deviceList.push(device);
        console.log('onDeviceConnected: ' + device.DeviceName + " size: " + BridgefyClient.deviceList.length);
      }
    );

    DeviceEventEmitter.addListener('onDeviceLost', (device)=> {
        console.log('onDeviceLost: ' + device);
      }
    );
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
