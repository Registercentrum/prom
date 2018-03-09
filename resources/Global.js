// Global this application START

var Current = {}; // lagrar data om det aktiva formuläret
var NameMap = {};
var Parent = null; // lagrar data om det aktiva formuläret
var controlFunctions = [];
var validationFunctions = [];

var controlFunction = function () {
  for (i = 0; i < controlFunctions.length; ++i) {
    controlFunctions[i]();
  }
};
var validationFunction = function () {
  for (i = 0; i < validationFunctions.length; ++i) {
    var ret = validationFunctions[i].validationFunction();
    var q = Ext.getCmp('registrationform').getComponent(validationFunctions[i].columnName);

    if (ret != true) {q.validationMessage = ret;} else {q.validationMessage = null;}
  }
};
var assignIf = function (condition, qName, value) {
  // if (condition)
  //    Current[qName] = value;
  if (condition) {
    var q = Ext.getCmp('registrationform').getComponent(qName).getComponent('fieldset').getComponent('question');

    if (typeof q !== 'undefined') {Ext.getCmp('registrationform').getComponent(qName).getComponent('fieldset').getComponent('question').setValue(value);}
  }
};
var displayIf = function (condition, qName) {
  var rf = Ext.getCmp('registrationform');
  var q = rf.getComponent(qName);

  if (!condition) {
    q.isHiddenByScript = true;
    summary = rf.getInnerItems()[rf.getInnerItems().length - 1]; // placed in cache
    summaryQuestion = summary.getComponent('summaryFieldset').getComponent(qName).setHidden(true);
  } else {
    q.isHiddenByScript = false;
    summary = rf.getInnerItems()[rf.getInnerItems().length - 1]; // placed in cache
    summaryQuestion = summary.getComponent('summaryFieldset').getComponent(qName).setHidden(false);
  }
};
var enableIf = function (condition, qName) {
  displayIf(condition, qName);
};
// Global this application END


