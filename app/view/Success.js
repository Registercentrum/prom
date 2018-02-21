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
        cls: 'savesuccess',
        margin: '30 0 0 0',
        html: [
          '<h1>Tack för din hjälp!</h1>' +
          '<div>Dina svar hjälper oss</div>' +
          '<div>göra vården bättre och vi</div>' +
          '<div>uppskattar att du tog dig tid</div>' +
          '<div>att svara på enkäten.</div>'
        ].join('')
      }
    ]
  }
});
