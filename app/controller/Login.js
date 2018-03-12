Ext.define('PublicRegistrator.controller.Login', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.login',
  showInstantValidation: false,

  validate: function () {
    var form = this.getView();
    var formData = form.getValues();

    var model = Ext.create('PublicRegistrator.model.Login',
      {
        subjectid: formData.subject,
        pincode: formData.pin
      });

    var validation = model.getValidation();
    return validation;
  },

  onSubjectChange: function () {
    var validation = this.validate().get('subjectid');
    var errorLabel = this.lookup('validationMessageSubjectId');
    this.displayValidation(validation, errorLabel);
  },

  onPinChange: function () {
    var validation = this.validate().get('pincode');
    var errorLabel = this.lookup('validationMessagePinCode');
    this.displayValidation(validation, errorLabel);
  },

  displayValidation: function (validation, errorLabel) {
    if ( validation !== true && this.showInstantValidation) {
      errorLabel.setData({ validationInfo: validation });
    } else {
      errorLabel.setData({ validationInfo: '' });
    }
  },

  onLoginClick: function () {
    this.showInstantValidation = true;
    this.onPinChange();
    this.onSubjectChange();
    var valid = this.validate().isValid();
    if (valid) {
      var form = this.getView();
      this.lookup('missingMessage').setData({ message: '' });
      var apikey = !(window.location.hostname === 'rc-utv.rcvg.local' || window.location.hostname === 'demo.registercentrum.se') ? 'r-NYROaDruQ=' : 'Yj0IKgS-VQQ=';
      form.submit({
        url: '/api/proxies/survey?apikey=' + apikey,
        cors: true,
        withCredentials: true,
        method: 'GET',
        success: function (component, data) {
          window.location.assign('/apps/PublicRegistrator/app.html?apikey=' + apikey + '&token=' + data.data);
        },
        failure: function () {
          this.lookup('missingMessage').setData({ message: 'Vi kan inte hitta någon inbjudan med de uppgifterna.' });
        }
      });
    }
  }
});
