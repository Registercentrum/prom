﻿Ext.define('PublicRegistrator.view.Question', {
  extend: 'Ext.form.Panel',
  requires: ['Ext.form.FieldSet'],
  domainID: 0,
  isHiddenByScript: false,
  isMandatory: false,
  mandatoryMessage: null,
  validationMessage: null,
  isValid: false,
  isInfo: false,
  showValidation: false,

  config: {
    questionData: {},
    index: 0,
    numberOfQuestions: 0,
    baseUrl: '',
    token: '',
    apikey: '',
    isInfo: false
  },

  xtype: 'promquestion',
  controller: 'question',
  items: [
    {
      xtype: 'label',
      reference: 'validation',
      cls: 'prom-question-validation',
      tpl: '<span class="prom-validation">{validationInfo}</span>'
    },
    {
      xtype: 'fieldset',
      itemId: 'fieldset',
      cls: 'prom-question',
      items: []
    }
  ],

  validate: function () { return this.getController().validate(); }
});
