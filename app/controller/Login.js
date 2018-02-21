Ext.define('PublicRegistrator.controller.Login', {
  extend: 'Ext.app.Controller',
  alias: 'controller.Login',
  config: {
    control: {
      loginButton: {
        tap: 'onLoginClick'
      },
      subjectIdField: {
        change: 'onSubjectChange'
      },
      pinCodeField: {
        change: 'onPinChange'
      }
    },

    refs: {
      subjectIdField: 'textfield[name="subject"]',
      pinCodeField: 'textfield[name="pin"]',
      loginButton: '#loginbutton',
      loginView: '#loginview'
    },
    isValid: false
  },
  validate: function () {
    var form = this.getLoginButton().up();
    var formData = form.getValues();

    var model = Ext.create('PublicRegistrator.model.Login',
      {
        PersonalId: formData.subject,
        PinCode: formData.pin
      });

    var validation = model.validate();
    this.isValid = validation.length === 0 ? true : false;
    return validation;
  },
  onSubjectChange: function () {
    var errors = this.validate();
    var errorLabel = this.getSubjectIdField().up().up().down('#validationMessageSubjectId');
    if (errors.items[0] && errors.items[0]._field === 'PersonalId') {
      errorLabel.setData({ validationInfo: errors.items[0]._message });
    } else {
      errorLabel.setData({ validationInfo: '' });
    }
  },
  onPinChange: function () {
    var errors = this.validate();
    var errorLabel = this.getSubjectIdField().up().up().down('#validationMessagePinCode');
    if (errors.items[0] && errors.items[0]._field === 'PinCode') {
      errorLabel.setData({ validationInfo: errors.items[0]._message });
    } else if (errors.items[1] && errors.items[1]._field === 'PinCode') {
      errorLabel.setData({ validationInfo: errors.items[1]._message });
    } else {
      errorLabel.setData({ validationInfo: '' });
    }
  },
  onLoginClick: function () {
    if (this.isValid) {
      var form = this.getLoginButton().up();
      form.down('#missingMessage').setData({ message: '' });
      var apikey = !(window.location.hostname === 'rc-utv.rcvg.local' || window.location.hostname === 'demo.registercentrum.se') ? 'r-NYROaDruQ=' : 'Yj0IKgS-VQQ=';
      form.submit({
        url: '/api/proxies/survey?apikey=' + apikey,
        cors: true,
        withCredentials: true,
        method: 'GET',
        success: function (component, data) {
          console.log(data);
          window.location.assign('/apps/PublicRegistrator/app.html?apikey=' + apikey + '&token=' + data.data);
        },
        failure: function () {
          this.down('#missingMessage').setData({ message: 'Vi kan inte hitta någon inbjudan med de uppgifterna.' });
        }
      });
    }
  }
});
