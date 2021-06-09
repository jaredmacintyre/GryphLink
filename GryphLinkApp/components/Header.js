import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'native-base';
import { Header } from 'react-native-elements';
import { Text } from 'react-native';

/*
 * Header - Component for the header of each page of the app
 *
 * @prop: navigation - The app's navigation module
 * @prop: color - {string} The background color of the header
 * @prop: courseCode - {string} The course that the review button on the Course screen will go too
 * @prop: professorKey - {string} The key for the professor
 * @prop: canReview - {bool} Whether the review button should show or not
 * @prop: backScreen - {string} The screen the backarrow will go to (if not included there will be a menu button)
 * @prop: typeOfReview - {string} - Type of review ('Course' or 'Professor')
 * @prop: size - {number} - Size of header title text
 */
export default class CustomHeader extends React.Component {
  static propTypes = {
    color: PropTypes.string,
    backScreen: PropTypes.string,
    courseCode: PropTypes.string,
    professorKey: PropTypes.string,
    canReview: PropTypes.bool,
    typeOfReview: PropTypes.string,
    size: PropTypes.number,
  };

  addReview = () => {
    // Go to review page depending on typeOfReview prop
    if (this.props.typeOfReview == 'Course') {
      this.props.navigation.navigate('AddCourseReview', {
        courseCode: this.props.courseCode,
      });
    } else if (this.props.typeOfReview == 'Professor') {
      // this.props.navigation.navigate('AddReview', {
      //   type: 'Professor',
      //   course: this.props.professorData,
      // });
    }
  };

  render() {
    return (
      <Header
        // Back arrow in header if a backscreen is included as a prop
        leftComponent={
          this.props.backScreen ? (
            <Icon
              name="md-arrow-round-back"
              style={{ color: 'white' }}
              onPress={() => this.props.navigation.navigate(this.props.backScreen)}
            />
          ) : (
            <Icon name="menu" style={{ color: 'white' }} onPress={() => this.props.navigation.openDrawer()} />
          )
        }
        // Title in the center of header
        centerComponent={{
          text: this.props.title,
          style: { fontSize: this.props.size ? this.props.size : 24, fontWeight: 'bold', color: 'white' },
        }}
        // Review button if page can be reviewed
        rightComponent={
          this.props.canReview ? (
            <Text onPress={this.addReview} style={{ fontSize: 16, color: 'white', marginRight: 15 }}>
              Review
            </Text>
          ) : null
        }
        backgroundColor={this.props.color}
      />
    );
  }
}
