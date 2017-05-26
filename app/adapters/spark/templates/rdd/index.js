import Count from './count';
import Filter from './filter';
import Map from './map';
import MapPartitions from './mapPartitions';
import Union from './union';
import Parallelize from './parallelize';
import Collect from './collect';
import Foreach from './foreach';
import LoadTextFile from './loadTextFile';
import LoadPickleFile from './loadPickleFile';
import Range from './range';
import SaveAsPickleFile from './saveAsPickleFile';
import SaveAsTextFile from './saveAsTextFile';
import Sum from './sum';

export const allNodeTemplates = {
  [Count.getType()]: Count,
  [Filter.getType()]: Filter,
  [Map.getType()]: Map,
  [MapPartitions.getType()]: MapPartitions,
  [Union.getType()]: Union,
  [Parallelize.getType()]: Parallelize,
  [Collect.getType()]: Collect,
  [Foreach.getType()]: Foreach,
  [LoadTextFile.getType()]: LoadTextFile,
  [LoadPickleFile.getType()]: LoadPickleFile,
  [SaveAsPickleFile.getType()]: SaveAsPickleFile,
  [SaveAsTextFile.getType()]: SaveAsTextFile,
  [Sum.getType()]: Sum,
  [Range.getType()]: Range,
};

export const groupedTemplates = [
  {
    name: 'RDD Transformations',
    tags: 'rdd',
    templates: [
      Filter,
      Map,
      MapPartitions,
      Union,
      Collect,
    ]
  },
  {
    name: 'RDD Actions',
    tags: 'rdd',
    templates: [
      Count,
      Foreach,
      SaveAsPickleFile,
      SaveAsTextFile,
      Sum
    ]
  },
  {
    name: 'RDD Input',
    tags: 'rdd',
    templates: [
      Parallelize,
      LoadTextFile,
      LoadPickleFile,
      Range
    ]
  },
];
