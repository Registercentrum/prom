var Global = Global ? Global : {};
Global.Validate = function () { return;};
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
        Global.promQuestions = this.responseText;
      }
    };
    xhttp.open('GET', '//' + baseURL + '/api/proxies/survey?token=' + token + '&apikey=' + apikey, true);
    xhttp.send();
  }
})();

var Current = {}; // lagrar data om det aktiva formuläret
var NameMap = {};
var Parent = null; // lagrar data om det aktiva formuläret
var controlFunctions = [];
var validationFunctions = [];

var controlFunction = function () {
  for (i = 0; i < controlFunctions.length; ++i) {
    controlFunctions[i]();
  }
};
var validationFunction = function () {
  for (i = 0; i < validationFunctions.length; ++i) {
    var ret = validationFunctions[i].validationFunction();
    var q = Ext.getCmp('registrationform').getComponent(validationFunctions[i].columnName);

    if (ret != true) {q.validationMessage = ret;} else {q.validationMessage = null;}
  }
};
var assignIf = function (condition, qName, value) {
  // if (condition)
  //    Current[qName] = value;
  if (condition) {
    var q = Ext.getCmp('registrationform').getComponent(qName).getComponent('fieldset').getComponent('question');

    if (typeof q !== 'undefined') {Ext.getCmp('registrationform').getComponent(qName).getComponent('fieldset').getComponent('question').setValue(value);}
  }
};
var displayIf = function (condition, qName) {
  var rf = Ext.getCmp('registrationform');
  var q = rf.getComponent(qName);

  if (!condition) {
    q.isHiddenByScript = true;
    summary = rf.getInnerItems()[rf.getInnerItems().length - 1]; // placed in cache
    summaryQuestion = summary.getComponent('summaryFieldset').getComponent(qName).setHidden(true);
  } else {
    q.isHiddenByScript = false;
    summary = rf.getInnerItems()[rf.getInnerItems().length - 1]; // placed in cache
    summaryQuestion = summary.getComponent('summaryFieldset').getComponent(qName).setHidden(false);
  }
};
var enableIf = function (condition, qName) {
  displayIf(condition, qName);
};