var Global = {
  ParseDate: function (v) {
    if (v === null || v === undefined) {
      return null;
    }

    var c = v.indexOf('T') >= 0 ? v.split('T') : v.split(' ');
    var d = c[0] && c[0].split('-');
    var t = c[1] && c[1].split(':');
    if (t) {return new Date(d[0], d[1] - 1, d[2], t[0], t[1], t[2], 0);} return new Date(d[0], d[1] - 1, d[2], 0);
  },
  CalculateAge: function (s, d) {
    var age, dm, sm, dd, sd;
    if (s === null || s === undefined || d === null || d === undefined) {
      return null;
    }
    if (Object.prototype.toString.call(d) === '[object Date]') {
      age = d.getFullYear() - +(s.substring(0, 4));
      dm = d.getMonth() + 1;
      dd = d.getDate();
    } else {
      age = +(d.substring(0, 4)) - +(s.substring(0, 4));
      dm = +(d.substring(5, 7));
      dd = +(d.substring(8, 10));
    }
    sm = +(s.substring(4, 6));
    sd = +(s.substring(6, 8));
    if (sd > 60) sd -= 60;
    if (dm < sm || (dm === sm && dd < sd)) age--;
    return age;
  },
  CalculateSex: function (s) {
    return s === null || s === undefined ? null : 2 - (+(s.charAt(s.length - 2)) % 2);
  },
  Between: function (v, l, u) {
    return v === null || v === undefined || v >= l && v <= u;
  },
  Validate: function (v, d) {
    if (v === null || v === '') {
      return true;
    }
    if (typeof v === 'string') { v = v.replace(/[^ -~]/g, ''); }

    switch (d) {
    case 1015:
      return (v == 'true' || v == 'false' || v == 1 || v == 0) ? true : 'Logiskt värde förväntades.';
    case 1020:
      return v.length <= 80 ? true : 'Maximalt 80 tecken förväntades.';
    case 1025:
      return (/^[0-9a-zA-Z_\$#][0-9a-zA-Z_\-\$#]*([\.\$#][0-9a-zA-Z_\-\$#]+)*@[0-9a-zA-Z_\.\$#]+\.[a-zA-Z]{2,5}$/).test(v) && v.indexOf('..') < 0 ? true : 'E-postadressen är ogiltig. Den får till exempel inte innehålla å, ä eller ö.';
    case 1030:
      return new RegExp(/^([1-9]\d{3}-((0[1-9]|1[012])-(0[1-9]|1\d|2[0-8])|(0[13456789]|1[012])-(29|30)|(0[13578]|1[02])-31)|(([2-9]\d)(0[48]|[2468][048]|[13579][26])|(([2468][048]|[3579][26])00))-02-29)([T ]00:00:00)?$/).test(v) && this.Between(this.ParseDate(v), new Date(1900, 0, 1), new Date(2079, 5, 6)) ? true : 'Datum på formen yyyy-mm-dd förväntades.';
    case 1033:
      return new RegExp(/^(20|21|22|23|[0-1]\d):[0-5]\d(:[0-5]\d)?$/).test(v) ? true : 'Tidsangivelse på formen hh:mm:ss eller hh:mm förväntades.';
    case 1036:
      return new RegExp(/^([1-9]\d{3}-((0[1-9]|1[012])-(0[1-9]|1\d|2[0-8])|(0[13456789]|1[012])-(29|30)|(0[13578]|1[02])-31)|(([2-9]\d)(0[48]|[2468][048]|[13579][26])|(([2468][048]|[3579][26])00))-02-29)[T ](20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/).test(v) && this.Between(this.ParseDate(v), new Date(1900, 0, 1), new Date(2079, 5, 6)) ? true : 'Tidsstämpel på formatet yyyy-mm-dd hh:mm:ss förväntades.';
    case 1038:
      return new RegExp(/^\d{4}$/).test(v) && this.Between(v, 1900, 2079) ? true : 'Årtal mellan 1900 och 2079 förväntades.';
    case 1040:
      return new RegExp(/^(\-)?\d{1,10}$/).test(v) && this.Between(v, -2147483648, 2147483647) ? true : 'Heltal med maximalt nio siffror förväntades.';
    case 1044:
      return new RegExp(/^\d{1,3}$/).test(v) && this.Between(v, 0, 100) ? true : 'Heltal mellan 0 och 100 förväntades.';
    case 1050:
      return new RegExp(/^(\-)?\d{1,8}(\.\d{1,10})?$/).test(v) ? true : 'Decimaltal förväntades.';
    case 1051:
      return new RegExp(/^(\-)?\d{1,8}(\.\d{1}$)?/).test(v) ? true : 'Tal med en decimal förväntades.';
    case 1052:
      return new RegExp(/^(\-)?\d{1,8}(\.\d{2}$)?/).test(v) ? true : 'Tal med två decimaler förväntades.';
    case 1053:
      return new RegExp(/^(\-)?\d{1,8}(\.\d{3}$)?/).test(v) ? true : 'Tal med tre decimaler förväntades.';
    }
    return true;
  },
  ParentOf: function (e, h) {
    if (!e || !h) {
      return null;
    }
    if (e.Parent) {
      return e.Parent;
    }
    for (var n in h) {
      var f = h[n];
      var l = f.Registrations;
      for (var i = 0; i < l.length; i++) {
        var p = l[i];
        if (p.EventID === e.ParentEventID) {
          return p;
        }
      }
    }
    return null;
  },
  ChildrenOf: function (e, h, x) {
    if (!e || !h) {
      return null;
    }
    var c = [];
    if (e.Children) {
      if (x) {
        for (var i = 0; i < e.Children.length; i++) {
          var p = e.Children[i];
          if (p.Form === x) {
            c.push(p);
          }
        }
        return c;
      }
      return e.Children;
    }
    if (x) {
      var l = h[x.FormName].Registrations;
      for (var i = 0; i < l.length; i++) {
        var p = l[i];
        if (p.ParentEventID === e.EventID) {
          c.push(p);
        }
      }
    } else {
      for (var n in h) {
        var f = h[n];
        var l = f.Registrations;
        for (var i = 0; i < l.length; i++) {
          var p = l[i];
          if (p.ParentEventID === e.EventID) {
            c.push(p);
          }
        }
      }
    }
    return c;
  },
  LatestOf: function (e, h) {
    if (!e || !h) {
      return null;
    }
    var f = h[e.Form.FormName];
    var l = f && f.Registrations;
    if (!l || !l[0]) {return null;} return l[0];
  }
};
