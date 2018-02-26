
var publicRegistrator = {
  init: function (config) {
    this.config = config;
    this.addExtensions();
    this.initInvitation(this.buildForm);
  },
  initInvitation: function (callback) {
    var self = this;

    self.formStore = Ext.getStore('Form');
    self.unitStore = Ext.getStore('Unit');
    self.invitationStore = Ext.getStore('Invitation');
    self.questionStore = Ext.getStore('Question');
    self.domainStore = Ext.getStore('Domain');

    self.invitationStore.setUrlByToken();
    self.invitationStore.load(function () {
      callback(self);
    });
  },

  addExtensions: function () {
    // Ext.override('Ext.Picker', {
    //   doneButton: 'Klar',
    //   cancelButton: 'Avbryt'
    // });

    Ext.apply(Ext.util.Format, {
      defaultDateFormat: 'd/m/Y'
    });

    Ext.util.Format.decimalSeparator = ',';
  },
  buildForm: function (self) {
    var i = 0;
    var n;
    var appMetaForm = [];
    var invitation = self.invitationStore.getAt(0);
    var errorMessage;

    var replyStatus = invitation.get('ReplyStatus');

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
      var p = Ext.create('PublicRegistrator.view.Message');
      p.getComponent('title').setTitle('Fel vid hämtning av formulär');
      p.getComponent('message').setData({message: errorMessage});
      Ext.Viewport.add(p);
      return;
    }

    if (invitation.data.Initials) {
      Current = invitation.data.Initials;
    }

    self.formStore.setData([invitation.get('Form')]);
    self.unitStore.setData([invitation.get('Unit')]);

    var form = self.formStore.getAt(0);
    var unit = self.unitStore.getAt(0);

    self.questionStore.setData(form.get('Questions'));

    var reg = Ext.create('PublicRegistrator.view.Registration');
    var summary = Ext.create('PublicRegistrator.view.Summary');
    var summaryFieldset = summary.getComponent('summaryFieldset');

    formTitlebar = Ext.getCmp('formTitlebar');
    formTitlebar.setTitle(invitation.get('Form').FormTitle);
    pnReg = Ext.getCmp('registrationform');

    self.questionStore.filterBy(function (q) {
      var mappedTo = q.get('MappedTo');
      var domain = q.get('Domain');

      // if (domain.DomainID == 1080) //"sektion" - skall inte bli en fråga
      //    return;
      // if (domain.DomainID != 1044) //"sektion" - skall inte bli en fråga
      //    return;

      if (mappedTo == null) {return q;}

      switch (mappedTo) // skall endast hantera EventDate
      {
      case 'EventDate':
        return q;
        break;
      }
    });

    n = self.questionStore.getCount();

    self.questionStore.each(function (q) {
      i++;

      // add infopanel to VAS-scale
      if (q.data.Domain.DomainID === 1044) {
        var pnInfo = self.buildInfoPanel(self.getVASInfo(i, n));
        pnReg.add(pnInfo);
      }

      // add question to tabpanel
      var pnQuestion = self.buildQuestion(q, i, n, appMetaForm, self, form.data.FormID);
      pnReg.add(pnQuestion);

      // add question to summary
      var pnQuestionSummary = self.buildSummaryField(q, i, n, appMetaForm);
      summaryFieldset.add(pnQuestionSummary);
    });

    pnReg.add(summary);

    panel = Ext.Viewport.add(reg);

    // kör controlskript först en gång
    controlFunction();
  },
  buildSummaryField: function (q, i, n, appMetaForm) {
    var pn = Ext.create('PublicRegistrator.view.QuestionSummary');
    pn.setItemId(q.get('ColumnName'));//
    pn.getComponent('header').setData({
      questionNo: i + '. ' + appMetaForm[ i - 1].questionText
    });
    // pn.getComponent('summaryQuestion').setData({
    //   questionText: appMetaForm[i - 1].questionText
    // });

    return pn;
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
  buildQuestion: function (q, i, n, m, self, formID) {
    var f;
    var pn = Ext.create('PublicRegistrator.view.Question');
    // var pnButton = Ext.create('PublicRegistrator.view.ButtonPanel');
    var qf = pn.getComponent('questionfieldset').setTitle('Fråga ' + i + ' av ' + n);
    var d = q.get('Domain');
    var questionText = self.buildQuestionText(q);
    var columnName = q.get('ColumnName');
    pn.isMandatory = q.get('IsMandatory');
    var cs = q.get('ControlScript');
    var vs = q.get('ValidationScript');

    pn.setItemId(columnName);//
    pn.domainID = d.DomainID;

    m.push({
      questionNo: i,
      questionText: questionText,
      columnName: columnName
    });

    var updateMyValue = function () {
      var v = this.getValue();
      if (v instanceof Date) {
        v = v.toLocaleDateString('sv-SE');
      }

      Current[columnName] = v;
    };
    var validateMe = function () {
      if(this.getParent()){
        var q = this.getParent().getParent();
        var answer = q.validate();
        return answer;
      } else return true;
    };

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

    if (cs != null) {
      if (cs.indexOf('Parent') == -1) {
        var fn = new Function(cs);
        controlFunctions.push(fn);
      }
    }
    if (vs != null) {
      if (vs.indexOf('Parent') == -1) {
        var fn = new Function(vs);
        validationFunctions.push({
          columnName: columnName,
          validationFunction: fn
        });
      }
    }

    // fråga har domänvärden
    if (d.IsEnumerated) {
      var store = Ext.create('PublicRegistrator.store.Domain');
      store.setDomainUrl(d.DomainID);
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
        var isEQ5DQuestion = EQ5DQuestions.indexOf(parseInt(d.DomainID)) !== -1;
        if (isEQ5DQuestion) {
          f = Ext.create('Ext.field.Field', {
            itemId: 'question',
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
        for (var i = 0; i < dv.length; i++) {
          // Store a map of all ValueCodes to ValueName for summary
          NameMap[columnName][dv[i].ValueCode] = dv[i].ValueName;
          if (dv[i].IsActive) {
            // only create costum radiobuttons for questionIds in EQ5DQuestions
            if (isEQ5DQuestion) {
              /*
                            f = Ext.create('Ext.field.Field', {
                              itemId: 'question',
                              html: radios,
                              label: questionText,
                              labelWrap: true,
                              placeholder: 'Skriv in ett decimaltal, 3 decimaler',
                              name: columnName,
                              labelWidth: '60%',
                              labelAlign: 'top'
                            });
                            */
              var label = document.createElement('label');
              var text = document.createElement('p');
              label.innerHTML = dv[i].ValueName;
              radio = document.createElement('input');
              radio.setAttribute('type', 'radio');
              radio.setAttribute('name', columnName);
              radio.setAttribute('value', dv[i].ValueCode);
              radio.onclick = function () {
                var input = document.querySelector('input[name="' + columnName + '"]:checked');
                Array.prototype.map.call(document.querySelectorAll('input[name="' + columnName + '"]'), function (i) {
                  i.parentNode.className = '';
                });
                if (input.value == f.getValue()) {
                  input.checked = false;
                  f.setValue(null);
                } else {
                  f.setValue(input.value);
                  input.parentNode.className = 'checked';
                }

                updateMyValue.bind(f)();
                controlFunction();
                validationFunction.bind(f)();
                validateMe.bind(f)();
              };
              label.appendChild(radio);
              radios.appendChild(label);
              if (i != dv.length) {
                radios.appendChild(document.createElement('hr'));
              }
              // If the question isn't in EQ5DQuestions then we show the old select menu.
            } else {
              qOptions.push({
                text: dv[i].ValueName,
                value: dv[i].ValueCode
              });
            }
          }
        }
        if (!isEQ5DQuestion) {
          f = Ext.create('Ext.field.Select', {
            itemId: 'question',
            label: questionText,
            labelWrap: true,
            name: columnName,
            options: qOptions,
            placeholder: 'Tryck här för att välja alternativ ....',
            labelWidth: '60%',
            labelAlign: 'top'
          });
        }

        f.on('change', updateMyValue, f, {});
        f.on('change', controlFunction, this, {});
        f.on('change', validateMe, f, {});

        qf.add(f);
      });
    } else {
      switch (true) {
      case (d.DomainID == 1015): // Boolean
        f = Ext.create('Ext.field.Toggle', {
          itemId: 'question',
          label: questionText,
          labelWrap: true,
          name: columnName,
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (d.DomainID == 1020): // Text
        f = Ext.create('Ext.field.Text', {
          itemId: 'question',
          label: questionText,
          labelWrap: true,
          name: columnName,
          placeholder: 'Skriv svar här',
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (d.DomainID == 1021): // Kommentar
        f = Ext.create('Ext.field.TextArea', {
          itemId: 'question',
          label: questionText,
          labelWrap: true,
          name: columnName,
          placeholder: 'Skriv svar här',
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (d.DomainID == 1030): // Datum
        f = Ext.create('Ext.field.DatePicker', {
          itemId: 'question',
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
      case (d.DomainID == 1033): // Tid
        f = Ext.create('Ext.field.Text', {
          itemId: 'question',
          label: questionText,
          labelWrap: true,
          name: columnName,
          placeholder: 'Skriv in tid här (hh:mm)',
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (d.DomainID == 1038): // Årtal
        f = Ext.create('Ext.field.Number', {
          itemId: 'question',
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
      case (d.DomainID == 1040): // heltal
        f = Ext.create('Ext.field.Number', {
          itemId: 'question',
          label: questionText,
          labelWrap: true,
          placeholder: 'Skriv in ett heltal',
          name: columnName,
          labelWidth: '60%',
          labelAlign: 'top',
          // errorTarget: 'under'
          // validators: function (value) { if (this.isBlurring()) { /*updateMyValue.call(f); return validateMe.call(f);*/} else { return true;} }
        });
        break;
      case (d.DomainID == 1050): // flyttal
        f = Ext.create('Ext.field.Text', {
          itemId: 'question',
          label: questionText,
          labelWrap: true,
          placeholder: 'Skriv in ett decimaltal',
          name: columnName,
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (d.DomainID == 1051): // decimaltal 1 decimal
        f = Ext.create('Ext.field.Text', {
          itemId: 'question',
          label: questionText,
          labelWrap: true,
          placeholder: 'Skriv in ett decimaltal, 1 decimal',
          name: columnName,
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (d.DomainID == 1052): // decimaltal 2 decimal
        f = Ext.create('Ext.field.Text', {
          itemId: 'question',
          label: questionText,
          labelWrap: true,
          placeholder: 'Skriv in ett decimaltal, 2 decimaler',
          name: columnName,
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (d.DomainID == 1053): // decimaltal 3 decimal
        f = Ext.create('Ext.field.Text', {
          itemId: 'question',
          label: questionText,
          labelWrap: true,
          placeholder: 'Skriv in ett decimaltal, 3 decimaler',
          name: columnName,
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (d.DomainID == 1044): // vas
        f = Ext.create('Ext.field.Field', {
          itemId: 'question',
          html: publicRegistrator.vas(columnName),
          label: questionText,
          labelWrap: true,
          placeholder: 'Skriv in ett decimaltal, 3 decimaler',
          name: columnName,
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      case (d.DomainID == 1080): // Labels
        break;
      default:
        f = Ext.create('Ext.field.Text', {
          itemId: 'question',
          label: questionText,
          labelWrap: true,
          name: columnName,
          placeholder: 'Skriv in ' + d.DomainTitle,
          labelWidth: '60%',
          labelAlign: 'top'
        });
        break;
      }

      f.on('change', updateMyValue, f, {});
      f.on('change', controlFunction, this, {});
      f.on('change', validateMe, f, {});

      qf.add(f);
    }
    Current[columnName] = null;

    pn.add(qf);
    return pn;
  },
  // Creates the lines for Vas scale and appends the onClick handler
  vasScale: function (columnName) {
    var changeValue = publicRegistrator.changeFieldValue(columnName);
    var scaleThermometer = document.createElement('div');
    scaleThermometer.className = 'scaleThermometer';
    for (var i = 100; i >= 0; i--) {
      var clickable = document.createElement('div');
      var line = document.createElement('div');
      line.className = 'line';
      clickable.className = 'clickableLine';
      clickable.style.margin = (i % 10 == 0 ? '1px' : 0) + ' 0';
      line.style.width = i % 10 == 0 ? '30px' : '15px';
      line.style.height =  i % 10 == 0 ? '3px' : '1px';
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
