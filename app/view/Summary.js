﻿Ext.define('PublicRegistrator.view.Summary', {
  extend: 'Ext.form.Panel',
  alias: 'widget.promsummary',
  cls: 'prom-summary-panel',
  items: [
    {
      xtype: 'button',
      cls: 'prom-submit-answers',
      reference: 'submitButton',
      disabled: true,
      text: 'Skicka in dina svar',
      handler: 'onSubmitButtonClick'
    },
    {
      xtype: 'label',
      itemId: 'saveerror',
      reference: 'errorMessage',
      cls: 'saveerror',
      tpl: '<div class="saveerror">Felmeddelande: {message}</div>'
    },
    {
      xtype: 'fieldset',
      id: 'summaryFieldset',
      itemId: 'summaryFieldset',
      reference: 'summaryItems',
      cls: 'prom-summary-fieldset',
      items: []
    }
  ]
});

