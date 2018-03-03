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

module.exports = router;
