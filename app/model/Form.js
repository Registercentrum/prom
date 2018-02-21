Ext.define('PublicRegistrator.model.Form', {
  extend: 'Ext.data.Model',
  config: {
    fields: ['FormID', 'FormName', 'FormTitle', 'HelpNote', 'ValidationScript', 'Parent', 'Register', 'Questions']
  }
});
