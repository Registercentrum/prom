Ext.define('PublicRegistrator.store.Invitation', {
  extend: 'Ext.data.Store',
  requires: ['Ext.data.proxy.JsonP'],
  config: {
    model: 'PublicRegistrator.model.Invitation',
    autoLoad: false,
    proxy: {
      type: 'ajax',
      reader: {
        type: 'json',
        rootProperty: 'data'
      }
    },
    listeners: {
      exception: function () {

      }
    }
  },
  setUrlByToken: function () {
    this.getProxy().setUrl('//' + publicRegistrator.config.baseURL + '/api/proxies/survey?token=' + publicRegistrator.config.token + '&apikey=' + publicRegistrator.config.APIKey);
  }
});
