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
        itemId: 'validationMessageSubjectId',
        cls: 'summary',
        tpl: '<span class="validationInfo">{validationInfo}</span>'
      },
      {
        xtype: 'fieldset',
        items: [
          {
            xtype: 'textfield',
            itemId: 'PersonalId',
            label: 'Personnummer',
            labelWrap: true,
            name: 'subject',
            placeholder: 'Skriv svar här',
            labelWidth: '60%',
            labelAlign: 'top',
            listeners: {
              blur: 'onSubjectChange'
            }
          }
        ]
      },
      {
        xtype: 'label',
        data: {
          validationInfo: ''
        },
        itemId: 'validationMessagePinCode',
        cls: 'summary',
        tpl: '<span class="validationInfo">{validationInfo}</span>'
      },
      {
        xtype: 'fieldset',
        items: [
          {
            xtype: 'textfield',
            itemId: 'PinCode',
            name: 'pin',
            label: 'Pinkod',
            placeholder: 'Skriv svar här',
            labelWidth: '60%',
            labelAlign: 'top',
            listeners: {
              blur: 'onPinChange'
            }
          }
        ]
      },
      {
        xtype: 'button',
        text: 'Login',
        id: 'loginbutton',
        listeners: {
          tap: 'onLoginClick'
        }
      },
      {
        xtype: 'fieldset',
        items: {
          xtype: 'label',
          itemId: 'missingMessage',
          data: {
            message: ''
          },
          cls: 'summary',
          tpl: '<br/><span class="validationInfo">{message}</span>'
        }
      }
    ]
  }
});
