import React from 'react';
import { View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';
import * as FileSystem from 'expo-file-system';

import Header from '../components/Header';
import { gryphRed } from '../utils/colors';

/*
 * Home - The default home page with buttons to professors and courses
 */
class Home extends React.Component {
  componentDidMount() {
    // If the courses data does not exist locally, download it from azure blob storage account
    FileSystem.getInfoAsync(FileSystem.documentDirectory + 'courses.json').then((result) => {
      if (!result.exists) {
        FileSystem.downloadAsync(
          'https://cis4030lzibdawi.blob.core.windows.net/cis4030/courses.json',
          FileSystem.documentDirectory + 'courses.json'
        ).then(() => console.log('Downloaded courses data locally!'));
      } else {
        console.log('Courses data exists in local storage!');
      }
    });

    // If the professors data does not exist locally, download it from azure blob storage account
    FileSystem.getInfoAsync(FileSystem.documentDirectory + 'professors.json').then((result) => {
      if (!result.exists) {
        FileSystem.downloadAsync(
          'https://cis4030lzibdawi.blob.core.windows.net/cis4030/professors.json',
          FileSystem.documentDirectory + 'professors.json'
        ).then(() => console.log('Downloaded professors data locally!'));
      } else {
        console.log('Professors data exists in local storage!');
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header color={gryphRed} title="Home" navigation={this.props.navigation} />
        <View style={{ height: 200, backgroundColor: 'Green', alignItems: 'center', justifyContent: 'center' }}>
          <Image source={require('../assets/gryphlink_logo.png')} style={{ height: 150, width: 150, borderRadius: 60 }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.title}>Welcome to GryphLink!</Text>
          <Text style={styles.subtitle}>Choose a menu below to get started</Text>
        </View>
        <View style={{ flex: 3, padding: 35 }}>
          <TouchableHighlight style={styles.button} onPress={() => this.props.navigation.navigate('Courses')}>
            <Text style={styles.buttonText}>Courses</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={() => this.props.navigation.navigate('Professors')}>
            <Text style={styles.buttonText}>Professors</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: gryphRed,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 28,
    color: 'white',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 28,
  },
  subtitle: {
    margin: 15,
    fontSize: 16,
  },
});

export default Home;
