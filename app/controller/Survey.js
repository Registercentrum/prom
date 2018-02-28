Ext.define('PublicRegistrator.controller.Survey', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.survey',

  beforeNavigation: function (container, newCard, oldCard) {
    if (typeof oldCard.validate === 'undefined') return true;
    this.updateAnswer(oldCard);
    oldCard.validate();
    this.validate();
    return oldCard.isValid;
  },

  onNavigation: function (container, newCard, oldCard) {
    this.skipHiddenQuestions(container, newCard, oldCard);
    this.hideInactiveButtons(container);
  },

  skipHiddenQuestions: function (container, newCard, oldCard) {
    if (!newCard.isHiddenByScript) return;

    var newIndex = container.getInnerItems().indexOf(newCard);
    var oldIndex = container.getInnerItems().indexOf(oldCard);
    var goingForward = newIndex > oldIndex;
    var nextIndex = goingForward ? newIndex + 1 : newIndex - 1;
    container.setActiveItem(nextIndex);
  },

  hideInactiveButtons: function (container) {
    var backButton = this.lookup('backButton');
    var forwardButton = this.lookup('forwardButton');
    var summaryButton = this.lookup('summaryButton');

    var atIntro = container.getActiveIndex() === 0;
    var atSummary = container.getActiveIndex() === container.getInnerItems().length - 1;

    atIntro ? backButton.addCls('prom-hidden') : backButton.removeCls('prom-hidden');
    atSummary ? forwardButton.addCls('prom-hidden') : forwardButton.removeCls('prom-hidden');

    if (atSummary) {
      summaryButton.setHidden(false);
      container.down('toolbar').addCls('prom-summary-shown');
    }
  },

  onNavigationBack: function () {
    var survey = this.lookup('regform');
    var currentIndex = survey.getInnerItems().indexOf(survey.getActiveItem());
    var nextQuestion = survey.getInnerItems()[currentIndex - 1];
    this.updateAnswer(survey.getActiveItem());
    survey.animateActiveItem(nextQuestion, { type: 'slide', direction: 'right' });
  },

  onNavigationSummary: function () {
    var survey = this.lookup('regform');
    var next = survey.getInnerItems().length;
    this.updateAnswer(survey.getActiveItem());
    survey.setActiveItem(next, { type: 'slide', direction: 'left' });
  },

  onNavigationForward: function () {
    var survey = this.lookup('regform');
    var currentIndex = survey.getInnerItems().indexOf(survey.getActiveItem());
    var nextQuestion = survey.getInnerItems()[currentIndex + 1];
    this.updateAnswer(survey.getActiveItem());
    survey.animateActiveItem(nextQuestion, { type: 'slide', direction: 'left' });
  },

  validate: function () {
    var survey = this.lookup('regform');
    var questions = Ext.ComponentQuery.query('#question');
    var submitButton = this.lookup('submitButton');

    for (var i = 0; i < questions.length; i++) {
      if (!questions[i].up().up().isValid) {
        submitButton.setDisabled(true);
        survey.isValid = false;
        return;
      }
    }

    survey.isValid = true;
    submitButton.setDisabled(false);
  },

  updateAnswer: function (oldCard) {
    var fieldset = oldCard.getComponent('fieldset');
    var question = fieldset && fieldset.down('#question');
    if (!question) return;
    var name = question.getName();
    var value = question.getValue() ? question.getValue() : null;
    if (value && value instanceof Date) value = value.toLocaleDateString('sv-SE');
    Current[name] = value;
    this.updateSummaryItem(name, value);
  },

  updateSummaryItem(name, value) {
    var answer = (value !== null && typeof NameMap[name] !== 'undefined') ? NameMap[name][value] : value;
    answer = answer ? answer : 'Inget svar har angetts';

    var survey = this.lookup('regform');
    var summary = survey.getInnerItems()[survey.getInnerItems().length - 1];
    var summaryQuestion = summary.getComponent('summaryFieldset').getComponent(name);
    summaryQuestion.getComponent('response').setData({ response: answer });
  }
});
