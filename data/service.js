const connection = require('../connection/connection');
const programs = require('./department-programs.json');
const locations = require('./locations.json');

const LOCATIONS = locations;
const RESPONSE_TABLE = 'surveyResponse';
const SURVEYS_TABLE = 'tbl_surveys';

const MOCK_LOCATIONS = [{ uuid: "08feae7c-1352-11df-a1f1-0026b9348838", name: "Location-1" },
{ uuid: "00b47ef5-a29b-40a2-a7f4-6851df8d6532", name: "Location-2" },
{ uuid: "79fcf21c-8a00-44ba-9555-dde4dd877c4a", name: "Location-3" },
{ uuid: "6cd0b441-d644-487c-8466-5820a73f9ce5", name: "Location-4" }];


function getAllDeparts() {
  return new Promise((resolve, reject) => {
    var data = programs;
    resolve(data);
  })
}

const surveyEncounter_query_constructor = (surveyEncounterInfo) => {
  const surveyEncounter_query = `INSERT INTO surveyEncounter
                                  (surveyId, location, date) VALUES
                                  ('${surveyEncounterInfo.surveyId}',
                                   '${surveyEncounterInfo.location}',
                                   '${surveyEncounterInfo.date}')`
  return surveyEncounter_query;
};

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function getSurveysObject(selected_uuids, surveyId) {
  var finalData = {};
  var objectInner = {};
  objectInner['showCompletedPage'] = false;
  objectInner['showProgressBar'] = 'bottom';
  objectInner['pages'] = {};
  let pages = [];
  var surveys = [];
  return new Promise((resolve, reject) => {
    getSurveys(surveyId).then((res) => {
      res.surveys.forEach((val) => {
        surveys.push(val);
      })
      surveys.forEach((dat) => {
        dat.pages.forEach((el) => {
          for (var selectedId of selected_uuids) {
            if (el.programuuid && (el.programuuid == selectedId)) {
              pages.push(el);
            }
          }
        })
      })
      objectInner.pages = pages;
      finalData = { 'survey': objectInner };
      resolve(finalData);
    }).catch(function (err) {
      console.log('getSurveysObject error', err);
      reject(err);
    });
  })
}

function getSurveyPrograms(surveyId) {
  var dataObject = programs;
  var surveys = [];
  var surveyPrograms = [];
  var allPrograms = [];
  var unique = [];
  return new Promise((resolve, reject) => {
    getSurveys(surveyId).then((res) => {
      console.log('res', res);
      res.surveys.forEach((data) => {
        surveys.push(data);
      })
      surveys.forEach((element) => {
        element.pages.forEach((el) => {
          if (el.programuuid) {
            surveyPrograms.push(el.programuuid);
          }
        })
      })
      unique = surveyPrograms.filter(onlyUnique);
      dataObject.departments.forEach((dept) => {
        dept.programs.forEach((prog) => {
          for (var progId of unique) {
            if (progId == prog.uuid) {
              allPrograms.push({ deptname: dept.name, deptuuid: dept.uuid, proguuid: prog.uuid, progname: prog.name })
            }
          }
        })
      })
      resolve(allPrograms);
    }).catch(function (err) {
      console.log('getSurveyPrograms error', err);
      reject(err);
    });
  })
}

function getDepartments(surveyId) {
  var value = [];
  return new Promise((resolve, reject) => {
    getSurveyPrograms(surveyId).then((data) => {
      for (var i of data) {
        var finalArray = {};
        finalArray['deptuuid'] = i.deptuuid;
        finalArray['deptname'] = i.deptname;
        finalArray['programs'] = {}
        value.push(finalArray);
      }
      resolve(value);
    }).catch(function (err) {
      console.log('getDepartments error', err);
      reject(err);
    });
  })
}

function getSurveys(id) {
  return new Promise((resolve, reject) => {
    connection.executeQuery('SELECT * FROM ' + SURVEYS_TABLE + ' WHERE survey_id= "' + id + '"', (err, results, fields) => {
      if (err) {
        console.log('get surveys erros', err);
        reject(err);
      } else {
        var data = results[0];
        /*var returnData = {
            id: data.survey_id,
            version: data.version,
            name: data.name,
            survey: JSON.parse(data.survey),
            date_created: data.date_created,
            created_by: data.created_by,
            retired: data.retired,
            date_retired: data.date_retired,
            retired_by: data.retired_by,
            published: data.published,
            description: data.description
        }*/
        resolve(JSON.parse(data.survey));
      }
    });
  });
}

function saveSurvey(data) {
  var rawData = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    connection.executeQuery("INSERT INTO " + SURVEYS_TABLE + "  (`version`, `name`, `survey`, `date_created`, `created_by`, `retired`, `date_retired`, `retired_by`, `published`, `description`)" +
      "VALUES ('1.0.1', 'test', ? , '2018-09-24', 'jess', 1, '2018-09-24', 'jess', 1, 'test survey')", rawData, (err, success) => {
        if (err) {
          console.log('saveSurvey error', err);
          reject(err);
        } else {
          resolve(success);
        }
      });
  });
}

function getQuizes(programId) {
  return new Promise((resolve, reject) => {
    connection.executeQuery("SELECT * FROM " + RESPONSE_TABLE + " WHERE program_uuid IN ('" + programId + "') GROUP BY question", (err, results, programId) => {
      if (err) {
        console.log('get quizes error', err);
        reject(err);
      } else {
        var querry_data = [];
        for (var i = 0; i < results.length; i++) {
          var data = results[i];
          querry_data.push({
            question: data.question
          });
        }
        resolve(querry_data);
      }

    });
  });
}

function getAnswers(programID) {
  return new Promise((resolve, reject) => {
    connection.executeQuery("SELECT question, answer, question_text, COUNT(answer) as counts FROM " + RESPONSE_TABLE + "  WHERE program_uuid IN  ('" + programID + "') GROUP BY question, answer ORDER BY counts desc ", (err, results, fields) => {
      if (err) {
        console.log('get answers', err);
        reject(err);
      } else {
        var querry_data = [];
        for (var i = 0; i < results.length; i++) {
          var data = results[i];
          querry_data.push({
            answer: data.answer,
            question: data.question,
            question_text: data.question_text,
            count: data.counts
          });
        }
        resolve(querry_data);
      }
    })
  })
}
const data = {
  getSurveys: getSurveys,
  getAllDeparts: getAllDeparts,
  LOCATIONS: LOCATIONS,
  MOCK_LOCATIONS: MOCK_LOCATIONS,
  getSurveysObject: getSurveysObject,
  getSurveyPrograms: getSurveyPrograms,
  getDepartments: getDepartments,
  saveSurvey: saveSurvey,
  getQuizes: getQuizes,
  getAnswers: getAnswers,
  surveyEncounter_query_constructor: surveyEncounter_query_constructor
}

module.exports = data;