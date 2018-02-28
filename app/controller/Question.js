Ext.define('PublicRegistrator.controller.Question', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.question',

  validate: function () {
    var view = this.getView();
    if (view.infoOnly) {
      view.isValid = true;
      return true;
    }
    var fieldName = this.lookup('question').getName();
    view.mandatoryMessage = view.isMandatory && !Current[fieldName] ? 'OBS! Denna fråga måste besvaras.' : null;

    validationFunction(); // ValidationScripts from database

    if (view.validationMessage === null) {
      var validationMessage = Global.Validate(Current[fieldName], view.domainID); // eslint-disable-line new-cap
      view.validationMessage = validationMessage === true ? null : validationMessage;
    }
    view.isValid = (view.validationMessage === null && view.mandatoryMessage === null);

    this.setValidationMessages(fieldName);
    return view.isValid ? true : view.validationMessage;
  },

  setValidationMessages(fieldName) {
    var view = this.getView();
    var questionValidationInfo = this.lookup('validation');
    var summaryValidationInfo = Ext.getCmp('summaryFieldset').getComponent(fieldName).getComponent('validationInfo');

    var info = view.isValid ? '' : (view.mandatoryMessage || view.validationMessage);
    questionValidationInfo.setData({ validationInfo: info });
    summaryValidationInfo.setData({ validationInfo: info });
  }
});
