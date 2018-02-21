Ext.define('PublicRegistrator.view.RegistrationForm', {
  extend: 'Ext.carousel.Carousel',
  requires: ['Ext.carousel.Carousel', 'Ext.TitleBar'],
  xtype: 'regForm',
  allTabsViewed: false,

  validate: function () {
    var questions = Ext.ComponentQuery.query('#question');
    var sendButton = this.getInnerItems()[this.getInnerItems().length - 1].getComponent('bnSend');

    for (var i = 0; i < questions.length; i++) {
      if (!questions[i].up().up().isValid) {
        sendButton.setDisabled(true);
        this.isValid = false;
        return;
      }
    }

    this.isValid = true;
    sendButton.setDisabled(false);
  },
  updateAnswer: function (oldCard) {
    var fieldset;
    var field;
    var summary;
    var summaryQuestion;
    var input;
    var name;

    // sätt värde från den tab som lämnas till Current
    fieldset = oldCard.getComponent('questionfieldset');

    if (typeof fieldset !== 'undefined') {
      field = fieldset.down('#question');
    }

    if (typeof field !== 'undefined') {
      // hämta värde
      var value = field.getValue();

      // städa
      value = value !== '' ? value : null;

      // fixa till datum till rätt format
      if (value !== null) {
        if (typeof value.yyyymmdd !== 'undefined') {
          value = value.yyyymmdd();
        }
      }
      // behöver uppdatera värden även här om defaultvärde finns
      name = field.getName();
      Current[name] = value;

      // Visning i summary
      if (value !== null && typeof NameMap[name] !== 'undefined') {
        input = NameMap[name][value]; // selectfields
      } else {
        input = value;
      }

      input = (input === null || input === '' ? 'Inget svar har angetts' : input);

      summary = this.getInnerItems()[this.getInnerItems().length - 1]; // placed in cache
      summaryQuestion = summary.getComponent('summaryFieldset').getComponent(name);
      summaryQuestion.getComponent('response').setData({
        response: input
      });
    }
  },
  config: {
    title: 'Formulärinmatning',
    id: 'registrationform',
    layout: 'card',
    fullscreen: true,
    margin: 0,
    direction: 'horizontal',
    indicator: false,
    defaults: {
      xtype: 'tabpanel'
    },
    listeners: {
      'activeitemchange': function (container, newCard, oldCard) {
        var hidden;
        var b = Ext.getCmp('backbutton');
        var f = Ext.getCmp('forwardbutton');
        var s = Ext.getCmp('summary');

        // har vi lämnat en frågetab
        if (typeof oldCard.validate !== 'undefined') {
          this.updateAnswer(oldCard); // uppdatera värden
          oldCard.validate(); // validera fråga
          this.validate(); // Kolla om hela formuläret OK
        }

        // har frågan döljts av script sp skall vi hoppa till nästa/föregående fråga
        if (newCard.isHiddenByScript) {
          var forward = (container.getInnerItems().indexOf(newCard) > container.getInnerItems().indexOf(oldCard));

          if (forward) {
            container.setActiveItem(container.getInnerItems()[container.getInnerItems().indexOf(container.getActiveItem()) + 1], { type: 'slide', direction: 'left' });
          } else {
            container.setActiveItem(container.getInnerItems()[container.getInnerItems().indexOf(container.getActiveItem()) - 1], { type: 'slide', direction: 'right' });
          }
          return;
        }

        // hantera knapp "Föregående"
        hidden = (this.getActiveItem() === this.getInnerItems()[0]);
        // b.setHidden(hidden);
        hidden ? b.addCls('prom-hidden') : b.removeCls('prom-hidden');
        // hantera knapp "Nästa"
        hidden = (this.getActiveItem() === this.getInnerItems()[this.getInnerItems().length - 1]);
        // f.setHidden(hidden);
        hidden ? f.addCls('prom-hidden') : f.removeCls('prom-hidden');
        // visa knappen för att komma till sammanställningsvyn
        if (this.allTabsViewed) {
          hidden = (container.getActiveIndex() === container.getInnerItems().length - 1);
          s.setHidden(hidden);
        }

        // har vi nått sammanställningsvyn
        if (container.getActiveIndex() === container.getInnerItems().length - 1) {
          this.allTabsViewed = true;
          s.setHidden(false);
          this.down('toolbar').addCls('prom-summary-shown');
        }
      }
    },
    items: [
      {
        xtype: 'toolbar',
        itemId: 'promToolbar',
        cls: 'prom-toolbar',
        ui: 'neutral',
        docked: 'top',
        margin: 0,
        items: [
          {
            text: 'Föregående',
            id: 'backbutton',
            cls: 'prom-nav-back prom-hidden',
            iconCls: 'x-fa fa-chevron-left',
            iconAlign: 'left',
            hidden: false,
            height: 40,
            handler: function () {
              var rf = Ext.getCmp('registrationform');
              rf.updateAnswer(this.up().up().getActiveItem());
              if (this.up().up().getActiveItem().xtype !== 'tabpanel' || this.up().up().getActiveItem().validate()) {
                rf.animateActiveItem(rf.getInnerItems()[rf.getInnerItems().indexOf(rf.getActiveItem()) - 1], { type: 'slide', direction: 'right' });
              }
            }
          },
          {
            text: 'Sammanställning',
            id: 'summary',
            // ui: 'confirm',
            iconCls: 'x-fa fa-angle-double-right',
            iconAlign: 'right',
            cls: 'prom-nav-summary',
            hidden: true,
            height: 40,
            handler: function () {
              var rf = Ext.getCmp('registrationform');
              rf.updateAnswer(this.up().up().getActiveItem());
              if (this.up().up().getActiveItem().xtype !== 'tabpanel' || this.up().up().getActiveItem().fireEvent('activeitemchange') && this.up().up().getActiveItem().validate()) {
                rf.setActiveItem(rf.getInnerItems().length, { type: 'slide', direction: 'left' });
              }
            }
          },
          {
            xtype: 'spacer',
            itemId: 'promSpacer',
            cls: 'prom-spacer',
            width: 40
          },
          {
            text: 'Nästa',
            id: 'forwardbutton',
            cls: 'prom-nav-forward',
            iconCls: 'x-fa fa-chevron-right',
            iconAlign: 'right',
            height: 40,
            handler: function () {
              var rf = Ext.getCmp('registrationform');
              rf.updateAnswer(this.up().up().getActiveItem());
              if (this.up().up().getActiveItem().xtype !== 'tabpanel' || this.up().up().getActiveItem().validate()) {
                rf.animateActiveItem(rf.getInnerItems()[rf.getInnerItems().indexOf(rf.getActiveItem()) + 1], { type: 'slide', direction: 'left' });
              }
            }
          }
        ]
      },
      {
        xtype: 'panel',
        items: [
          {
            xtype: 'label',
            padding: 16,
            html: ['<h2>Välkommen att svara på enkätfrågorna!</h2>',
              'Frågorna visas en och en, gå till nästa fråga genom att trycka på <b>Nästa</b> ',
              'eller svepa i sidled över skärmen. ',
              'Efter den sista frågan visas en sammanställning över dina svar. ',
              'Du kan gå tillbaka och ändra svar på tidigare frågor. ',
              'När du är nöjd med svaren, tryck på <b>Skicka in dina svar</b>.',
              '<br />',
              'Börja svara genom att trycka på <b>Starta</b>.<br />'].join('')
          },
          {
            xtype: 'button',
            text: 'Starta',
            height: '50px',
            margin: '30 0 0 0',
            handler: function () {
              var regForm = Ext.getCmp('registrationform');
              regForm.animateActiveItem(regForm.getInnerItems()[regForm.getInnerItems().indexOf(regForm.getActiveItem()) + 1], { type: 'slide', direction: 'left' });
            }
          }
        ]
      }
    ]
  }
});
