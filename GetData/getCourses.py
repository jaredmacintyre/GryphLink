import requests
import json
import re
from bs4 import BeautifulSoup
from html.parser import HTMLParser

key = 1
keySection = 1

class MLStripper(HTMLParser):
    def __init__(self):
        self.reset()
        self.strict = False
        self.convert_charrefs= True
        self.fed = []
    def handle_data(self, d):
        self.fed.append(d)
    def get_data(self):
        return ''.join(self.fed)

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    info = s.get_data()
    info = re.sub(" +", " ", info)
    info = re.sub("\n", " ", info)
    return info


def column(i):
    switcher={
        "Offering(s):": 0,
        "Co-requisite(s):": 1,
        "Prerequisite(s):": 2,
        "Equate(s):": 3,
        "Restriction(s):": 4,
        "Department(s):": 5
    }
    return switcher.get(i,9)

def getItems(ths, tds, dict):
    col = ["Offering(s):", "Co-requisite(s):", "Prerequisite(s):", "Equate(s):", "Restriction(s):", "Department(s):"]

    #print(ths)

    for i in range (len(ths)):
        temp = re.findall('">.+?<', ths[i])
        th = temp[0][2:len(temp[0])-1]

        index = column(th)
        if(index != 9):
            dict[col[index]] = strip_tags(tds[i])
        else:
            dict["Other:"] = th + " " + strip_tags(tds[i])
            print(th + " " + strip_tags(tds[i]))

def convertToStr(doMe):
    paragraphs = []
    for c in doMe:
        paragraphs.append(str(c))
    return paragraphs

def getTitleInfo(ths):
    global key
    temp = re.findall('">[^<].+?<', ths[0])
    info = temp[0][2:len(temp[0])-1]
    list = info.split(" ")
    l = len(list)

    dict = {'key' : key, 'CourseCode' :list[0], 'CourseName' : " ".join(list[1:l-3]), 'OfferedDuring' : list[l-3], 'ContactHours' : list[l-2], 'CreditWeight' : list[l-1], "Reviews" : []}

    key += 1
    return list[0].split("*"), dict

def getDescription(tds, dict):
    info = strip_tags(tds[0])
    info = re.sub(" +", " ", info)
    info = re.sub("\n", " ", info)
    dict["Description"] = info

def getCategory(URL, section):
    global keySection
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser')
    results = soup.find(id='content')

    courses = results.find_all('div', class_='course')

    columns = ["Offering(s):", "Co-requisite(s):", "Prerequisite(s):", "Equate(s):", "Restriction(s):", "Department(s):"]

    coursesDict = {"key" : keySection, "sectionTitle" : section, "sectionAbbr" : "", "sectionCourses" : []}
    keySection += 1

    for p in courses:
        trs = p.find_all('tr')
        count = 0
        course = ""
        d = {}
        for tr in trs:
            ths = convertToStr(tr.find_all('th'))
            tds = convertToStr(tr.find_all('td'))

            if(count == 0):
                course, d = getTitleInfo(ths)
                coursesDict["sectionAbbr"] = course[0]
            elif(count == 1):
                getDescription(tds, d)
            else:
                getItems(ths, tds, d)

            count += 1
        coursesDict["sectionCourses"].append(d)
    return coursesDict

URL = 'https://www.uoguelph.ca/registrar/calendars/undergraduate/current/c12/index.shtml'
page = requests.get(URL)

soup = BeautifulSoup(page.content, 'html.parser')

results = soup.find(id='sidebar')

courses = results.find_all('li')
paragraphs = []

for x in courses:
    paragraphs.append(str(x))

listCourse = []
for course in paragraphs:
    if('<li><a href="./c12' in course ):
        name = re.findall('">.+?<', course)
        n = name[0][2:len(name[0])-1]
        #print(course)
        c = re.findall('".+?"', course)
        d = c[0][2:len(c[0])-1]

        courseLink = ("https://www.uoguelph.ca/registrar/calendars/undergraduate/current/c12" + d)
        mini = [n, courseLink]
        listCourse.append(mini)

#
main = []
for item in listCourse:
    print(f"\n{item[0]}:")
    coursesDict = getCategory(item[1], item[0])
    main.append(coursesDict)


print("\n\nAll Done\nGoing to File")
#print(coursesDict)

with open('courses.txt', 'w') as json_file:
    json.dump(main, json_file)
