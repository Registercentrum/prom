Ext.define('PublicRegistrator.view.Survey', {
  extend: 'Ext.Panel',
  requires: ['Ext.TitleBar', 'Ext.Carousel'],
  config: {
    baseUrl: '',
    token: '',
    apiKey: ''
  },
  layout: 'fit',
  controller: 'survey',
  items: [
    {
      xtype: 'carousel',
      reference: 'regform',
      title: 'Formulärinmatning',
      id: 'registrationform',
      fullscreen: false,
      margin: 0,
      layout: 'card',
      direction: 'horizontal',
      indicator: true,
      listeners: {
        // beforeactiveitemchange: 'beforeNavigation',
        activeitemchange: 'onNavigation'
      },
      items: [
        {
          xtype: 'toolbar',
          reference: 'toolbar',
          cls: 'prom-nav',
          docked: 'top',
          items: [
            {
              text: 'Föregående',
              reference: 'backButton',
              cls: 'prom-nav-back prom-nav-hidden',
              iconCls: 'x-fa fa-angle-left',
              iconAlign: 'left',
              handler: 'onNavigationBack'
            },
            {
              text: 'Sammanställning',
              reference: 'summaryButton',
              iconCls: 'x-fa fa-angle-double-right',
              iconAlign: 'right',
              cls: 'prom-nav-summary',
              hidden: true,
              handler: 'onNavigationSummary'
            },
            {
              xtype: 'spacer',
              cls: 'prom-nav-spacer'
            },
            {
              text: 'Nästa',
              reference: 'forwardButton',
              cls: 'prom-nav-forward',
              iconCls: 'x-fa fa-angle-right',
              iconAlign: 'right',
              handler: 'onNavigationForward'
            }
          ]
        },
        {
          xtype: 'panel',
          reference: 'startPage',
          items: [
            {
              xtype: 'label',
              cls: 'prom-start-page',
              html: [
                '<h2>Välkommen att svara på enkätfrågorna!</h2>',
                'Frågorna visas en och en, gå till nästa fråga genom att trycka på <b>Nästa</b> ',
                'eller svepa i sidled över skärmen. ',
                'Efter den sista frågan visas en sammanställning över dina svar. ',
                'Du kan gå tillbaka och ändra svar på tidigare frågor. ',
                'När du är nöjd med svaren, tryck på <b>Skicka in dina svar</b>.',
                '<br />',
                'Börja svara genom att trycka på <b>Starta</b>.<br />'
              ].join('')
            },
            {
              xtype: 'button',
              text: 'Starta',
              cls: 'prom-start-button',
              handler: 'onNavigationForward'
            }
          ]
        }
      ]
    },
    {
      xtype: 'titlebar',
      id: 'formTitlebar',
      reference: 'surveyTitle',
      title: 'Formulär',
      docked: 'top'
    }
  ]
});

