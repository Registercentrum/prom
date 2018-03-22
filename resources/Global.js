/* eslint-disable no-unused-vars */
var Global = Global ? Global : {};
var Prom = {};
var Current = {};
var NameMap = {};
var Parent =  null;

Global.Validate = function () { return;};

// Global methods for scripting
var assignIf = function (condition, name, value) {
  if (condition) {
    var question = Ext.getCmp('registrationform').down('#' + name).down('#question');
    question && question.setValue(value);
  }
};

var displayIf = function (show, name) {
  var survey = Ext.getCmp('registrationform');
  var question = survey.getComponent(name);
  question.isHiddenByScript = !show;
  var summary = survey.getInnerItems()[survey.getInnerItems().length - 1];
  summary.getComponent('summaryFieldset').getComponent(name).setHidden(!show);
};

var enableIf = function (condition, qName) {
  displayIf(condition, qName);
};

// Survey with questions from server
(function () {
  var getParameterByName = function (name) {
    var filteredName = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + filteredName + '=([^&#]*)', 'i');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  var getApiKey = function (url) {
    return !(url === 'rc-utv.rcvg.local' || url === 'demo.registercentrum.se') ? 'r-NYROaDruQ=' : 'Yj0IKgS-VQQ=';
  };

  var baseURL = window.location.hostname;
  var token = getParameterByName('token');
  var apikey = getApiKey(baseURL);
  if (token !== '') {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        Prom = this.responseText;
      }
    };
    xhttp.open('GET', '//' + baseURL + '/api/proxies/survey?token=' + token + '&apikey=' + apikey, true);
    xhttp.send();
  }
})();
