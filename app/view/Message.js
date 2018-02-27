Ext.define('PublicRegistrator.view.Message', {
  extend: 'Ext.Panel',
  config: {
    items: [
      {
        docked: 'top',
        xtype: 'titlebar',
        itemId: 'title',
        title: '',
        tpl: '{title}'
      },
      {
        xtype: 'panel',
        itemId: 'message',
        cls: 'prom-message',
        tpl: '{message}'
      }
    ]
  }
});
