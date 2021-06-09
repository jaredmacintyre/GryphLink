import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { Card } from 'react-native-elements';
/*
 * Ratings - containter to display ratings
 *
 * @prop: data {Array} - The rating data in the following format:
 *   {
 *     id: '1',
 *     name: 'Easiness',
 *     value: 4.5,
 *   },
 *   {
 *     id: '2',
 *     name: 'Usefulness',
 *     value: 3.6,
 *   },
 *   {
 *     id: '3',
 *     name: 'Enjoyability',
 *     value: 2.1,
 *   },
 * ];
 */
class Ratings extends React.Component {
  static propTypes = {
    data: PropTypes.array,
  };

  render() {
    const { data } = this.props;
    return (
      <View style={styles.container}>
        {/* If data exists, loop through each object and display it */}
        {data
          ? data.map((rating) => {
              return (
                <Card containerStyle={styles.cardStyle} key={rating.id}>
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: 16, paddingBottom: 5 }}>
                      {rating.name}
                    </Text>
                    {/* The circle to display individual ratings */}
                    <TouchableHighlight
                      style={{
                        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 5,
                        width: Dimensions.get('window').width * 0.2,
                        height: Dimensions.get('window').width * 0.2,
                        backgroundColor: rating.value >= 4.0 ? 'lightgreen' : rating.value < 2.5 ? 'red' : 'yellow',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontWeight: 'bold', fontSize: 20 }}> {rating.value}</Text>
                    </TouchableHighlight>
                  </View>
                </Card>
              );
            })
          : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardStyle: {
    flex: 1,
    flexBasis: Dimensions.get('window').width * 0.3,
    borderWidth: 0, // Remove Border
    shadowColor: 'rgba(0,0,0, 0.0)', // Remove Shadow IOS
  },
});

export default Ratings;
