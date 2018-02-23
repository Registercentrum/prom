Ext.define('PublicRegistrator.controller.Login', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.login',

  validate: function () {
    var form = this.getView();
    var formData = form.getValues();

    var model = Ext.create('PublicRegistrator.model.Login',
      {
        PersonalId: formData.subject,
        PinCode: formData.pin
      });

    var validation = model.getValidation();
    return validation;
  },

  onSubjectChange: function () {
    var validation = this.validate().get('PersonalId');
    var errorLabel = this.getView().down('#validationMessageSubjectId');
    if ( validation !== true) {
      errorLabel.setData({ validationInfo: validation });
    } else {
      errorLabel.setData({ validationInfo: '' });
    }
  },

  onPinChange: function () {
    var validation = this.validate().get('PinCode');
    var errorLabel = this.getView().down('#validationMessagePinCode');
    if ( validation !== true) {
      errorLabel.setData({ validationInfo: validation });
    } else {
      errorLabel.setData({ validationInfo: '' });
    }
  },

  onLoginClick: function () {
    var valid = this.validate().isValid();
    if (valid) {
      var form = this.getView();
      form.down('#missingMessage').setData({ message: '' });
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
          form.down('#missingMessage').setData({ message: 'Vi kan inte hitta någon inbjudan med de uppgifterna.' });
        }
      });
    }
  }
});
