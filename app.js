Ext.application({
  name: 'PublicRegistrator',

  requires: [
    'Ext.MessageBox', 'Ext.field.DatePicker', 'Ext.field.Toggle', 'Ext.field.Number', 'Ext.field.Select', 'Ext.util.sizemonitor.OverflowChange', 'Ext.field.ComboBox'
  ],
  controllers: ['Login'],
  models: ['Invitation', 'Form', 'Unit', 'Question', 'Domain', 'Login'],
  views: ['Registration', 'RegistrationForm', 'Question', 'QuestionFieldSet', 'Summary', 'QuestionSummary', 'Success', 'Failure', 'LoadError', 'NotFound', 'Login'],
  stores: ['Invitation', 'Form', 'Unit', 'Question', 'Domain'],

  icon: {
    57: 'resources/icons/Icon.png',
    72: 'resources/icons/Icon~ipad.png',
    114: 'resources/icons/Icon@2x.png',
    144: 'resources/icons/Icon~ipad@2x.png'
  },

  isIconPrecomposed: true,

  startupImage: {
    '320x460': 'resources/startup/320x460.jpg',
    '640x920': 'resources/startup/640x920.png',
    '768x1004': 'resources/startup/768x1004.png',
    '748x1024': 'resources/startup/748x1024.png',
    '1536x2008': 'resources/startup/1536x2008.png',
    '1496x2048': 'resources/startup/1496x2048.png'
  },

  launch: function () {
    /* Overrides due to Chrome 43 */
    Ext.override(Ext.util.SizeMonitor, {
      constructor: function (config) {
        var namespace = Ext.util.sizemonitor;

        if (Ext.browser.is.Firefox) {
          return new namespace.OverflowChange(config);
        } else if (Ext.browser.is.WebKit) {
          if (!Ext.browser.is.Silk && Ext.browser.engineVersion.gtEq('535') && !Ext.browser.engineVersion.ltEq('537.36')) {
            return new namespace.OverflowChange(config);
          }
          return new namespace.Scroll(config);
        } else if (Ext.browser.is.IE11) {
          return new namespace.Scroll(config);
        }
        return new namespace.Scroll(config);
      }
    });

    Ext.override(Ext.util.PaintMonitor, {
      constructor: function (config) {
        if (Ext.browser.is.Firefox || (Ext.browser.is.WebKit && Ext.browser.engineVersion.gtEq('536') && !Ext.browser.engineVersion.ltEq('537.36') && !Ext.os.is.Blackberry)) {
          return new Ext.util.paintmonitor.OverflowChange(config);
        }

        return new Ext.util.paintmonitor.CssAnimation(config);
      }
    });
    /* Overrrides End */


    // Destroy the #appLoadingIndicator element
    Ext.fly('appLoadingIndicator').destroy();

    // Initialize the main view
    // Ext.Viewport.add(Ext.create('PublicRegistrator.view.Main'));

    var token = this.getParameterByName('token');
    var baseURL = window.location.hostname;
    var apikey = !(baseURL === 'rc-utv.rcvg.local' || baseURL === 'demo.registercentrum.se') ? 'r-NYROaDruQ=' : 'Yj0IKgS-VQQ=';

    if (token !== '') {
      publicRegistrator.init({
        token: token,
        APIKey: apikey,
        baseURL: baseURL
      });
    } else {
      Ext.Viewport.add(Ext.create('PublicRegistrator.view.Login'));
    }
  },
  onUpdated: function () {
    Ext.Msg.confirm(
      'Application Update',
      'This application has just successfully been updated to the latest version. Reload now?',
      function (buttonId) {
        if (buttonId === 'yes') {
          window.location.reload();
        }
      }
    );
  },
  getParameterByName: function (name) {
    var filteredName = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
    var regex = new RegExp('[\\?&]' + filteredName + '=([^&#]*)', 'i');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }
});

