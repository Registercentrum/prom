Ext.define('PublicRegistrator.view.QuestionSummary', {
  requires: ['Ext.Label'],
  extend: 'Ext.Panel',
  // xtype: 'questionsummary',
  config: {
    cls: 'prom-question-summary',
    items: [
      {
        itemId: 'header',
        cls: 'prom-summary-question-title',
        xtype: 'label',
        tpl: '<span class="questionNo">{questionNo}</span>'
      },
      {
        itemId: 'summaryQuestion',
        cls: 'prom-summary-question',
        xtype: 'label',
        tpl: '<span class="summaryQuestion">{questionText}</span>'
      },
      {
        itemId: 'response',
        xtype: 'label',
        tpl: '<span class="summaryResponse">{response}</span>'
      },
      {
        itemId: 'validationInfo',
        xtype: 'label',
        tpl: '<span class="validationInfo">{validationInfo}</span>'
      },
      {
        xtype: 'button',
        itemId: 'toQuestion',
        cls: 'prom-summary-question-link',
        iconCls: 'x-fa fa-chevron-left',
        iconAlign: 'left',
        text: 'Till frågan',
        handler: function (bn) {
          var rf = Ext.getCmp('registrationform');
          rf.setActiveItem(rf.getComponent(bn.getParent().getItemId()), { type: 'slide', direction: 'left' });
        }
      }
    ]
  }
});
