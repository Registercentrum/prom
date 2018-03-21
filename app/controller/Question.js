Ext.define('PublicRegistrator.controller.Question', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.question',

  init: function () {
    var config = this.getView().config;
    if (config.isInfo) return;
    this.createQuestion(config.questionData, config.index, config.numberOfQuestions, config.meta);
  },

  /**
 *    ########  ##     ## #### ##       ########
 *    ##     ## ##     ##  ##  ##       ##     ##
 *    ##     ## ##     ##  ##  ##       ##     ##
 *    ########  ##     ##  ##  ##       ##     ##
 *    ##     ## ##     ##  ##  ##       ##     ##
 *    ##     ## ##     ##  ##  ##       ##     ##
 *    ########   #######  #### ######## ########
 */

  createQuestion: function (question, i, numberOfQuestions) {
    var view = this.getView();
    var fieldset = view.getComponent('fieldset');
    var domain = question.get('Domain');
    var columnName = question.get('ColumnName');

    this.createQuestionScripts(question);
    view.questionText = this.createQuestionText(question);
    view.isMandatory = question.get('IsMandatory');
    view.domainID = domain.DomainID;

    fieldset.setTitle('<div class="prom-question-intro">Fråga ' + i + ' av ' + numberOfQuestions + '</div><div class="prom-question-title">' + view.questionText + '<span class="hidden">*</span></div>');
    view.setItemId(columnName);

    var updateMyValue = function () {
      var value = this.getValue();
      value = !value ? null : value;
      if (value instanceof Date) {
        value = value.toLocaleDateString('sv-SE');
        value = value.replace(/[^ -~]/g, '');
      }
      Current[columnName] = value;
    };

    var validateMe = function () {
      if (this.getParent()) {
        var form = this.up().up();
        var isValid = form.validate();
        return isValid;
      }
      return true;
    };

    var config = {
      itemId: 'question',
      reference: 'question',
      labelWrap: true,
      name: columnName,
      labelWidth: '60%',
      labelAlign: 'top'
    };

    var self = this;
    if (domain.IsEnumerated) {
      var store = Ext.create('PublicRegistrator.store.Domain');
      store.setDomainUrl(view.config.baseUrl, domain.DomainID, view.config.apikey);
      store.load(function () {self.createSelectQuestion(store, columnName, domain, config, updateMyValue, validateMe, fieldset, question);});
    } else {
      var field = this.createField(domain.DomainID, config, columnName);
      field.on('change', updateMyValue, field, {});
      field.on('change', controlFunction, this, {});
      field.on('change', validateMe, field, {});
      fieldset.add(field);
    }
    Current[columnName] = null;
    return view;
  },

  createQuestionText: function (q) {
    var text;
    var prefixText = q.get('PrefixText');
    var suffixText = q.get('SuffixText');

    prefixText = prefixText !== null ? prefixText.trim() : '';
    suffixText = suffixText !== null ? suffixText.trim() : '';

    if (prefixText) {
      text = prefixText;
    } else {
      var mappedTo = q.get('MappedTo');
      mappedTo = typeof mappedTo !== 'undefined' ? mappedTo.trim() : '';
      switch (mappedTo) {
      case 'SubjectKey':
        text = 'Personnummer';
        break;
      case 'UnitCode':
        text = 'VårdenhetsID';
        break;
      case 'EventDate':
        text = 'Händelsedag';
        break;
      default:
        text = 'Frågetext saknas';
      }
    }

    text = suffixText ? text + ' (' + suffixText + ')' : text;
    return text;
  },

  createQuestionScripts: function (question) {
    var controlScript = question.get('ControlScript');
    var validationScript = question.get('ValidationScript');

    if (controlScript !== null) {
      if (controlScript.indexOf('Parent') === -1) {
        var cf = new Function(controlScript); // eslint-disable-line no-new-func
        controlFunctions.push(cf);
      }
    }

    if (validationScript !== null) {
      if (validationScript.indexOf('Parent') === -1) {
        var vf = new Function(validationScript); // eslint-disable-line no-new-func
        validationFunctions.push({
          columnName: question.get('ColumnName'),
          validationFunction: vf
        });
      }
    }
  },

  createField: function (domain, defaultConfig, columnName) {
    var fields = {
      1015: { field: 'Toggle', config: { placeholder: 'skriv svar här'}},
      1020: { field: 'Text', config: { placeholder: 'Skriv svar här'}},
      1021: { field: 'TextArea', config: { placeholder: 'Skriv svar här'}},
      1030: { field: 'Date', config: { value: new Date(), dateFormat: 'Y-m-d' }},
      1033: { field: 'Text', config: { placeholder: 'Skriv in tid här (hh:mm)' }},
      1038: { field: 'Number', config: { placeholder: 'Skriv in ett årtal', minValue: 1900, value: new Date().getFullYear()}},
      1040: { field: 'Number', config: { placeholder: 'Skriv in ett heltal' }},
      1044: { field: 'Field', config: { html: this.vas(columnName) }},
      1050: { field: 'Text', config: { placeholder: 'Skriv in ett decimaltal' }},
      1051: { field: 'Text', config: { placeholder: 'Skriv in ett decimaltal, 1 decimal' }},
      1052: { field: 'Text', config: { placeholder: 'Skriv in ett decimaltal, 2 decimaler' }},
      1053: { field: 'Text', config: { placeholder: 'Skriv in ett decimaltal, 3 decimaler' }}
    };

    var type = fields[domain] ? fields[domain].field : 'Text';
    var config = fields[domain] ? fields[domain].config : 'Skriv svar här';
    return Ext.create('Ext.field.' + type, Ext.apply(defaultConfig, config));
  },

  /**
  *    ##     ##    ###    ##       #### ########     ###    ######## ####  #######  ##    ##
  *    ##     ##   ## ##   ##        ##  ##     ##   ## ##      ##     ##  ##     ## ###   ##
  *    ##     ##  ##   ##  ##        ##  ##     ##  ##   ##     ##     ##  ##     ## ####  ##
  *    ##     ## ##     ## ##        ##  ##     ## ##     ##    ##     ##  ##     ## ## ## ##
  *     ##   ##  ######### ##        ##  ##     ## #########    ##     ##  ##     ## ##  ####
  *      ## ##   ##     ## ##        ##  ##     ## ##     ##    ##     ##  ##     ## ##   ###
  *       ###    ##     ## ######## #### ########  ##     ##    ##    ####  #######  ##    ##
  */

  validate: function () {
    var view = this.getView();
    if (view.isInfo) {
      view.isValid = true;
      return true;
    }
    var fieldName = this.lookup('question').getName();
    view.validationMessage = null;
    view.mandatoryMessage = view.isMandatory && !Current[fieldName] ? 'OBS! Denna fråga måste besvaras.' : null;

    validationFunction(); // Registry specific validation scripts from database

    if (view.validationMessage === null) {
      var validationMessage = Global.Validate(Current[fieldName], view.domainID); // eslint-disable-line new-cap
      view.validationMessage = validationMessage === true ? null : validationMessage;
    }
    view.isValid = (view.validationMessage === null && view.mandatoryMessage === null);

    this.setValidationMessages(fieldName);
    return view.isValid ? true : view.validationMessage;
  },

  setValidationMessages: function (fieldName) {
    var view = this.getView();
    var questionValidationInfo = this.lookup('validation');
    var summaryValidationInfo = Ext.getCmp('summaryFieldset').getComponent(fieldName).getComponent('validationInfo');

    var info = view.isValid ? '' : (view.mandatoryMessage || view.validationMessage);
    questionValidationInfo.setData({ validationInfo: info });
    summaryValidationInfo.setData({ validationInfo: info });
    var field = this.lookup('question');
    view.isValid || !view.showValidation ? field.removeCls('x-invalid') : field.addCls('x-invalid');
  },

  /**
 *     ######  ######## ##       ########  ######  ########
 *    ##    ## ##       ##       ##       ##    ##    ##
 *    ##       ##       ##       ##       ##          ##
 *     ######  ######   ##       ######   ##          ##
 *          ## ##       ##       ##       ##          ##
 *    ##    ## ##       ##       ##       ##    ##    ##
 *     ######  ######## ######## ########  ######     ##
 */

  createSelectQuestion: function (store, columnName, domain, config, updateMyValue, validateMe, fieldset, question) {
    var field;
    var Eq5dDomains = [4006, 4007, 4008, 4009, 4010, 4011, 4012, 4013, 4014, 4015, 4016, 5769, 5770, 5771, 5772, 5773];
    var isDesktop = Ext.os.deviceType === 'Desktop';
    var isEq5d = Eq5dDomains.indexOf(parseInt(domain.DomainID, 10)) !== -1;
    var cssClasses = isEq5d && !isDesktop ? 'prom-long-answer' : '';
    var isRadioSelect = true || isDesktop || isEq5d;
    var isDropdown = !isRadioSelect;
    var dv = store.getAt(0).getData().DomainValues;

    NameMap[columnName] = {};
    if (isRadioSelect) {
      field = Ext.create('Ext.Component', {_value: '', reference: 'question', itemId: 'question', getName: function () { return columnName; }, setValue: function (value) { this._value = value;}, getValue: function () { return this._value;}, hidden: true});
      fieldset.add(field);

      var onRadioclick = function () {
        var checked = this;
        if (checked && checked.getChecked() === field.getValue()) {
          checked.setChecked(false);
          field.setValue(null);
        } else {
          field.setValue(checked.getValue());
        }

        updateMyValue.bind(field)();
        controlFunction();
        validationFunction.bind(field)();
        validateMe.bind(field)();
      };

      for (var j = 0; j < dv.length; j++) {
        NameMap[columnName][dv[j].ValueCode] = dv[j].ValueName;
        if (dv[j].IsActive) {
          var radio = Ext.create('Ext.field.Radio', {
            cls: cssClasses,
            name: columnName,
            boxLabel: dv[j].ValueName,
            value: dv[j].ValueCode,
            itemId: 'radio'
          });
          radio.on('check', onRadioclick);
          fieldset.add(radio);
        }
      }

      var noAnswerOption = Ext.create('Ext.field.Radio', {
        name: columnName,
        cls: cssClasses,
        boxLabel: 'Kan eller vill inte svara',
        value: '',
        itemId: 'radio',
        listeners: { check: onRadioclick}
      });
      fieldset.add(noAnswerOption);
    }
    if (isDropdown) {
      var qOptions = [];
      for (var k = 0; k < dv.length; k++) {
        NameMap[columnName][dv[k].ValueCode] = dv[k].ValueName;
        if (dv[k].IsActive) {
          qOptions.push({
            text: dv[k].ValueName,
            value: dv[k].ValueCode
          });
        }
      }

      if (!question.data.IsMandatory) {
        qOptions.push({text: '(Inget svar)', value: ''});
      }

      field = Ext.create('Ext.field.Select', Ext.apply(config, {
        options: qOptions,
        placeholder: 'Tryck här för att välja alternativ ....'
      }));
    }

    field.on('change', updateMyValue, field, {});
    field.on('change', controlFunction, this, {});
    field.on('change', validateMe, field, {});

    fieldset.add(field);
  },

  /**
 *    ##     ##    ###     ######           ######   ######     ###    ##       ########
 *    ##     ##   ## ##   ##    ##         ##    ## ##    ##   ## ##   ##       ##
 *    ##     ##  ##   ##  ##               ##       ##        ##   ##  ##       ##
 *    ##     ## ##     ##  ######  #######  ######  ##       ##     ## ##       ######
 *     ##   ##  #########       ##               ## ##       ######### ##       ##
 *      ## ##   ##     ## ##    ##         ##    ## ##    ## ##     ## ##       ##
 *       ###    ##     ##  ######           ######   ######  ##     ## ######## ########
 */

  vasScale: function (columnName) {
    var changeValue = this.changeFieldValue(columnName);
    var scaleThermometer = document.createElement('div');
    scaleThermometer.className = 'scaleThermometer';
    for (var i = 100; i >= 0; i--) {
      var clickable = document.createElement('div');
      var line = document.createElement('div');
      line.className = 'line';
      clickable.className = 'clickableLine';
      clickable.style.margin = (i % 10 === 0 ? '1px' : 0) + ' 0';
      line.style.width = i % 10 === 0 ? '30px' : '15px';
      line.style.height = i % 10 === 0 ? '3px' : '1px';
      clickable.onclick = changeValue(i);
      clickable.id = i;
      clickable.appendChild(line);
      scaleThermometer.appendChild(clickable);
    }
    return scaleThermometer;
  },
  vasNumbers: function () {
    var parent = document.createElement('div');
    parent.className = 'vasNumberContainer';
    for (var i = 10; i >= 0; i--) {
      var number = document.createElement('h5');
      number.style.margin = '0 10px';
      number.appendChild(document.createTextNode(i * 10));
      parent.appendChild(number);
    }
    return parent;
  },
  vasScaleWithHeaders: function (columnName) {
    var scaleDiv = document.createElement('div');
    scaleDiv.className = 'scaleContainer';
    scaleDiv.appendChild(this.vasScale(columnName));
    scaleDiv.appendChild(this.vasNumbers());

    var scaleWithHeader = document.createElement('div');
    scaleWithHeader.className = 'scaleWithHeader';
    var topHeader = document.createElement('h6');
    topHeader.setAttribute('style', 'text-align: center');
    topHeader.appendChild(document.createTextNode('Bästa tänkbara tillstånd'));
    var bottomHeader = document.createElement('h6');
    bottomHeader.setAttribute('style', 'text-align: center');
    bottomHeader.appendChild(document.createTextNode('Sämsta tänkbara tillstånd'));
    scaleWithHeader.appendChild(topHeader);
    scaleWithHeader.appendChild(scaleDiv);
    scaleWithHeader.appendChild(bottomHeader);
    return scaleWithHeader;
  },
  vas: function (columnName) {
    var scaleInfoText = document.createElement('div');
    scaleInfoText.className = 'scaleInfoText';
    scaleInfoText.appendChild(document.createTextNode('Peka på skalan.'));

    var currentValContainer = document.createElement('div');
    currentValContainer.className = 'currentValContainer';
    currentValContainer.appendChild(document.createTextNode('Dagens hälsa är'));
    var value = document.createElement('h2');
    value.style.color = 'white';
    value.style.height = '50px';
    value.id = 'vasValue';
    currentValContainer.appendChild(value);
    scaleInfoText.appendChild(currentValContainer);
    var scaleInfoContainer = document.createElement('div');
    scaleInfoContainer.appendChild(scaleInfoText);
    scaleInfoContainer.className = 'scaleInfoContainer';
    scaleInfoContainer.appendChild(this.vasScaleWithHeaders(columnName));
    return scaleInfoContainer;
  },
  changeFieldValue: function (columnName) {
    return function (value) {
      return function () {
        Array.prototype.map.call(document.getElementsByClassName('selected'), function (i) {
          i.className = 'clickableLine';
        });
        document.getElementById(value).className = 'selected clickableLine';
        var field = Ext.ComponentQuery.query('[name=' + columnName + ']')[0];
        document.getElementById('vasValue').innerHTML = value;
        field.setValue(value);
      };
    };
  }
});
