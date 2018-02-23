Ext.define('PublicRegistrator.model.Login', {
  extend: 'Ext.data.Model',
  fields: [
    {
      name: 'subjectid'
    },
    {
      name: 'pincode'
    }
  ],
  validators: {
    subjectid: {
      type: 'format',
      message: 'Ditt personnummer, 12 siffror med streck',
      matcher: /^[0-9]{8}[-][0-9]{4}$/
    },
    pincode: {
      type: 'format',
      message: 'Pinkoden du fick med fyra siffror',
      matcher: /^[0-9]{4}$/
    }
  }
});
