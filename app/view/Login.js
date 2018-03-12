Ext.define('PublicRegistrator.view.Login', {
  extend: 'Ext.form.Panel',
  config: {
    id: 'loginview',
    checkChangeEvents: [],
    controller: 'login',
    padding: '1.2em',
    items: [
      {
        docked: 'top',
        xtype: 'titlebar',
        title: 'Inloggning'
      },
      {
        xtype: 'label',
        data: {
          validationInfo: ''
        },
        reference: 'validationMessageSubjectId',
        cls: 'prom-login-validation',
        tpl: '<span class="validationInfo">{validationInfo}</span>'
      },
      {
        xtype: 'fieldset',
        items: [
          {
            xtype: 'textfield',
            reference: 'subjectId',
            label: 'Personnummer',
            labelWrap: true,
            name: 'subject',
            placeholder: 'Skriv svar här (12 siffror)',
            labelWidth: '60%',
            labelAlign: 'top',
            listeners: {
              blur: 'onSubjectChange',
              action: 'onSubjectChange'
            }
          }
        ]
      },
      {
        xtype: 'label',
        data: {
          validationInfo: ''
        },
        reference: 'validationMessagePinCode',
        cls: 'prom-login-validation',
        tpl: '<span class="validationInfo">{validationInfo}</span>'
      },
      {
        xtype: 'fieldset',
        items: [
          {
            xtype: 'textfield',
            reference: 'pinCode',
            name: 'pin',
            label: 'Pinkod',
            placeholder: 'Skriv svar här',
            labelWidth: '60%',
            labelAlign: 'top',
            listeners: {
              blur: 'onPinChange',
              action: 'onPinChange'
            }
          }
        ]
      },
      {
        xtype: 'button',
        text: 'Login',
        reference: 'loginButton',
        listeners: {
          tap: 'onLoginClick'
        }
      },
      {
        xtype: 'fieldset',
        items: {
          xtype: 'label',
          reference: 'missingMessage',
          data: {
            message: ''
          },
          cls: 'prom-login-validation',
          tpl: '<br/><span class="validationInfo">{message}</span>'
        }
      }
    ]
  }
});
