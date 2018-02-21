Ext.define('PublicRegistrator.view.Failure', {
  extend: 'Ext.Panel',
  config: {
    items: [
      {
        items: {
          docked: 'top',
          xtype: 'titlebar',
          title: 'Fel vid sparande av formulär'
        }
      },
      {
        xtype: 'panel',
        cls: 'saveerror',
        margin: '30 0 0 0',
        html: ['<h3>Någonting kan ha gått fel vid sparandet i databasen. ',
          'Felet är noterat, du behöver inte göra något mera nu.<br /><br />',
          'Tack för din medverkan!',
          '</h3>'].join('')
      }
    ]
  }
});
