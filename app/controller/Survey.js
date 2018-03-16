Ext.define('PublicRegistrator.controller.Survey', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.survey',

  beforeNavigation: function (container, newCard, oldCard) {
    if (typeof oldCard.validate === 'undefined' || newCard.isBouncing === true) return true;
    this.updateAnswer(oldCard);
    oldCard.validate();
    this.validate();
    this.showValidation(oldCard);
    this.updateCheckedItemsAfterControlScript(newCard);
    this.hideOptionIfAnswerIsObligatory(newCard);
    return oldCard.isValid;
  },
  onNavigation: function (container, newCard, oldCard) {
    oldCard.showValidation = true;
    var valid = this.beforeNavigation(container, newCard, oldCard);
    if (!valid) {
      var newIndex = container.getInnerItems().indexOf(newCard);
      var oldIndex = container.getInnerItems().indexOf(oldCard);
      var goingForward = newIndex > oldIndex;
      var goingFastForward = newIndex > oldIndex + 1;
      var me = this;
      oldCard.isBouncing = true;
      if (goingFastForward) {
        setTimeout(function () {container.setActiveItem(oldCard);}, 50);
      } else if (goingForward) {
        setTimeout(function () {me.onNavigationBack();}, 50);
      } else {
        setTimeout(function () {me.onNavigationForward();}, 50);
      }
    } else {
      oldCard.isBouncing = false;
      this.skipHiddenQuestions(container, newCard, oldCard);
      this.hideInactiveButtons(container);
    }
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
    var titleBar = this.lookup('surveyTitle');

    var atIntro = container.getActiveIndex() === 0;
    var atSummary = container.getActiveIndex() === container.getInnerItems().length - 1;

    atIntro ? backButton.addCls('prom-nav-hidden') : backButton.removeCls('prom-nav-hidden');
    atIntro ? titleBar.show() : titleBar.hide();
    atSummary ? forwardButton.addCls('prom-nav-hidden') : forwardButton.removeCls('prom-nav-hidden');
    atSummary ? summaryButton.addCls('prom-nav-hidden') : summaryButton.removeCls('prom-nav-hidden');

    if (atSummary) {
      summaryButton.setHidden(false);
      container.down('toolbar').addCls('prom-summary-shown');
    }
  },

  showValidation(oldCard) {
    oldCard.down('label') && oldCard.down('label').setCls('prom-question-validation validated');
  },

  updateCheckedItemsAfterControlScript(newCard) {
    if (newCard.down('#question') && !newCard.down('#question').getValue() && newCard.down('radio')) {
      var answers = newCard.down('fieldset').innerItems;
      answers.forEach(function (answer) {
        answer.xtype === 'radio' && answer.setChecked(false);
      });
    }
  },

  hideOptionIfAnswerIsObligatory(newCard) {
    newCard.validate && newCard.validate();
    if (newCard.validate && !newCard.isValid && !newCard.down('#question').getValue()) {
      if (newCard.down('radio')) {
        var items = newCard.down('fieldset').innerItems;
        items.forEach(function (answer) {
          answer.xtype === 'radio' && !answer.getValue() && answer.setHidden(true);
        });
      }
    }
  },

  onNavigationBack: function () {
    var survey = this.lookup('regform');
    var currentIndex = survey.getInnerItems().indexOf(survey.getActiveItem());
    var nextQuestion = survey.getInnerItems()[currentIndex - 1];
    this.updateAnswer(survey.getActiveItem());
    if (Ext.isIE) {
      survey.setActiveItem(nextQuestion);
    } else {
      survey.animateActiveItem(nextQuestion, { type: 'slide', direction: 'right' });
    }
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
    if (Ext.isIE) {
      survey.setActiveItem(nextQuestion);
    } else {
      survey.animateActiveItem(nextQuestion, { type: 'slide', direction: 'left' });
    }
  },

  validate: function () {
    var survey = this.lookup('regform');
    var questions = Ext.ComponentQuery.query('#question');
    var submitButton = this.lookup('submitButton');

    for (var i = 0; i < questions.length; i++) {
      if (!questions[i].up().up().isValid) {
        submitButton.setDisabled(true);
        survey.isValid = false;
        this.presentError('Ett eller flera av svaren är märkta i rött och behöver ändras innan du kan skicka in dem.');
        return;
      }
      this.presentError('');
    }

    survey.isValid = true;
    submitButton.setDisabled(false);
  },

  updateAnswer: function (oldCard) {
    var fieldset = oldCard.getComponent('fieldset');
    var question = fieldset && oldCard.down('#question');
    if (!question) return;

    var name = question.getName();
    var value = question.getValue() ? question.getValue() : null;
    if (value && value instanceof Date) {
      value = value.toLocaleDateString('sv-SE');
      value = value.replace(/[^ -~]/g, '');
    }
    Current[name] = value;
    this.updateSummaryItem(name, value);
  },

  updateSummaryItem: function (name, value) {
    var answer = (value !== null && typeof NameMap[name] !== 'undefined') ? NameMap[name][value] : value;
    answer = answer ? answer : 'Inget svar har angetts';

    var survey = this.lookup('regform');
    var summary = survey.getInnerItems()[survey.getInnerItems().length - 1];
    var summaryQuestion = summary.getComponent('summaryFieldset').getComponent(name);
    summaryQuestion.getComponent('response').setData({ response: answer });
  },

  onNavigationToQuestion: function (bn) {
    var rf = Ext.getCmp('registrationform');
    rf.setActiveItem(rf.getComponent(bn.getParent().getItemId()), { type: 'slide', direction: 'left' });
  },

  onSubmitButtonClick: function (button) {
    var controller = this;
    button.disable();

    Ext.Ajax.request({
      url: '//' + this.config.baseUrl + '/api/registrations',
      params: {
        apikey: this.config.apikey,
        Token: this.config.token
      },
      jsonData: Current,
      success: function () {
        controller.presentThanks();
      },
      failure: function (r) {
        var response = Ext.decode(r.responseText);
        controller.presentThanks();
        console.error(response && response.message); // eslint-disable-line no-console
      }
    });
  },

  presentError: function (message) {
    this.lookup('errorMessage').setData({ message: message }).setHidden(message === '');
  },

  presentThanks: function () {
    var message = '<h1>Tack för din hjälp!</h1><div>Dina svar hjälper oss göra vården bättre och vi uppskattar att du tog dig tid att svara på enkäten.</div>';
    var messageView = Ext.create('PublicRegistrator.view.Message');
    messageView.getComponent('title').setTitle('Tack');
    messageView.getComponent('message').setData({ message: message });
    Ext.Viewport.add(messageView);
    Ext.Viewport.setActiveItem(messageView);
  },

  init: function () {
    this.config = this.getView().config;
    Ext.util.Format.decimalSeparator = ',';
    this.initInvitation(this.buildForm);
    Ext.apply(Ext.picker.Date.prototype.defaultConfig, {cancelButton: 'Avbryt', doneButton: 'Klar'});
    this.getValidations();
  },

  getValidations: function () {
    Ext.Ajax.request({
      url: '//' + this.config.baseUrl + '/api/configurations/globals',
      success: function (response) {
        var global = Ext.decode(response.responseText);
        Global = eval('(' + global.data.Methods + ')'); // eslint-disable-line no-eval
      }
    });
  },

  initInvitation: function (callback) {
    var self = this;

    self.formStore = Ext.getStore('Form');
    self.unitStore = Ext.getStore('Unit');
    self.questionStore = Ext.getStore('Question');
    self.domainStore = Ext.getStore('Domain');
    self.invitationStore = Ext.getStore('Invitation');
    self.invitationStore.setUrlByToken(this.config.baseUrl, this.config.token, this.config.apikey);
    self.invitationStore.load(function () {
      callback(self);
    });
  },

  buildForm: function (self) {
    var appMetaForm = [];
    var invitation = self.invitationStore.getAt(0);
    self.handleInvitationErrors(invitation);
    Current = invitation.data.Initials ? invitation.data.Initials : Current;

    self.formStore.setData([invitation.get('Form')]);
    self.unitStore.setData([invitation.get('Unit')]);
    var form = self.formStore.getAt(0);
    self.questionStore.setData(form.get('Questions'));

    var summary = Ext.create('PublicRegistrator.view.Summary');
    var summaryFieldset = summary.getComponent('summaryFieldset');
    var formView = Ext.getCmp('registrationform');
    var formTitlebar = Ext.getCmp('formTitlebar');

    formTitlebar.setTitle(invitation.get('Form').FormTitle);

    self.questionStore.filterBy(function (question) {
      var mappedTo = question.get('MappedTo');
      if (mappedTo === null || mappedTo === 'EventDate' || mappedTo === 'M3Pat_Info2') {
        return true;
      }
      return false;
    });

    var numberOfQuestions = self.questionStore.getData().items.filter(function (question) {return (question.get('Domain').DomainID !== 1080 && question.get('MappedTo') !== 'EventDate');} ).length;
    var i = 0;
    var offset = 0;
    self.questionStore.each(function (question) {
      i++;
      if (question.get('MappedTo') === 'EventDate') {
        offset = 1;
      }
      if (question.data.Domain.DomainID === 1080 && question.get('ControlScript') === null) {
        var infoPanel = self.buildInfoPanel(self.getInfoText(question));
        formView.add(infoPanel);
        i--;
        return;
      }
      if (question.data.Domain.DomainID === 1044) {
        var pnInfo = self.buildInfoPanel(self.getVASInfo(i - offset, numberOfQuestions));
        formView.add(pnInfo);
      }
      // var pnQuestion = self.buildQuestion(question, i, numberOfQuestions, appMetaForm, self);
      var pnQuestion = Ext.create('PublicRegistrator.view.Question', {questionData: question, index: i - offset, numberOfQuestions: numberOfQuestions, baseUrl: self.config.baseUrl, token: self.config.token, apikey: self.config.apikey});
      appMetaForm.push({
        questionNo: i - offset,
        questionText: pnQuestion.questionText,
        columnName: question.get('ColumnName')
      });
      formView.add(pnQuestion);
      var pnQuestionSummary = self.buildSummaryField(question, i, offset, appMetaForm);
      summaryFieldset.add(pnQuestionSummary);
      if (question.get('MappedTo') === 'EventDate') {
        formView.down('#' + question.get('ColumnName')).isHiddenByScript = true;
        summaryFieldset.down('#' + question.get('ColumnName')).setHidden(true);
      }
    });

    formView.add(summary);
    controlFunction();
    Ext.fly('appLoadingIndicator').destroy();
    Ext.getCmp('ext-viewport').removeCls('hidden');
  },

  handleInvitationErrors: function (invitation) {
    var replyStatus = invitation.get('ReplyStatus');
    var errorMessage;

    if (replyStatus === 99) {
      errorMessage = 'Denna formulärinbjudan har utgått.';
    }

    if (replyStatus === 100) {
      errorMessage = 'Detta formulär har redan besvarats.';
    }

    if (!errorMessage && invitation.get('IsOngoing') === false) {
      errorMessage = 'Detta formulär är inte längre aktuellt.';
    }

    if (errorMessage) {
      var messageView = Ext.create('PublicRegistrator.view.Message');
      messageView.getComponent('title').setTitle('Fel vid hämtning av formulär');
      messageView.getComponent('message').setData({ message: errorMessage });
      Ext.Viewport.add(messageView);
      Ext.Viewport.setActiveItem(messageView);
    }
  },

  buildSummaryField: function (question, i, offset, appMetaForm) {
    var summary = Ext.create('PublicRegistrator.view.SummaryItem');
    summary.setItemId(question.get('ColumnName'));
    summary.getComponent('header').setData({
      questionNo: (i - offset) + '. ' + appMetaForm[i - 1].questionText
    });

    return summary;
  },

  buildInfoPanel: function (html) {
    var panel = Ext.create('PublicRegistrator.view.Question', {isInfo: true});
    panel.setItems([]);
    panel.setHtml(html);
    panel.isInfo = true;

    return panel;
  },

  getVASInfo: function (i, n) {
    var header = '<div class="prom-question-intro">Fråga ' + i + ' av ' + n + '</div><div class="prom-question-title">Inför nästa fråga</div>';
    // var header = '<div ="x-innerhtml">Fråga ' + i + ' av ' + n + '</div>';
    var html = [header,
      '<p>− Vi vill veta hur bra eller dålig din hälsa är IDAG.</p>',
      '<p>− Skalan på nästa bild är numrerad från 0 till 100.</p>',
      '<p>− 100 är den bästa hälsa du kan tänka dig.</p>',
      '<p>− 0 är den sämsta hälsa du kan tänka dig.</p>',
      '<p>− Klicka på skalan för att visa hur din hälsa är IDAG.</p>'].join('');
    return html;
  },
  getInfoText: function (question) {
    var header = '<div class="prom-question x-component x-title x-form-fieldset-title x-dock-item x-docked-top"><div class="x-innerhtml">' + question.get('PrefixText') + '</div></div>';
    var html = header + '<div class="prom-info"><p>' + question.get('SuffixText') + '</p></div>';
    return html;
  }
});
