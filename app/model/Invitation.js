Ext.define('PublicRegistrator.model.Invitation', {
  extend: 'Ext.data.Model',
  config: {
    fields: ['Form', 'Unit', 'IsOngoing', 'ReplyStatus', 'StatusDate', 'Initials']
  }
});
