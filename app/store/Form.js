Ext.define('PublicRegistrator.store.Form', {
  extend: 'Ext.data.Store',
  requires: ['Ext.data.proxy.JsonP'],
  config: {
    model: 'PublicRegistrator.model.Form',
    autoLoad: false,
    listeners: {
      exception: function () {

      }
    }
  }
});
