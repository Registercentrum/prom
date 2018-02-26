Ext.define('PublicRegistrator.view.Message', {
  extend: 'Ext.Panel',
  config: {
    items: [
      {
        docked: 'top',
        xtype: 'titlebar',
        itemId: 'title',
        title: '',
        tpl: '{title}' // 'Fel vid hämtning av formulär'
      },
      {
        xtype: 'panel',
        itemId: 'message',
        tpl: '<h2>{message}</h2>'
      }
    ]
  }
});
