Ext.define('PublicRegistrator.model.Login', {
  extend: 'Ext.data.Model',
  config: {
    fields: [
      {
        name: 'PersonalId'
      },
      {
        name: 'PinCode'
      }
    ],
    validations: [
      {
        type: 'format',
        field: 'PersonalId',
        message: 'Ditt personnummer, 12 siffror med streck',
        matcher: /^[0-9]{8}[-][0-9]{4}$/
      },
      {
        type: 'format',
        field: 'PinCode',
        message: 'Pinkoden du fick med fyra siffror',
        matcher: /^[0-9]{4}$/
      }
    ]
  }
});
