var express = require('express');
var router = express.Router();
const swipl = require('swipl');

// doctor chat bot message page
router.get('/', function(req, res, next) {
  res.render('chat', {});
});

// query prolog mood list
router.get('/mood/list', function(req, res, next) {
  swipl.call('consult(routes/prolog/illness)');
  let moodList = [];
  let ret = swipl.call('mood_library(X)');
  ret = ret.X;
  while (ret.head != null) {
    moodList.push(ret.head);
    ret = ret.tail;
  }
  res.json({moodList: moodList});
});

// query prolog pain list
router.get('/pain/list', function(req, res, next) {
  swipl.call('consult(routes/prolog/illness)');
  let painList = [];
  let ret = swipl.call('pain_library(X)');
  ret = ret.X;
  while (ret.head != null) {
    painList.push(ret.head);
    ret = ret.tail;
  }
  res.json({painList: painList});
});

// query illness library list
router.get('/illness/list', function(req, res, next) {
  swipl.call('consult(routes/prolog/illness)');
  let illnessList = [];
  let ret = swipl.call('illness(X)');
  ret = ret.X;
  while (ret.head != null) {
    illnessList.push(ret.head);
    ret = ret.tail;
  }
  res.json({illnessList: illnessList});
});

// query appropriate gesture base on pain and mood
router.get('/gesture/list', function(req, res, next) {
  swipl.call('consult(routes/prolog/gesture)');
  let painLevel = req.query.pain;
  let moodLevel = req.query.mood;
  let gestureList = [];
  let ret = swipl.call('appropriate_gesture(' + painLevel + ', ' + moodLevel + ',X)');
  ret = ret.X;
  while (ret.head != null) {
    gestureList.push(ret.head);
    ret = ret.tail;
  }
  res.json({gestureList: gestureList});
});

// query prolog random illness and symptom
router.get('/random/illness/symptom', function(req, res, next) {
  swipl.call('consult(routes/prolog/illness)');
  let ret = swipl.call('get_random_illness_symptom(X,Y)');
  res.json({illness: ret.X, symptom: ret.Y});
});

// query prolog illness counter list with all zeros
router.get('/illness/counter/list', function(req, res, next) {
  swipl.call('consult(routes/prolog/illness)');
  let illnessCounterList = [];
  let ret = swipl.call('build_illness_list_counter(X)');
  ret = ret.X;
  while (ret.head != null) {
    illnessCounterList.push(ret.head);
    ret = ret.tail;
  }
  res.json({illnessCounterList: illnessCounterList});
});

// return the incremented illness counter list given the illness
router.post('/increment/illness/counter', function(req, res) {

  swipl.call('consult(routes/prolog/illness)');
  let illnessCounterList = req.body['illnessCounterList[]'];
  let illness = req.body['illness'];
  let illnessCounterListString = '[' + illnessCounterList.join(',') + ']';
  let newIllnessCounterList = [];
  let ret = swipl.call('increment_illness_counter(' + illnessCounterListString + ',' + illness + ', X)');
  ret = ret.X;
  while (ret.head != null) {
    newIllnessCounterList.push(ret.head);
    ret = ret.tail;
  }
  res.json({newIllnessCounterList: newIllnessCounterList});
});

// give the final illness diagnosis base on the illness counter
router.post('/diagnose/illness', function(req, res) {

  swipl.call('consult(routes/prolog/illness)');
  let illnessCounterList = req.body['illnessCounterList[]'];
  let illnessCounterListString = '[' + illnessCounterList.join(',') + ']';
  let ret = swipl.call('give_illness_diagnosis(' + illnessCounterListString + ',' + 'X)');
  let diagnosedIllness = ret.X;
  res.json({diagnosedIllness: diagnosedIllness});
});


module.exports = router;
