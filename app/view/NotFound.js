Ext.define('PublicRegistrator.view.NotFound', {
  extend: 'Ext.Panel',
  config: {
    items: [
      {
        items: {
          docked: 'top',
          xtype: 'titlebar',
          title: 'Formulär hittades ej'
        }
      },
      {
        xtype: 'panel',
        html: [
          '<h2>Inget formulär hittades.</h2>'
        ].join('')
      }
    ]
  }
});
