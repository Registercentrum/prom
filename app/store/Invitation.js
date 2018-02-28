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
  setUrlByToken: function (url, token, apikey) {
    this.getProxy().setUrl('//' + url + '/api/proxies/survey?token=' + token + '&apikey=' + apikey);
  }
});
