Ext.define('PublicRegistrator.controller.Form', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.form',

  beforeNavigation: function (container, newItem, oldItem) {
    if (typeof oldItem.validate === 'undefined') return true;
    var survey = this.lookup('regform');
    survey.updateAnswer(oldItem);
    oldItem.validate();
    survey.validate();
    return oldItem.isValid;
  },

  onNavigation: function (container, newCard, oldCard) {
    this.skipHiddenQuestions(container, newCard, oldCard);
    this.hideInactiveButtons(container);
  },

  skipHiddenQuestions(container, newCard, oldCard) {
    if (!newCard.isHiddenByScript) return;

    var newIndex = container.indexOf(newCard);
    var oldIndex = container.indexOf(oldCard);
    var goingForward = newIndex > oldIndex;
    var nextIndex = goingForward ? newIndex + 1 : newIndex - 1;
    container.setActiveItem(nextIndex - 1);
  },

  hideInactiveButtons(container) {
    var backButton    = Ext.getCmp('backbutton');
    var forwardButton = Ext.getCmp('forwardbutton');
    var summaryButton = Ext.getCmp('summary');

    var atIntro   = container.getActiveIndex() === 0;
    var atSummary = container.getActiveIndex() === container.getInnerItems().length - 1;

    atIntro   ? backButton.addCls('prom-hidden')    : backButton.removeCls('prom-hidden');
    atSummary ? forwardButton.addCls('prom-hidden') : forwardButton.removeCls('prom-hidden');

    if (atSummary) {
      container.allTabsViewed = true;
      summaryButton.setHidden(false);
      container.down('toolbar').addCls('prom-summary-shown');
    }
  },

  init: function () { }
});
