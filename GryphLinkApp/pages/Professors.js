import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import _ from 'lodash';
import * as FileSystem from 'expo-file-system';
import { SearchBar } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import Spinner from 'react-native-loading-spinner-overlay';

import Header from '../components/Header';
import { gryphRed } from '../utils/colors';

/*
 * Professors - Page to provide overview of all sections and courses in the courses data retreived from webadvisor
 *
 * @state: search {string} - Current search thing
 * @state: professorsData {array of objects} - The course data including the general info and reviews
 * @state: filteredData {array of objects} - A subset of the courseData based on the search string
 * @state: activeSections {array} - Array of indexes of what to show as open in the accordian
 * @state: loading {bool} - A loading flag for the page
 */
class Professors extends React.Component {
  state = {
    search: '',
    professorsData: [],
    filteredData: [],
    activeSections: [],
    loading: false,
  };

  // Update the current search as well as current array of filtered data
  updateSearch = (search) => {
    this.setState({ loading: true });
    // Filter professorsData
    let filteredData = _.cloneDeep(this.state.professorsData);
    filteredData = _.filter(filteredData, (professor) => {
      return _.get(professor, 'FirstName').includes(search) || _.get(professor, 'LastName').includes(search);
    });

    this.setState({ search, filteredData, loading: false });
  };

  // When a course is clicked, go to that course page
  getSectionListItem = (professorData) => {
    //Function for click on an item
    this.props.navigation.navigate('Professor', {
      professorName: _.get(professorData, 'ProfessorName'),
    });
  };

  // On inital loading, load the courses and display the loader until it is finished
  componentDidMount() {
    this.setState({ loading: true });
    FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'professors.json').then((data) => {
      let filteredData;
      filteredData = _.cloneDeep(JSON.parse(data));

      this.setState({ professorsData: JSON.parse(data), filteredData, loading: false });
    });
  }

  // The header for each section component in accordian
  _renderHeader = (section) => {
    return (
      <View style={styles.SectionHeaderStyle}>
        <Text style={styles.SectionHeaderTitleStyle}> {section.name} </Text>
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
                  <Text style={styles.SectionListItemStyle} onPress={this.getSectionListItem.bind(this, course)}>
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
        <Header color={gryphRed} title="Professors" navigation={this.props.navigation} />
        <View>
          <SearchBar platform="ios" placeholder="Search for a professor..." onChangeText={this.updateSearch} value={search} />
        </View>

        <ScrollView style={styles.container}>
          <Spinner visible={this.state.loading} textContent={'Loading...'} textStyle={{ color: '#FFF' }} />
          <Accordion
            activeSections={this.state.activeSections}
            sections={
              !_.isEmpty(this.state.filteredData)
                ? this.state.filteredData.map((professor) => {
                    return {
                      key: professor.Key,
                      name: professor.FirstName + ' ' + professor.LastName,
                      courses: professor.Courses,
                    };
                  })
                : []
            }
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
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

export default Professors;
