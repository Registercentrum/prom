Ext.define('PublicRegistrator.view.SummaryItem', {
  extend: 'Ext.Panel',
  requires: ['Ext.Label'],

  config: {
    cls: 'prom-summary-item',
    items: [
      {
        itemId: 'header',
        cls: 'prom-summary-item-title',
        xtype: 'label',
        tpl: '<span class="prom-summary-item-number">{questionNo}</span>'
      },
      {
        itemId: 'summaryQuestion',
        xtype: 'label',
        tpl: '<span class="prom-summary-item-text">{questionText}</span>'
      },
      {
        itemId: 'response',
        xtype: 'label',
        tpl: '<span class="prom-summary-item-response">{response}</span>'
      },
      {
        itemId: 'validationInfo',
        xtype: 'label',
        tpl: '<span class="validationInfo">{validationInfo}</span>'
      },
      {
        xtype: 'button',
        itemId: 'toQuestion',
        cls: 'prom-summary-item-link',
        iconCls: 'x-fa fa-chevron-left',
        iconAlign: 'left',
        text: 'Till frågan',
        handler: 'onNavigationToQuestion'
      }
    ]
  }
});
