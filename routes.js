'use strict';

const request = require('request');
const connection = require('./connection/connection');
const programs = require('./data/department-programs.json');
const service = require('./data/service');
const  rawSurvey = require('./data/surveys.json');

function getAllDeparts() {
  var data = programs;
  return data;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function getSurveys(selected_uuids, surveyId) {
  return service.getSurveysObject(selected_uuids, surveyId)
  .then((result,err) => {
    if(result){
      return result;
    }else{
      console.log('error', err);
    }
  });
}

function getSurveyPrograms(surveyId) {
  return service.getSurveyPrograms(surveyId)
  .then((result,err) => {
    if(result){
      return result;
    }else{
      console.log('error', err);
    }
  });
}

function getDepartments(surveyId) {
  return service.getDepartments(surveyId)
  .then((result,err) => {
    if(result){
      return result;
    }else{
      console.log('error', err);
    }
  });
}

function getQuizes(programId) {
  return service.getQuizes(programId)
  .then((result,err) => {
    if(result){
      return result;
    }else{
      console.log('error', err);
    }
  });
}

function getAnswers(programID) {
  return service.getAnswers(programID)
  .then((result,err) => {
    if(result){
      return result;
    }else{
      console.log('error', err);
    }
  });
}

function getLocations() {
  var loc_data = [];
  let locations = service.LOCATIONS;
  locations.results.forEach((val)=>{
    loc_data.push({uuid:val.uuid, name:val.display});
  })
  return loc_data;
}

function saveTestSurvey(data){
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
      handler: function(request, h){
        return 'server running';
      }

    },
    {
      method: 'GET',
      path: '/saveSurvey',
      handler: function (request, h) {
        return service.saveSurvey(rawSurvey);
        //return service.saveSurvey(surveys22);
      }
    },
    {
      method: 'GET',
      path: '/getDepts',
      handler: function (request, h) {
        return getAllDeparts();
      }
    },
    {
      method: 'GET',
      path: '/getSurveyPrograms',
      handler: function (request, h) {
        return getSurveyPrograms(1);
      }
    },
    {
      method: 'GET',
      path: '/programsJsonSchema',
      handler: function (request, h) {
        return getDepartments(1);
      }
    },
    {
      method: 'POST',
      path: '/getQuestions',
      handler: function (request, reply) {
        let selectedIds = request.payload;
        return getQuizes(selectedIds);

      }
    },
    {
      method: 'POST',
      path: '/getAll',
      handler: function (request, reply) {
        let selectedIds = request.payload;
        return getAnswers(selectedIds);

      }
    },
    {
      method: 'GET',
      path: '/getLocations',
      handler: function (request, h) {
        //saveTestSurvey(rawSurvey);
        return getLocations();
      }
    },
    {
      method: 'POST',
      path: '/getSurveys',
      handler: function (request, h) {
        var selectedIds = request.payload;
        
let ids = ["334c9e98-173f-4454-a8ce-f80b20b7fdf0", "e48b266e-4d80-41f8-a56a-a8ce5449ebc6"];
       // var unique = selectedIds.filter(onlyUnique);
        console.log('selected ids', selectedIds);
        console.log(' ids', ids);
        return getSurveys(ids, 1);
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
      options: {
        auth: false
      },
      handler: function (req, h) {
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
