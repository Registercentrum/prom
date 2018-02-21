Ext.define('PublicRegistrator.model.Question', {
  extend: 'Ext.data.Model',
  config: {
    fields: ['QuestionID', 'ColumnName', 'ControlScript', 'ValidationScript', 'CalculationScript', 'MappedTo', 'PrefixText', 'SuffixText', 'RunOnce', 'Sequence', 'Position', 'Span', 'IsMandatory', 'IsIdentifier', 'DataType', 'Level', 'Domain']
  }
});
