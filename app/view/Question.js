Ext.define('PublicRegistrator.view.Question', {
  extend: 'Ext.form.Panel',
  requires: ['Ext.form.FieldSet'],
  domainID: 0,
  isHiddenByScript: false,
  isMandatory: false,
  mandatoryMessage: null,
  validationMessage: null,
  isValid: false,
  infoOnly: false,

  config: {
    questionData: {},
    index: 0,
    numberOfQuestions: 0,
    baseUrl: '',
    token: '',
    apikey: '',
    infoOnly: false
  },

  xtype: 'promquestion',
  controller: 'question',
  items: [
    {
      xtype: 'fieldset',
      itemId: 'fieldset',
      cls: 'prom-question',
      items: []
    },
    {
      xtype: 'label',
      reference: 'validation',
      cls: 'prom-question-validation',
      tpl: '<span class="validationInfo">{validationInfo}</span>'
    }
  ],

  validate: function () { return this.getController().validate(); }
});
