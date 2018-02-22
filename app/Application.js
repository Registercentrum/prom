Ext.define('PublicRegistrator.Application', {
  extend: 'Ext.app.Application',
  name: 'PublicRegistrator',

  requires: ['Ext.MessageBox', 'Ext.field.DatePicker', 'Ext.field.Toggle', 'Ext.field.Number', 'Ext.field.Select'],

  controllers: ['Login'],
  models: ['Invitation', 'Form', 'Unit', 'Question', 'Domain', 'Login'],
  stores: ['Invitation', 'Form', 'Unit', 'Question', 'Domain'],
  views: ['Registration', 'RegistrationForm', 'Question', 'Summary', 'QuestionSummary', 'Success', 'Failure', 'LoadError', 'NotFound', 'Login'],

  launch: function () {
    Ext.fly('appLoadingIndicator').destroy();

    var token = this.getParameterByName('token');
    var baseURL = window.location.hostname;
    var apikey = !(baseURL === 'rc-utv.rcvg.local' || baseURL === 'demo.registercentrum.se') ? 'r-NYROaDruQ=' : 'Yj0IKgS-VQQ=';

    if (token !== '') {
      publicRegistrator.init({ token: token, APIKey: apikey, baseURL: baseURL });
    } else {
      Ext.Viewport.add(Ext.create('PublicRegistrator.view.Login'));
    }
  },

  getParameterByName: function (name) {
    var filteredName = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + filteredName + '=([^&#]*)', 'i');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
});
