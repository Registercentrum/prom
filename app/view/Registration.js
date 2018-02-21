Ext.define('PublicRegistrator.view.Registration', {
  extend: 'Ext.tab.Panel',
  requires: ['Ext.TitleBar', 'Ext.Carousel', 'Ext.TitleBar'],
  config: {
    scrollable: 'vertical',
    tabBarPosition: 'bottom',
    items: [
      {
        xtype: 'regForm'
      },
      {
        title: 'Formulär',
        id: 'formTitlebar',
        xtype: 'titlebar',
        docked: 'top'
      }
    ]
  }
});

