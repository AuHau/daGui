import {groupedTemplates as dfGroupedTemplates, allNodeTemplates as dfAllNodeTemplates } from './df';
import {groupedTemplates as rddGroupedTemplates, allNodeTemplates as rddAllNodeTemplates } from './rdd';

import ConvertRddToDf from './other/convertRddToDf';
import ConvertDfToRdd from './other/convertDfToRdd';

export const allNodeTemplates = {
  ...dfAllNodeTemplates,
  ...rddAllNodeTemplates,
  [ConvertRddToDf.getType()]: ConvertRddToDf,
  [ConvertDfToRdd.getType()]: ConvertDfToRdd,
};

export const groupedTemplates = [
  ...dfGroupedTemplates,
  ...rddGroupedTemplates,
  {
    name: 'Conversions',
    tags: null,
    templates: [
      ConvertRddToDf,
      ConvertDfToRdd
    ]
  },
];
