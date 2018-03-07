Ext.define('PublicRegistrator.controller.Question', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.question',

  validate: function () {
    var view = this.getView();
    if (view.isInfo) {
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

  buildQuestion: function (question, i, numberOfQuestions) {
    var field;
    var view = this.getView();
    var fieldset = view.getComponent('fieldset');
    var questionText = this.buildQuestionText(question);
    var domain = question.get('Domain');
    var columnName = question.get('ColumnName');

    fieldset.setTitle('Fråga ' + i + ' av ' + numberOfQuestions);
    view.questionText = questionText;
    view.isMandatory = question.get('IsMandatory');
    view.setItemId(columnName);
    view.domainID = domain.DomainID;
    this.addQuestionScripts(question);

    var updateMyValue = function () {
      var value = this.getValue();
      if (value instanceof Date) {
        value = value.toLocaleDateString('sv-SE');
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
      label: questionText,
      labelWrap: true,
      name: columnName,
      labelWidth: '60%',
      labelAlign: 'top'
    };
    var self = this;
    if (domain.IsEnumerated) {
      var store = Ext.create('PublicRegistrator.store.Domain');
      store.setDomainUrl(view.config.baseUrl, domain.DomainID, view.config.apikey);
      store.load(function () {self.buildSelectQuestion(store, columnName, domain, config, updateMyValue, validateMe, fieldset, question);});
    } else {
      switch (true) {
      case (domain.DomainID === 1015): // Boolean
        field = Ext.create('Ext.field.Toggle', config);
        break;
      case (domain.DomainID === 1020): // Text
        field = Ext.create('Ext.field.Text', Ext.apply(config, {placeholder: 'Skriv svar här'}));
        break;
      case (domain.DomainID === 1021): // Kommentar
        field = Ext.create('Ext.field.TextArea', Ext.apply(config, {placeholder: 'Skriv svar här'}));
        break;
      case (domain.DomainID === 1030):
        field = Ext.create('Ext.field.DatePicker', Ext.apply(config, { value: new Date(), dateFormat: 'Y-m-d', useTitles: true, yearText: 'År', monthText: 'Månad', dayText: 'Dag',
          error: {
            errorTarget: 'bottom'
          },
          validators: function () { updateMyValue.call(this); return validateMe.call(this); },
          doneButton: {
            ui: 'Klar!'
          }
        }));
        break;
      case (domain.DomainID === 1033):
        field = Ext.create('Ext.field.Text', Ext.apply(config, { placeholder: 'Skriv in tid här (hh:mm)'}));
        break;
      case (domain.DomainID === 1038):
        field = Ext.create('Ext.field.Number', Ext.apply(config, { placeholder: 'Skriv in ett årtal', minValue: 1900, value: new Date().getFullYear()}));
        break;
      case (domain.DomainID === 1040):
        field = Ext.create('Ext.field.Number', Ext.apply(config, { placeholder: 'Skriv in ett heltal'}));
        // errorTarget: 'under'
        // validators: function (value) { if (this.isBlurring()) { /*updateMyValue.call(f); return validateMe.call(f);*/} else { return true;} }
        break;
      case (domain.DomainID === 1050):
        field = Ext.create('Ext.field.Text', Ext.apply(config, { placeholder: 'Skriv in ett decimaltal'}));
        break;
      case (domain.DomainID === 1051):
        field = Ext.create('Ext.field.Text', Ext.apply(config, { placeholder: 'Skriv in ett decimaltal, 1 decimal'}));
        break;
      case (domain.DomainID === 1052):
        field = Ext.create('Ext.field.Text', Ext.apply(config, { placeholder: 'Skriv in ett decimaltal, 2 decimaler'}));
        break;
      case (domain.DomainID === 1053):
        field = Ext.create('Ext.field.Text', Ext.apply(config, { placeholder: 'Skriv in ett decimaltal, 3 decimaler'}));
        break;
      case (domain.DomainID === 1044):
        field = Ext.create('Ext.field.Field', Ext.apply(config, { html: this.vas(columnName), placeholder: 'Skriv in ett decimaltal, 3 decimaler'}));
        break;
      case (domain.DomainID === 1080): // Labels
        break;
      default:
        field = Ext.create('Ext.field.Text', Ext.apply(config, { placeholder: 'Skriv in ' + domain.DomainTitle}));
        break;
      }

      field.on('change', updateMyValue, field, {});
      field.on('change', controlFunction, this, {});
      field.on('change', validateMe, field, {});
      fieldset.add(field);
    }
    Current[columnName] = null;
    view.add(fieldset);
    return view;
  },

  buildQuestionText: function (q) {
    var text;
    var mappedTo;
    var prefixText = q.get('PrefixText');
    var suffixText = q.get('SuffixText');
    var isMandatory = q.get('IsMandatory');

    prefixText = prefixText !== null ? prefixText.trim() : '';
    suffixText = suffixText !== null ? suffixText.trim() : '';
    var mandatoryText = isMandatory ? '*' : '';

    if (prefixText === '') {
      mappedTo = q.get('MappedTo');
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
    } else {
      text = prefixText;
    }

    if (suffixText !== '') { text = text + ' (' + suffixText + ')';}
    text += mandatoryText;
    return text;
  },

  addQuestionScripts(question) {
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

  init: function () {
    var config = this.getView().config;
    if (config.isInfo) return;
    this.buildQuestion(config.questionData, config.index, config.numberOfQuestions, config.meta);
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

  buildSelectQuestion: function (store, columnName, domain, config, updateMyValue, validateMe, fieldset, question) {
    var radioSelectDomains = [4006, 4007, 4008, 4009, 4010, 4011, 4012, 4013, 4014, 4015, 4016, 5769, 5770, 5771, 5772, 5773];
    var isRadioSelect = Ext.os.deviceType === 'Desktop' || radioSelectDomains.indexOf(parseInt(domain.DomainID, 10)) !== -1;
    var isDropdown = !isRadioSelect;
    var field;
    var dv = store.getAt(0).getData().DomainValues;
    NameMap[columnName] = {};
    if (isRadioSelect) {
      Ext.os.deviceType === 'Desktop' && fieldset.add(Ext.create('Ext.Label', {html: this.buildQuestionText(question), cls: 'prom-question-label' }));
      field = Ext.create('Ext.Component', {_value: '', reference: 'question', itemId: 'question', getName: function () { return columnName; }, setValue(value) { this._value = value;}, getValue() { return this._value;}, hidden: true});
      fieldset.add(field);
      var onRadioclick = function () {
        var checked = this; // Ext.ComponentQuery.query('#radio').filter(function (radio) {return radio.getChecked();})[0];
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
            name: columnName,
            boxLabel: dv[j].ValueName,
            value: dv[j].ValueCode,
            itemId: 'radio'
          });
          radio.on('check', onRadioclick);
          fieldset.add(radio);
        }
      }

      fieldset.add(
        Ext.create('Ext.field.Radio', {
          name: columnName,
          boxLabel: 'Föredrar att inte svara',
          value: '',
          itemId: 'radio',
          listeners: { check: onRadioclick}
        })
      );
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
        qOptions.push({text: '(Inget svar)', value: null});
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
    scaleDiv.appendChild(this.vasNumbers());
    scaleDiv.appendChild(this.vasScale(columnName));

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
