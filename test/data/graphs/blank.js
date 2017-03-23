import SparkAdapter from '../../../app/adapters/spark';
import Python from '../../../app/core/languages/Python';

export default {
  name: 'Blank.py',
  adapter: SparkAdapter,
  language: Python,
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
