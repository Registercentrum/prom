Ext.define('PublicRegistrator.view.Registration', {
  extend: 'Ext.Panel',
  requires: ['Ext.TitleBar', 'Ext.Carousel'],
  config: {
    layout: 'fit',
    controller: 'form',
    items: [
      {
        xtype: 'regForm',
        reference: 'regform'
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

