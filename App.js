/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 0.0,
      longitude: 0.0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      width: 200,
      height: 200,
      permitted: false,
      markers: [
        {latitude: 6.466129, longitude: 7.5739056, description: 'marker 1'},
        {latitude: 6.4660711, longitude: 7.573977, description: 'marker 2'},
        {latitude: 6.4660346, longitude: 7.5737508, description: 'marker 3'},
        {latitude: 6.4657515, longitude: 7.5735977, description: 'marker 4'},
        {latitude: 6.466149, longitude: 7.5739146, description: 'marker 5'},
      ],
    };
  }

  getInitialState(currentPosition = false) {
    let lat = 0.0;
    let long = 0.0;

    if (!currentPosition) {
      lat = 9.082;
      long = 8.6753;
      this.setState({latitude: lat, longitude: long});
    }
    return {
      latitude: lat,
      longitude: long,
      latitudeDelta: 0.0000,
      longitudeDelta: 0.0005,
    };
  }

  async componentDidMount() {
    await this.requestLocationPermission();
    this.onRegionChange(this.getInitialState(false));

    this.setState({
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height - 100,
    });
    this.getCurrentLocation();
    // alert('mount' + JSON.stringify(this.getInitialState()));
  }

  onRegionChange(
    region = undefined,
    latitude = undefined,
    longitude = undefined,
  ) {
    console.log('prev Location ', this.state.latitude, this.state.longitude);
    if (region != undefined) {
      this.setState({
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      });
    } else if ((latitude != undefined, (longitude = undefined))) {
      this.setState({latitude: latitude, longitude: longitude});
    }

    console.log('Location ', this.state.latitude, this.state.longitude);
    // alert('Region Change' + JSON.stringify(region));
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'LaundryApp needs access to your Location ' +
            'so you can take orders.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
        this.setState({permitted: true});
        // this.getCurrentLocation();
      } else {
        console.log('Location permission denied');
        this.setState({permitted: false});
      }
    } catch (err) {
      console.warn(err);
    }
  }

  getCurrentLocation() {
    if (this.state.permitted) {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          console.log(
            'prev Location ',
            this.state.latitude,
            this.state.longitude,
          );
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          console.log('Location ', this.state.latitude, this.state.longitude);
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
          return {
            success: false,
          };
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else {
      return {
        success: false,
      };
    }
  }
// onRegionChange={this.onRegionChange.bind(this)}>
  render() {
    console.log('rendering');
    return (
      <MapView
        style={{width: this.state.width, height: this.state.height}}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        initialRegion={{
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: this.state.latitudeDelta,
          longitudeDelta: this.state.longitudeDelta,
        }}
        region={{
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: this.state.latitudeDelta,
          longitudeDelta: this.state.longitudeDelta,
        }}
        >
        <Marker
          key={0}
          coordinate={{
            latitude: 6.466129,
            longitude: 7.5739056,
          }}
          title="Nigeria"
          description={'Description'}
          image={require('./src/assets/images/washingmachine.png')}
        />
        {this.renderMarkers()}
      </MapView>
    );
  }

  renderMarkers() {
    return this.state.markers.map(marker => {
      return (
        <Marker
          key={marker.description}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title="Nigeria"
          description={marker.description}
          image={require('./src/assets/images/washingmachine.png')}
        />
      );
    });
  }
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: 0,
    height: 0,
  },
});

export default App;
