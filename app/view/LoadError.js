Ext.define('PublicRegistrator.view.LoadError', {
  extend: 'Ext.Panel',
  config: {
    items: [
      {
        items: {
          docked: 'top',
          xtype: 'titlebar',
          title: 'Fel vid hämtning av formulär'
        }
      },
      {
        xtype: 'panel',
        itemId: 'message',
        tpl: '<h2>{message}</h2>'
      }
    ]
  }
});
