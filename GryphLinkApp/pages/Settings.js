import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { gryphRed } from '../utils/colors';

class Settings extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Header color={gryphRed} title="Settings" navigation={this.props.navigation} />
        <View style={{ flex: 0.1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Settings Page</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Settings;
