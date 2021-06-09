import React from 'react';
import _ from 'lodash';
import { View, StyleSheet, Text, TextInput, Button } from 'react-native';
import { gryphRed } from '../utils/colors';
import Header from '../components/Header';
import RadioGroup from 'react-native-radio-buttons-group';
import * as FileSystem from 'expo-file-system';

/*
 * AddCourseReview - Page to add a review for a course
 *
 * @state: courseCode {string} - The current course code being viewed
 * @state: easiness {number} - The current easiness rating
 * @state: usefulness {number} - The current usefulness rating
 * @state: enjoyability {number} - The current enjoyability rating
 * @state: description {string} - The current description
 * @state: courseCode {string} - The course code for the course being reviewed
 * @state: coursesData {object} - The course data including the general info and reviews
 * @state: courseData {object} - The course data including the general info and reviews
 * @state: courseRatings {array} - Collection of all the course ratings
 */
class AddCourseReview extends React.Component {
  state = {
    easiness: 0,
    usefulness: 0,
    enjoyability: 0,
    description: '',
    courseCode: '',
    coursesData: [],
  };

  // Changing the current easiness rating
  _changeEasiness = (radioValues) => {
    const easiness = _.find(radioValues, ['selected', true]).value;
    this.setState({ easiness });
  };

  // Changing the current enjoyability rating
  _changeEnjoyability = (radioValues) => {
    const enjoyability = _.find(radioValues, ['selected', true]).value;
    this.setState({ enjoyability });
  };

  // Changing the current usefulness rating
  _changeUsefulness = (radioValues) => {
    const usefulness = _.find(radioValues, ['selected', true]).value;
    this.setState({ usefulness });
  };

  // Submitting a review by adding it to local storage
  _submitForm = () => {
    let coursesData = _.cloneDeep(this.state.coursesData);

    _.forEach(coursesData, (section) => {
      _.forEach(section.sectionCourses, (course) => {
        if (_.get(course, 'CourseCode') === this.state.courseCode) {
          const currentReviews = _.get(course, 'Reviews');
          const review = {
            id: currentReviews.length,
            text: this.state.description,
            ratings: [
              {
                id: '1',
                name: 'Easiness',
                value: this.state.easiness,
              },
              {
                id: '2',
                name: 'Usefulness',
                value: this.state.usefulness,
              },
              {
                id: '3',
                name: 'Enjoyability',
                value: this.state.enjoyability,
              },
            ],
          };

          _.get(course, 'Reviews').push(review);
        }
      });
    });

    FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'courses.json', JSON.stringify(coursesData))
      .then(() => {
        this.props.navigation.navigate('Course', {
          courseCode: this.state.courseCode,
        });
      })
      .catch((error) => {
        console.log('ERROR: ', error);
      });
  };

  // Reset form data when receiving new props
  UNSAFE_componentWillReceiveProps() {
    FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'courses.json').then((data) => {
      this.setState({ coursesData: JSON.parse(data) });

      const courseCode = this.props.navigation.state.params.courseCode;

      this.setState({ description: null, courseCode });
    });
  }

  // Get course data and set state on initial load
  componentDidMount() {
    FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'courses.json').then((data) => {
      this.setState({ coursesData: JSON.parse(data) });
    });

    const courseCode = this.props.navigation.state.params.courseCode;

    this.setState({ easiness: 1, usefulness: 1, enjoyability: 1, description: null, courseCode });
  }

  render() {
    const radioValues = [
      { value: 1, label: '1' },
      { value: 2, label: '2' },
      { value: 3, label: '3' },
      { value: 4, label: '4' },
      { value: 5, label: '5' },
    ];
    let easinessValues = _.cloneDeep(radioValues);
    let usefulnessValues = _.cloneDeep(radioValues);
    let enjoyabilityValues = _.cloneDeep(radioValues);

    const title = 'Reviewing: ' + this.state.courseCode;

    return (
      <View style={styles.container}>
        <Header color={gryphRed} size={20} title={title} backScreen="Course" navigation={this.props.navigation} />
        <View style={styles.screenComponent}>
          <View style={styles.formItem}>
            <Text style={styles.formTitle}>
              Easiness <Text style={styles.formRequired}>*</Text>
            </Text>
            <RadioGroup radioButtons={easinessValues} onPress={this._changeEasiness} flexDirection="row" />
          </View>
          <View style={styles.formItem}>
            <Text style={styles.formTitle}>
              Usefulness <Text style={styles.formRequired}>*</Text>
            </Text>
            <RadioGroup radioButtons={usefulnessValues} onPress={this._changeUsefulness} flexDirection="row" />
          </View>
          <View style={styles.formItem}>
            <Text style={styles.formTitle}>
              Enjoyability <Text style={styles.formRequired}>*</Text>
            </Text>
            <RadioGroup radioButtons={enjoyabilityValues} onPress={this._changeEnjoyability} flexDirection="row" />
          </View>
          <View style={styles.formItem}>
            <Text style={styles.formTitle}>Comments </Text>
            <TextInput
              style={{ height: 150, padding: 10, borderColor: 'gray', borderWidth: 1 }}
              multiline={true}
              numberOfLines={4}
              onChangeText={(description) => this.setState({ description })}
              value={this.state.description}
              blurOnSubmit
            />
          </View>
          <View style={styles.formItem}>
            <Button title="Submit" onPress={this._submitForm} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 150,
  },
  screenComponent: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
  },
  formItem: {
    padding: 10,
  },
  formTitle: {
    paddingBottom: 10,
    fontWeight: 'bold',
    fontSize: 24,
    alignSelf: 'center',
  },
  formRequired: {
    color: 'red',
    paddingBottom: 10,
    fontWeight: 'bold',
    fontSize: 24,
  },
});

export default AddCourseReview;
