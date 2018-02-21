Ext.define('PublicRegistrator.store.Question', {
  extend: 'Ext.data.Store',
  requires: ['Ext.data.proxy.JsonP'],
  config: {
    model: 'PublicRegistrator.model.Question',
    autoLoad: false,
    sorters: ['Sequence'],
    listeners: {
      exception: function () {

      }
    }
  }
});
