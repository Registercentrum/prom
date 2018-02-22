Ext.define('PublicRegistrator.view.Success', {
  extend: 'Ext.Panel',
  config: {
    items: [
      {
        items: {
          docked: 'top',
          xtype: 'titlebar',
          title: 'Tack'
        }
      },
      {
        xtype: 'panel',
        cls: 'success',
        html: [
          '<h1>Tack för din hjälp!</h1>' +
          '<div>Dina svar hjälper oss göra vården bättre och vi uppskattar att du tog dig tid att svara på enkäten.</div>'
        ].join('')
      }
    ]
  }
});
