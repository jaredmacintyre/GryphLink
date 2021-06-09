import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import _ from 'lodash';
import { Icon } from 'native-base';
import * as FileSystem from 'expo-file-system';
import { SearchBar } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import Spinner from 'react-native-loading-spinner-overlay';

import Header from '../components/Header';
import { gryphRed } from '../utils/colors';

/*
 * Courses - Page to provide overview of all sections and courses in the courses data retreived from webadvisor
 *
 * @state: search {string} - Current search thing
 * @state: coursesData {array of objects} - The course data including the general info and reviews
 * @state: filteredData {array of objects} - A subset of the courseData based on the search string
 * @state: activeSections {array} - Array of indexes of what to show as open in the accordian
 * @state: loading {bool} - A loading flag for the page
 */
class Courses extends React.Component {
  state = {
    search: '',
    coursesData: [],
    filteredData: [],
    activeSections: [],
    loading: false,
  };

  // Update the current search as well as current array of filtered data
  updateSearch = (search) => {
    this.setState({ loading: true });
    // Filter coursesData
    let filteredData = _.cloneDeep(this.state.coursesData);
    _.forEach(filteredData, (section) => {
      section.sectionCourses = _.filter(section.sectionCourses, (course) => {
        return _.get(course, 'CourseName').includes(search) || _.get(course, 'CourseCode').includes(search);
      });
    });
    filteredData = _.filter(filteredData, (section) => !_.isEmpty(_.get(section, 'sectionCourses')));

    this.setState({ search, filteredData, loading: false });
  };

  // When a course is clicked, go to that course page
  goToCourse = (courseData) => {
    //Function for click on an item
    this.props.navigation.navigate('Course', {
      courseCode: _.get(courseData, 'CourseCode'),
    });
  };

  // On inital loading, load the courses and display the loader until it is finished
  componentDidMount() {
    this.setState({ loading: true });
    FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'courses.json').then((data) => {
      let filteredData;
      filteredData = _.cloneDeep(JSON.parse(data));

      this.setState({ coursesData: JSON.parse(data), filteredData, loading: false });
    });
  }

  // The header for each section component in accordian
  _renderHeader = (section) => {
    const index = _.findIndex(this.state.filteredData, ['key', section.key]);
    const open = _.includes(this.state.activeSections, index);
    return (
      <View style={styles.SectionHeaderStyle}>
        <Text style={styles.SectionHeaderTitleStyle}> {section.title} </Text>
        {open ? (
          <Icon type="FontAwesome" style={styles.SectionHeaderIconStyle} name="chevron-up" />
        ) : (
          <Icon type="FontAwesome" style={styles.SectionHeaderIconStyle} name="chevron-down" />
        )}
      </View>
    );
  };

  // The content of each section component in accordian (Seen when dropped down)
  _renderContent = (section) => {
    return (
      <View>
        {_.get(section, 'data')
          ? _.get(section, 'data').map((course) => {
              return (
                <View style={styles.SectionListElement} key={_.get(course, 'key')}>
                  <Text style={styles.SectionListItemStyle} onPress={this.goToCourse.bind(this, course)}>
                    {_.get(course, 'CourseCode') + ' - ' + _.get(course, 'CourseName')}
                  </Text>
                </View>
              );
            })
          : null}
      </View>
    );
  };

  // Update which accordians are open
  _updateSections = (activeSections) => {
    this.setState({ activeSections });
  };

  render() {
    const { search } = this.state;

    return (
      <View style={styles.container}>
        <Header color={gryphRed} title="Courses" navigation={this.props.navigation} />
        <View>
          <SearchBar platform="ios" placeholder="Search for a course..." onChangeText={this.updateSearch} value={search} />
        </View>

        <ScrollView style={styles.container}>
          <Spinner visible={this.state.loading} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
          {/* List of course sections with dropdown capabilites */}
          <Accordion
            activeSections={this.state.activeSections}
            sections={
              !_.isEmpty(this.state.filteredData)
                ? this.state.filteredData.map((section) => {
                    return {
                      key: section.key,
                      title: section.sectionTitle,
                      data: section.sectionCourses,
                    };
                  })
                : []
            }
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            onChange={this._updateSections}
            expandMultiple
          ></Accordion>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  bigRed: {
    color: gryphRed,
    fontWeight: 'bold',
    fontSize: 30,
  },
  SectionHeaderStyle: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: gryphRed,
    justifyContent: 'space-between',
    padding: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
  SectionHeaderTitleStyle: {
    fontSize: 20,
    color: '#fff',
  },
  SectionListItemStyle: {
    fontSize: 15,
    padding: 15,
    color: '#000',
    backgroundColor: '#F5F5F5',
  },
  SectionHeaderIconStyle: {
    color: 'white',
    fontSize: 20,
  },
  SectionListElement: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
});

export default Courses;
