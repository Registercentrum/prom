Ext.define('PublicRegistrator.store.Domain', {
  extend: 'Ext.data.Store',
  requires: ['Ext.data.proxy.JsonP'],
  config: {
    model: 'PublicRegistrator.model.Domain',
    autoLoad: false,
    sorters: ['Sequence'],
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
  setDomainUrl: function (url, domainID, apikey) {
    this.getProxy().setUrl('//' + url + '/api/metadata/domains/' + domainID + '?APIKey=' + apikey);
  }
});
