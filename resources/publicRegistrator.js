
var publicRegistrator = {
  init: function (config) {
    this.config = config;
    this.addExtensions();
    this.initInvitation(this.buildForm);
  },
  addExtensions: function () {
    Ext.util.Format.decimalSeparator = ',';
  },
  initInvitation: function (callback) {
    var self = this;

    self.formStore        = Ext.getStore('Form');
    self.unitStore        = Ext.getStore('Unit');
    self.questionStore    = Ext.getStore('Question');
    self.domainStore      = Ext.getStore('Domain');
    self.invitationStore  = Ext.getStore('Invitation');

    self.invitationStore.setUrlByToken();
    self.invitationStore.load(function () {
      callback(self);
    });
  },
  buildForm: function (self) {
    var appMetaForm = [];
    var invitation = self.invitationStore.getAt(0);

    self.handleInvitationErrors(invitation);

    if (invitation.data.Initials) {
      Current = invitation.data.Initials;
    }

    self.formStore.setData([invitation.get('Form')]);
    self.unitStore.setData([invitation.get('Unit')]);

    var form = self.formStore.getAt(0);

    self.questionStore.setData(form.get('Questions'));

    var registration    = Ext.create('PublicRegistrator.view.Survey');
    var summary         = Ext.create('PublicRegistrator.view.Summary');
    var summaryFieldset = summary.getComponent('summaryFieldset');
    var formView        = Ext.getCmp('registrationform');
    var formTitlebar    = Ext.getCmp('formTitlebar');

    formTitlebar.setTitle(invitation.get('Form').FormTitle);

    self.questionStore.filterBy(function (question) {
      var mappedTo = question.get('MappedTo');
      if (mappedTo === null || mappedTo === 'EventDate') {
        return true;
      }
      return false;
    });

    var numberOfQuestions = self.questionStore.getCount();
    var i = 0;
    self.questionStore.each(function (question) {
      i++;

      if (question.data.Domain.DomainID === 1044) {
        var pnInfo = self.buildInfoPanel(self.getVASInfo(i, numberOfQuestions));
        formView.add(pnInfo);
      }

      var pnQuestion = self.buildQuestion(question, i, numberOfQuestions, appMetaForm, self);
      formView.add(pnQuestion);

      var pnQuestionSummary = self.buildSummaryField(question, i, appMetaForm);
      summaryFieldset.add(pnQuestionSummary);
    });

    formView.add(summary);
    Ext.Viewport.add(registration);

    controlFunction();
  },
  handleInvitationErrors(invitation) {
    var replyStatus = invitation.get('ReplyStatus');
    var errorMessage;

    if (replyStatus === 100) {
      errorMessage = 'Detta formulär har redan besvarats.';
    }

    if (replyStatus === 110) {
      errorMessage = 'Denna formulärinbjudan är avbruten.';
    }

    if (replyStatus === 99) {
      errorMessage = 'Denna formulärinbjudan har utgått.';
    }

    if (!errorMessage && invitation.get('IsOngoing') === false) {
      errorMessage = 'Detta formulär är inte längre aktuellt.';
    }

    if (errorMessage) {
      var messageView = Ext.create('PublicRegistrator.view.Message');
      messageView.getComponent('title').setTitle('Fel vid hämtning av formulär');
      messageView.getComponent('message').setData({message: errorMessage});
      Ext.Viewport.add(messageView);
      return;
    }
  },
  buildSummaryField: function (question, i, appMetaForm) {
    var summary = Ext.create('PublicRegistrator.view.SummaryItem');
    summary.setItemId(question.get('ColumnName'));
    summary.getComponent('header').setData({
      questionNo: i + '. ' + appMetaForm[ i - 1].questionText
    });

    return summary;
  },
  buildQuestionText: function (q) {
    var ret;
    var mappedTo;
    var prefixText = q.get('PrefixText');
    var suffixText = q.get('SuffixText');

    prefixText = prefixText !== null ? prefixText.trim() : '';
    suffixText = suffixText !== null ? suffixText.trim() : '';

    if (prefixText === '') {
      mappedTo = q.get('MappedTo');
      mappedTo = typeof mappedTo !== 'undefined' ? mappedTo.trim() : '';
      if (mappedTo === '') {
        ret = 'Frågetext saknas';
      } else {
        switch (mappedTo) {
        case 'SubjectKey':
          ret = 'Personnummer';
          break;
        case 'UnitCode':
          ret = 'VårdenhetsID';
          break;
        case 'EventDate':
          ret = 'Händelsedag';
          break;
        default:
          ret = 'Frågetext saknas';
        }
      }
    } else {
      ret = prefixText;
    }

    if (suffixText !== '') {ret = ret + ' (' + suffixText + ')';}

    return ret;
  },
  getVASInfo: function ( i, n) {
    var header = '<div class="x-component x-title x-form-fieldset-title x-dock-item x-docked-top"><div class="x-innerhtml">Fråga ' + i + ' av ' + n + '</div></div>';
    // var header = '<div ="x-innerhtml">Fråga ' + i + ' av ' + n + '</div>';
    var html = [header,
      '<p>− Vi vill veta hur bra eller dålig din hälsa är IDAG.</p>',
      '<p>− Skalan på nästa bild är numrerad från 0 till 100.</p>',
      '<p>− 100 är den bästa hälsa du kan tänka dig.</p>',
      '<p>− 0 är den sämsta hälsa du kan tänka dig.</p>',
      '<p>− Klicka på skalan för att visa hur din hälsa är IDAG.</p>'].join('');
    return html;
  },
  buildInfoPanel: function (html) {
    var pn = Ext.create('PublicRegistrator.view.Question');
    pn.setItems([]);
    pn.setHtml(html);
    pn.infoOnly = true;

    return pn;
  },
  buildQuestion: function (question, i, numberOfQuestions, meta, self) {
    var field;
    var view = Ext.create('PublicRegistrator.view.Question');
    var fieldset = view.getComponent('fieldset');
    fieldset.setTitle('Fråga ' + i + ' av ' + numberOfQuestions);

    var questionText = self.buildQuestionText(question);
    var domain           = question.get('Domain');
    var columnName       = question.get('ColumnName');
    var controlScript    = question.get('ControlScript');
    var validationScript = question.get('ValidationScript');
    view.isMandatory     = question.get('IsMandatory');

    view.setItemId(columnName);
    view.domainID = domain.DomainID;

    meta.push({
      questionNo: i,
      questionText: questionText,
      columnName: columnName
    });

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
          columnName: columnName,
          validationFunction: vf
        });
      }
    }

    // DomainID	DomainName	DomainTitle	IsInteger	RegisterID
    // 1015	Boolean	Boolesk	0	NULL
    // 1020	Text	Text	0	NULL
    // 1021	Note	Kommentar	0	NULL
    // 1030	Date	Datum	0	NULL
    // 1033	Time	Tid	0	NULL
    // 1036	Timestamp	Tidsstämpel	0	NULL
    // 1038	Year	Årtal	1	NULL
    // 1040	Integer	Heltal	1	NULL
    // 1044	VAS	VAS	1	NULL
    // 1050	Float	Flyttal	0	NULL
    // 1051	Decimal1	Decimaltal1	0	NULL
    // 1052	Decimal2	Decimaltal2	0	NULL
    // 1053	Decimal3	Decimaltal3	0	NULL

    if (domain.IsEnumerated) {
      var store = Ext.create('PublicRegistrator.store.Domain');
      store.setDomainUrl(domain.DomainID);
      store.load(function () {
        /*
        var qOptions = [{
          text: '',
          value: ''
        }];
        */
        var qOptions = [];
        var radios = document.createElement('div');
        var dv = store.getAt(0).getData().DomainValues;
        NameMap[columnName] = {};

        // This array contains all the DomainIDs that will render as radiobuttons
        var EQ5DQuestions = [4006, 4007, 4008, 4009, 4010, 4011, 4012, 4013, 4014, 4015, 4016, 5769, 5770, 5771, 5772, 5773];
        var isEQ5DQuestion = EQ5DQuestions.indexOf(parseInt(domain.DomainID, 10)) !== -1;
        if (isEQ5DQuestion) {
          field = Ext.create('Ext.field.Field', {
            itemId: 'question',
            reference: 'question',
            cls: 'prom-radio',
            html: radios,
            label: questionText,
            labelWrap: true,
            placeholder: 'Skriv in ett decimaltal, 3 decimaler',
            name: columnName,
            labelWidth: '60%',
            labelAlign: 'top'
          });
        }

        var onRadioclick = function () {
          var input = document.querySelector('input[name="' + columnName + '"]:checked');
          Array.prototype.map.call(document.querySelectorAll('input[name="' + columnName + '"]'), function (node) {
            node.parentNode.className = '';
          });
          if (input.value === field.getValue()) {
            input.checked = false;
            field.setValue(null);
          } else {
            field.setValue(input.value);
            input.parentNode.className = 'checked';
          }

          updateMyValue.bind(field)();
          controlFunction();
          validationFunction.bind(field)();
          validateMe.bind(field)();
        };

        for (var j = 0; j < dv.length; j++) {
          // Store a map of all ValueCodes to ValueName for summary
          NameMap[columnName][dv[j].ValueCode] = dv[j].ValueName;
          if (dv[j].IsActive) {
            // only create costum radiobuttons for questionIds in EQ5DQuestions
            if (isEQ5DQuestion) {
              var label = document.createElement('label');
              label.innerHTML = dv[j].ValueName;
              var radio = document.createElement('input');
              radio.setAttribute('type', 'radio');
              radio.setAttribute('name', columnName);
              radio.setAttribute('value', dv[j].ValueCode);
              radio.onclick = onRadioclick;
              label.appendChild(radio);
              radios.appendChild(label);
              if (j !== dv.length) {
                radios.appendChild(document.createElement('hr'));
              }
              // If the question isn't in EQ5DQuestions then we show the old select menu.
            } else {
              qOptions.push({
                text: dv[j].ValueName,
                value: dv[j].ValueCode
              });
            }
          }
        }
        if (!isEQ5DQuestion) {
          field = Ext.create('Ext.field.Select', {
            itemId: 'question',
            reference: 'question',
            label: questionText,
            labelWrap: true,
            name: columnName,
            options: qOptions,
            placeholder: 'Tryck här för att välja alternativ ....',
            labelWidth: '60%',
            labelAlign: 'top'
          });
        }

        field.on('change', updateMyValue, field, {});
        field.on('change', controlFunction, this, {});
        field.on('change', validateMe, field, {});

        fieldset.add(field);
      });
    } else {
      switch (true) {
      case (domain.DomainID === 1015): // Boolean
        field = Ext.create('Ext.field.Toggle', {
          itemId: 'question',
          reference: 'question',
          label: questionText,
          labelWrap: true,
          name: columnName,
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (domain.DomainID === 1020): // Text
        field = Ext.create('Ext.field.Text', {
          itemId: 'question',
          reference: 'question',
          label: questionText,
          labelWrap: true,
          name: columnName,
          placeholder: 'Skriv svar här',
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (domain.DomainID === 1021): // Kommentar
        field = Ext.create('Ext.field.TextArea', {
          itemId: 'question',
          reference: 'question',
          label: questionText,
          labelWrap: true,
          name: columnName,
          placeholder: 'Skriv svar här',
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (domain.DomainID === 1030): // Datum
        field = Ext.create('Ext.field.DatePicker', {
          itemId: 'question',
          reference: 'question',
          label: questionText,
          labelWrap: true,
          name: columnName,
          value: new Date(),
          labelWidth: '60%',
          labelAlign: 'top',
          dateFormat: 'Y-m-d',
          useTitles: true,
          yearText: 'År',
          monthText: 'Månad',
          dayText: 'Dag',
          error: {
            errorTarget: 'bottom'
          },
          validators: function () { updateMyValue.call(this); return validateMe.call(this); },
          doneButton: {
            ui: 'Klar!'
          }
        });
        break;
      case (domain.DomainID === 1033): // Tid
        field = Ext.create('Ext.field.Text', {
          itemId: 'question',
          reference: 'question',
          label: questionText,
          labelWrap: true,
          name: columnName,
          placeholder: 'Skriv in tid här (hh:mm)',
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (domain.DomainID === 1038): // Årtal
        field = Ext.create('Ext.field.Number', {
          itemId: 'question',
          reference: 'question',
          label: questionText,
          labelWrap: true,
          name: columnName,
          placeholder: 'Skriv in ett årtal',
          minValue: 1900,
          value: new Date().getFullYear(),
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (domain.DomainID === 1040): // heltal
        field = Ext.create('Ext.field.Number', {
          itemId: 'question',
          reference: 'question',
          label: questionText,
          labelWrap: true,
          placeholder: 'Skriv in ett heltal',
          name: columnName,
          labelWidth: '60%',
          labelAlign: 'top'
          // errorTarget: 'under'
          // validators: function (value) { if (this.isBlurring()) { /*updateMyValue.call(f); return validateMe.call(f);*/} else { return true;} }
        });
        break;
      case (domain.DomainID === 1050): // flyttal
        field = Ext.create('Ext.field.Text', {
          itemId: 'question',
          reference: 'question',
          label: questionText,
          labelWrap: true,
          placeholder: 'Skriv in ett decimaltal',
          name: columnName,
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (domain.DomainID === 1051): // decimaltal 1 decimal
        field = Ext.create('Ext.field.Text', {
          itemId: 'question',
          reference: 'question',
          label: questionText,
          labelWrap: true,
          placeholder: 'Skriv in ett decimaltal, 1 decimal',
          name: columnName,
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (domain.DomainID === 1052): // decimaltal 2 decimal
        field = Ext.create('Ext.field.Text', {
          itemId: 'question',
          reference: 'question',
          label: questionText,
          labelWrap: true,
          placeholder: 'Skriv in ett decimaltal, 2 decimaler',
          name: columnName,
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (domain.DomainID === 1053): // decimaltal 3 decimal
        field = Ext.create('Ext.field.Text', {
          itemId: 'question',
          reference: 'question',
          label: questionText,
          labelWrap: true,
          placeholder: 'Skriv in ett decimaltal, 3 decimaler',
          name: columnName,
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (domain.DomainID === 1044): // vas
        field = Ext.create('Ext.field.Field', {
          itemId: 'question',
          reference: 'question',
          html: publicRegistrator.vas(columnName),
          label: questionText,
          labelWrap: true,
          placeholder: 'Skriv in ett decimaltal, 3 decimaler',
          name: columnName,
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (domain.DomainID === 1080): // Labels
        break;
      default:
        field = Ext.create('Ext.field.Text', {
          itemId: 'question',
          reference: 'question',
          label: questionText,
          labelWrap: true,
          name: columnName,
          placeholder: 'Skriv in ' + domain.DomainTitle,
          labelWidth: '60%',
          labelAlign: 'top'
        });
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
  vasScale: function (columnName) {
    var changeValue = publicRegistrator.changeFieldValue(columnName);
    var scaleThermometer = document.createElement('div');
    scaleThermometer.className = 'scaleThermometer';
    for (var i = 100; i >= 0; i--) {
      var clickable = document.createElement('div');
      var line = document.createElement('div');
      line.className = 'line';
      clickable.className = 'clickableLine';
      clickable.style.margin = (i % 10 === 0 ? '1px' : 0) + ' 0';
      line.style.width = i % 10 === 0 ? '30px' : '15px';
      line.style.height =  i % 10 === 0 ? '3px' : '1px';
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
    scaleDiv.appendChild(publicRegistrator.vasNumbers());
    scaleDiv.appendChild(publicRegistrator.vasScale(columnName));

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
    scaleInfoContainer.appendChild(publicRegistrator.vasScaleWithHeaders(columnName));
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
};
