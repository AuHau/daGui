import SparkAdapter from '../../../app/adapters/spark';
import Python from '../../../app/core/languages/Python';

export default {
  name: 'Untitled',
  path: '',
  lastSavedHash: '',
  adapter: SparkAdapter,
  language: Python,
  adapterTarget: '2.1',
  languageTarget: '',
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
      "usedVariables": {},
      $occupiedPorts: {},
      "cells": []
    }
  }
}
