Ext.define('PublicRegistrator.view.Summary', {
  extend: 'Ext.form.Panel',
  requires: [],
  alias: 'widget.promsummary',

  config: {
    cls: 'prom-summary-panel',
    xtype: 'promsummary',
    items: [
      {
        xtype: 'button',
        cls: 'prom-submit-answers',
        reference: 'submitButton',
        disabled: true,
        text: 'Skicka in dina svar',
        handler: function () { this.up().onButtonClick(this);}
      },
      {
        xtype: 'label',
        itemId: 'saveerror',
        cls: 'saveerror',
        tpl: '<div class="saveerror">Felmeddelande: {message}</div>'
      },
      {
        xtype: 'fieldset',
        id: 'summaryFieldset',
        itemId: 'summaryFieldset',
        cls: 'summary',
        items: []
      }
    ]
  },

  onButtonClick: function (bn) {
    var summary = this;
    bn.disable();

    Ext.Ajax.request({
      url: '//' + publicRegistrator.config.baseURL + '/api/registrations', // ?apikey=' + publicRegistrator.config.APIKey,
      params: {
        apikey: publicRegistrator.config.APIKey,
        Token: publicRegistrator.config.token
      },
      jsonData: Current,
      success: function (r) {
        var response = Ext.decode(r.responseText);
        if (response.success) {
          summary.presentThanks();
        } else {
          summary.presentError(response, bn);
        }
      },
      failure: function (r) {
        var response = Ext.decode(r.responseText);
        if (!response.success) {
          if (response.message === null) {
            summary.presentThanks();
          } else {
            summary.presentError(response.message, bn);
          }
        }
      }
    });
  },

  presentError: function (message, bn) {
    this.getComponent('saveerror').setData({ message: message });
    bn.enable();
  },

  presentThanks: function () {
    var message = '<h1>Tack för din hjälp!</h1><div>Dina svar hjälper oss göra vården bättre och vi uppskattar att du tog dig tid att svara på enkäten.</div>';
    var messageView = Ext.create('PublicRegistrator.view.Message');
    messageView.getComponent('title').setTitle('Tack');
    messageView.getComponent('message').setData({ message: message });
    Ext.Viewport.add(messageView);
    Ext.Viewport.setActiveItem(messageView);
  }
});
