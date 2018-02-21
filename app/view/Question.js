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

  validate: function () {
    if (this.infoOnly) {
      this.isValid = true;
      return true;
    }

    var summaryQuestion;
    var field;
    var validationInfoSummary;
    var name;
    var ret;
    var bn;

    var validationInfo = this.getComponent('validationInfo');

    this.mandatoryMessage = null;
    this.validationMessage = null;

    field = this.getComponent('questionfieldset').getComponent('question');

    name = field.getName();

    summaryQuestion = Ext.getCmp('summaryFieldset').getComponent(name);
    validationInfoSummary = summaryQuestion.getComponent('validationInfo');
    bn = summaryQuestion.getComponent('toQuestion');

    // validera om obligatorisk
    if (this.isMandatory && (Current[name] === null || typeof Current[name] === 'undefined')) {
      this.mandatoryMessage = 'OBS! Denna fråga måste besvaras.';
    } else {
      this.mandatoryMessage = null;
    }

    // Registerspecifik validering
    validationFunction();

    // Validera mot domän, (måste eventuellt hanteras innan validering på fråga)
    if (this.validationMessage === null) {
      ret = Global.Validate(Current[name], this.domainID); // eslint-disable-line new-cap
      if (ret !== true) {
        this.validationMessage = ret;
      } else {
        this.validationMessage = null;
      }
    }

    this.isValid = (this.validationMessage === null && this.mandatoryMessage === null);

    if (this.isValid) {
      bn.setBadgeText('');
      validationInfo.setData({ validationInfo: '' });
      validationInfoSummary.setData({ validationInfo: '' });
    } else {
      // bn.setBadgeText(1);
      validationInfo.setData({ validationInfo: (this.mandatoryMessage || this.validationMessage) });
      validationInfoSummary.setData({ validationInfo: (this.mandatoryMessage || this.validationMessage) });
    }

    return this.isValid ? true : this.validationMessage;
  },
  config: {
    items: [
      {
        xtype: 'fieldset',
        itemId: 'questionfieldset',
        items: []
      },
      {
        xtype: 'label',
        itemId: 'validationInfo',
        cls: 'summary',
        tpl: '<span class="validationInfo">{validationInfo}</span>'
      }
    ]
  }
});
