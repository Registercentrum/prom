Ext.define('PublicRegistrator.view.Registration', {
  extend: 'Ext.Panel',
  requires: ['Ext.TitleBar', 'Ext.Carousel'],
  config: {
    layout: 'fit',
    items: [
      {
        xtype: 'regForm'
      },
      {
        xtype: 'titlebar',
        id: 'formTitlebar',
        title: 'Formulär',
        docked: 'top'
      }
    ]
  }
});

