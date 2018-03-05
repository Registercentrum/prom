Ext.define('PublicRegistrator.view.SummaryItem', {
  extend: 'Ext.Panel',
  requires: ['Ext.Label'],

  config: {
    cls: 'prom-summary-item',
    items: [
      {
        xtype: 'label',
        itemId: 'header',
        cls: 'prom-summary-item-title',
        tpl: '<span class="prom-summary-item-number">{questionNo}</span>'
      },
      {
        xtype: 'label',
        itemId: 'summaryQuestion',
        tpl: '<span class="prom-summary-item-text">{questionText}</span>'
      },
      {
        xtype: 'label',
        itemId: 'response',
        tpl: '<span class="prom-summary-item-response">{response}</span>'
      },
      {
        xtype: 'label',
        itemId: 'validationInfo',
        tpl: '<span class="validationInfo">{validationInfo}</span>'
      },
      {
        xtype: 'button',
        cls: 'prom-summary-item-link',
        iconCls: 'x-fa fa-angle-left',
        iconAlign: 'left',
        text: 'Ändra svaret',
        handler: 'onNavigationToQuestion'
      }
    ]
  }
});
