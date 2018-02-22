Ext.define('PublicRegistrator.view.Summary', {
  extend: 'Ext.form.Panel',
  requires: [],
  alias: 'widget.promsummary',
  presentError: function (message, bn) {
    this.getComponent('saveerror').setData({ message: message });
    bn.enable();
  },
  config: {
    cls: 'prom-summary-panel',
    xtype: 'promsummary',
    items: [
      {
        xtype: 'button',
        cls: 'prom-submit-answers',
        id: 'bnSend',
        // ui: 'confirm',
        disabled: true,
        text: 'Skicka in dina svar',
        handler: function () {
          var summary = this.getParent();
          var bn = this;

          // inaktivera knapp för att hindra "dubbelanrop"
          // knapp aktiveras igen om felmeddelande visas
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
                var p = Ext.create('PublicRegistrator.view.Success');
                Ext.Viewport.add(p);
                Ext.Viewport.setActiveItem(p);
              } else {
                summary.presentError(response, bn);
              }
            },
            failure: function (r) {
              var response = Ext.decode(r.responseText);
              if (!response.success) {
                if (response.message === null) {
                  var p = Ext.create('PublicRegistrator.view.Failure');
                  Ext.Viewport.add(p);
                  Ext.Viewport.setActiveItem(p);
                } else {
                  summary.presentError(response.message, bn);
                }
              }
            }
          });
        }
      },
      {
        xtype: 'label',
        itemId: 'saveerror',
        cls: 'saveerror',
        tpl: '<div class="saveerror">Felmeddelande: {message}</div>'
      },
      {
        xtype: 'fieldset',
        //  title: 'Sammanställning',
        id: 'summaryFieldset',
        itemId: 'summaryFieldset',
        // instructions: 'Sammanställning',
        cls: 'summary',
        defaults: {
          // labelalign: 'top'
        },
        items: []
      }
    ]
  }
});
