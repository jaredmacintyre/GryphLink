#!/usr/bin/env python

import csv
import sys
import pprint
import random
import json

courses = list(range(1, 1814))
random.shuffle(courses)
key = 0

def getCourses():
    global courses
    x = random.randrange(1,4)
    list = []
    for i in range(x):
        key = courses.pop()
        list.append(str(key))
    return list

# Function to convert a csv file to a list of dictionaries.  Takes in one variable called &quot;variables_file&quot;

def csv_dict_list(variables_file):
    # Open variable-based csv, iterate over the rows and map values to a list of dictionaries containing key/value pairs

    reader = csv.DictReader(open("names.csv"))
    dict_list = []
    for line in reader:
        line["Courses"] = getCourses()
        line["Reviews"] = []
        dict_list.append(line)
    return dict_list

# Calls the csv_dict_list function, passing the named csv

device_values = csv_dict_list("test.csv")

pprint.pprint(device_values)

with open('profs.txt', 'w') as json_file:
    json.dump(device_values, json_file)
# Prints the results nice and pretty like
