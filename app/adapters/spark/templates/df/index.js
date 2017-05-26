import ReadJson from './readJson';
import ReadParquet from './readParquet';
import CreateDataFrame from './createDataFrame';
import Select from './select';
import GroupBy from './groupBy';
import Join from './join';
import Where from './where';
import OrderBy from './orderBy';
import Limit from './limit';
import WriteJson from './writeJson';
import WriteParquet from './writeParquet';

export const allNodeTemplates = {
  [ReadJson.getType()]: ReadJson,
  [ReadParquet.getType()]: ReadParquet,
  [CreateDataFrame.getType()]: CreateDataFrame,
  [Select.getType()]: Select,
  [Where.getType()]: Where,
  [Join.getType()]: Join,
  [GroupBy.getType()]: GroupBy,
  [OrderBy.getType()]: OrderBy,
  [Limit.getType()]: Limit,
  [WriteParquet.getType()]: WriteParquet,
  [WriteJson.getType()]: WriteJson,
};

export const groupedTemplates = [
  {
    name: 'DF Input',
    tags: 'df',
    templates: [
      ReadJson,
      ReadParquet,
      CreateDataFrame,
    ]
  },
  {
    name: 'DF Functions',
    tags: 'df',
    templates: [
      Select,
      Where,
      Join,
      GroupBy,
      Limit,
      OrderBy,
    ]
  },
  {
    name: 'DF Writers',
    tags: 'df',
    templates: [
      WriteParquet,
      WriteJson,
    ]
  },
];
