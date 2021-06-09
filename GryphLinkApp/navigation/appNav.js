import React from 'react';
import { View, SafeAreaView, ScrollView, Image, Dimensions } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Home, Courses, Professors, Settings, Professor, Course, AddCourseReview } from '../pages';
const { width } = Dimensions.get('window');

// The side drawer
const CustomDrawerNavigation = (props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ height: 250, opacity: 0.9 }}>
        <View style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={require('../assets/gryphlink_logo.png')} style={{ height: 150, width: 150, borderRadius: 60 }} />
        </View>
      </View>
      <ScrollView>
        <DrawerItems {...props} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Draw layout with each property being a page
export const Drawer = createDrawerNavigator(
  {
    Home: {
      screen: Home,
    },
    Courses: {
      screen: Courses,
    },
    Professors: {
      screen: Professors,
    },
    Settings: {
      screen: Settings,
    },
    Professor: {
      screen: Professor,
      navigationOptions: {
        drawerLabel: () => null, // Do not include in drawer
      },
    },
    Course: {
      screen: Course,
      navigationOptions: {
        drawerLabel: () => null, // Do not include in drawer
      },
    },
    AddCourseReview: {
      screen: AddCourseReview,
      navigationOptions: {
        drawerLabel: () => null, // Do not include in drawer
      },
    },
  },
  {
    drawerPosition: 'left',
    contentComponent: CustomDrawerNavigation,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerWidth: (width / 3) * 2,
  }
);
