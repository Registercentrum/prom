Ext.define('PublicRegistrator.model.Domain', {
  extend: 'Ext.data.Model',
  config: {
    fields: ['DomainID', 'DomainName', 'DomainTitle', 'IsInteger', 'IsEnumerated', 'DomainValues']
  }
});
