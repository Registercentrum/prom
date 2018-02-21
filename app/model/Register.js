Ext.define('PublicRegistrator.model.Register', {
  extend: 'Ext.data.Model',
  config: {
    fields: ['RegisterID', 'ShortName', 'RegisterName', 'RegisterNameInEnglish', 'IsLookupBound', 'IsPatientBound', 'IsUnderDevelopment']
  }
});
