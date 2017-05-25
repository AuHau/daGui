import SparkAdapter from '../../../app/adapters/spark';
import Python from '../../../app/core/languages/Python';

export default {
  name: 'Untitled',
  path: '',
  lastHistorySaved: 0,
  adapter: SparkAdapter,
  language: Python,
  adapterVersion: '2.1',
  languageVersion: '',
  $selected: [],
  $pan: {
    x: 0,
    y: 0
  },
  zoom: 1,
  "history": {
    past: [],
    future: [],
    present: {
      historyId: 0,
      "usedVariables": {},
      $occupiedPorts: {},
      "cells": []
    }
  }
}
