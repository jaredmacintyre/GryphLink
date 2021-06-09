import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import { Ratings, Reviews } from '../containers';

import Header from '../components/Header';
import { mockRatings, mockReviews } from '../utils/mockData';

class Professor extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Header color="#C20430" title="Professor X" navigation={this.props.navigation} />
        {/* Info */}
        <View style={styles.screenComponent}>
          <Text style={{ paddingLeft: 10 }}>Classes: CIS 4010, CIS 4030, CIS 1500</Text>
        </View>
        {/* Ratings */}
        <View style={styles.screenComponent}>
          <Text style={styles.subheader}>Overall Rating</Text>
          <Divider></Divider>
          <Ratings data={mockRatings}></Ratings>
        </View>
        {/* Reviews */}
        <View style={styles.screenComponent}>
          <Text style={styles.subheader}>Reviews (3)</Text>
          <Divider></Divider>
          <Reviews data={mockReviews}></Reviews>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  screenComponent: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5
  },
  subheader: {
    padding: 10,
    fontWeight: 'bold',
    fontSize: 18
  }
});

export default Professor;
