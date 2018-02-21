Ext.define('PublicRegistrator.store.Unit', {
  extend: 'Ext.data.Store',
  requires: ['Ext.data.proxy.JsonP'],
  config: {
    model: 'PublicRegistrator.model.Unit',
    autoLoad: false,
    listeners: {
      exception: function () {

      }
    }
  }
});
