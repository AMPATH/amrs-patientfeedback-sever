'use strict';

const request = require('request');
const connection = require('./connection/connection');
const programs = require('./data/department-programs.json');
const service = require('./data/service');
const rawSurvey = require('./data/surveys.json');

function getAllDeparts() {
  var data = programs;
  return data;
}

function testSurvey(surveyId) {
  return service.getSurveys(surveyId)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log('error surveys', err);
      return err;
    })
}
function getSurveys(selected_uuids, surveyId) {
  return service.getSurveysObject(selected_uuids, surveyId)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log('error surveys', err);
      return err;
    })
}

function getSurveyPrograms(surveyId) {
  return service.getSurveyPrograms(surveyId)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log('error surveys', err);
      return err;
    })
}

function getDepartments(surveyId) {
  return service.getDepartments(surveyId)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log('error surveys', err);
      return err;
    })
}

function getQuizes(programId) {
  return service.getQuizes(programId)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log('error surveys', err);
      return err;
    })
}

function getAnswers(programID) {
  return service.getAnswers(programID)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log('error surveys', err);
      return err;
    })
}

function getLocations() {
  var loc_data = [];
  let locations = service.LOCATIONS;
  locations.results.forEach((val) => {
    loc_data.push({ uuid: val.uuid, name: val.display });
  })
  console.log('returned locations');
  return loc_data;
}

function saveTestSurvey(data) {
  return service.saveSurvey(data);
}

function saveEncounter(surveyEncounterInfo) {
  return new Promise((resolve, reject) => {
    let query = service.surveyEncounter_query_constructor(surveyEncounterInfo);
    return connection.executeQuery(query).then((results) => {
      if (results) {
        resolve(results.insertId);
      } else {
        resolve(0);
      }
    }).catch((err) => {
      console.log('save encounter error', err);
      reject(err);
    });
  })

}

function saveResponse(surveyResponse, encounterInfo) {
  var response = new Promise((resolve, reject) => {
    saveEncounter(encounterInfo).then((res) => {
      let promises = [];
      surveyResponse.forEach((data) => {
        let query = 'INSERT INTO surveyResponse (surveyEncounter_surveyEncounterId, question, question_text, answer, program_uuid, department_uuid) VALUES ' +
          "('" + res + "','" + data.name + "', '" + data.title + "', '" + data.answer + "', '" + data.programuuid + "', '" + data.departmentuuid + "')" + ';';
        promises.push(connection.executeQuery(query));
      });
      Promise.all(promises).then((success) => {
        resolve(success);
      });
    });
  });
  return response;
}

module.exports = {
  routesFxn: () => [
    {
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        reply('server running');
      }

    },
    {
      method: 'GET',
      path: '/saveSurvey',
      handler: function (request, reply) {
        reply(service.saveSurvey(rawSurvey));
      }
    },
    {
      method: 'GET',
      path: '/getDepts',
      handler: function (request, reply) {
        reply(getAllDeparts());
      }
    },
    {
      method: 'GET',
      path: '/getSurveyPrograms',
      handler: function (request, reply) {
        reply(getSurveyPrograms(1));
      }
    },
    {
      method: 'GET',
      path: '/programsJsonSchema',
      handler: function (request, reply) {
        reply(getDepartments(1));
      }
    },
    {
      method: 'POST',
      path: '/getQuestions',
      handler: function (request, reply) {
        let selectedIds = request.payload;
        reply(getQuizes(selectedIds));

      }
    },
    {
      method: 'POST',
      path: '/getAll',
      handler: function (request, reply) {
        let selectedIds = request.payload;
        reply(getAnswers(selectedIds));

      }
    },
    {
      method: 'GET',
      path: '/getLocations',
      handler: function (request, reply) {
        // return saveTestSurvey(rawSurvey);
        reply(getLocations());
      }
    },
    {
      method: 'POST',
      path: '/getSurveys',
      handler: function (request, reply) {
        var selectedIds = request.payload;
        let ids = ["334c9e98-173f-4454-a8ce-f80b20b7fdf0", "e48b266e-4d80-41f8-a56a-a8ce5449ebc6"];
        getSurveys(ids, 1).then((data) => {
          return reply(data);
        })
          .catch((err) => {
            console.log('err', err);
          })
      }
    },
    {
      method: 'POST',
      path: '/testSurveys',
      handler: function (request, reply) {
        var selectedIds = request.payload;
        let ids = ["334c9e98-173f-4454-a8ce-f80b20b7fdf0", "e48b266e-4d80-41f8-a56a-a8ce5449ebc6"];

        reply(testSurvey(1));
      }
    },
    {
      method: 'POST',
      path: '/storeSurveys',
      handler: function (request, reply) {
        let encounterInfo = request.payload.encounterInfo;
        let responseInfo = request.payload.responseInfo;
        return new Promise((resolve, reject) => {
          saveResponse(responseInfo, encounterInfo).then((success) => {
            resolve(success);
          }).catch((err) => {
            reject(err);
          });
        });
      }
    },
    {
      method: 'GET',
      path: '/logout',
      config: {
        auth: false
      },
      handler: function (req, reply) {
        return new Promise(
          (resolve, reject) => {
            const callback = (_error, _response, _body) => '';
            request(
              {
                method: 'DELETE',
                url: 'https://ngx.ampath.or.ke/test-amrs/ws/rest/v1/session/',
              }, callback
            );
          }
        )
      }
    }
  ]
}
