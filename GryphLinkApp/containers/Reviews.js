import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, Dimensions, View } from 'react-native';
import { Card } from 'react-native-elements';
/*
 * Reviews - Containter to display user reviews
 * @prop: data {Array} - The review data is an array with objects in the following format:
 * {
 *   id: '1',
 *   text:
 *     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lorem elit, ultricies vitae est sit amet, ullamcorper maximus risus. Nunc non lacinia justo. Phasellus sed augue a purus ornare placerat. Nulla eu pharetra mi. Aliquam auctor nisi in metus rhoncus pharetra. Ut risus nibh, pulvinar sed pharetra quis, fringilla in enim. Sed lacinia condimentum elit sed malesuada. Nam ipsum nulla, dignissim at felis id, interdum efficitur felis. Nulla id tincidunt nisi, sit amet sagittis nunc. Quisque quis sapien fermentum, ultricies nisl quis, maximus lorem. Cras ornare interdum tortor ut iaculis. Aliquam lacinia nisi tortor, molestie imperdiet urna ultrices sit amet. Mauris faucibus sed massa convallis facilisis.',
 *   ratings: [
 *     {
 *       id: '1',
 *       name: 'Easiness',
 *       value: 4,
 *     },
 *     {
 *       id: '2',
 *       name: 'Usefulness',
 *       value: 3,
 *     },
 *     {
 *       id: '3',
 *       name: 'Enjoyability',
 *       value: 5
 *     }
 *   ],
 * },
 */
class Reviews extends React.Component {
  static propTypes = {
    data: PropTypes.array,
  };

  render() {
    const { data } = this.props;

    return (
      <View contentContainerStyle={styles.container}>
        {data
          ? data.map((review) => {
              return (
                <Card containerStyle={styles.cardStyle} key={review.id}>
                  {/* Ratings at top */}
                  {review.ratings ? (
                    <View style={styles.ratings}>
                      {review.ratings.map((rating) => {
                        return (
                          <View key={rating.id}>
                            <Text style={{ fontWeight: 'bold' }}>{rating.name}</Text>
                            <Text style={{ alignSelf: 'center' }}>{rating.value}</Text>
                          </View>
                        );
                      })}
                    </View>
                  ) : null}
                  {/* Review text */}
                  {review.text ? (
                    <View style={styles.reviewText}>
                      <Text numberOfLines={3}>{review.text}</Text>
                    </View>
                  ) : null}
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
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  cardStyle: {
    flex: 1,
    width: Dimensions.get('window').width * 0.88,
  },
  ratings: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
  },
  reviewText: {
    justifyContent: 'center',
  },
  border: {
    borderWidth: 1, // Remove Border
    shadowColor: 'rgba(1,1,1, 0.0)', // Remove Shadow IOS
  },
});

export default Reviews;
