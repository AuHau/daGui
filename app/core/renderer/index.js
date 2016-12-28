// @flow
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../shared/store/configureStore';
import Immutable from 'immutable';
import './app.global.scss';

// Containers
import App from './containers/App';
import Startup from './containers/Startup';

// TODO: Not hardcoded
import SparkAdapter from '../../adapters/spark';
import Python from '../languages/Python';

const initState = Immutable.fromJS({
  files: {
    active: 0, // Index of active file
    opened: [
      {
        name: 'Test.scala',
        adapter: SparkAdapter,
        language: Python,
        "usedVariables": {
          "parallelize2": true,
          "input": true
        },
        "graph": {
          "cells": [
            {
              "size": {
                "width": 60,
                "height": 30
              },
              "attrs": {},
              "position": {
                "x": 190.5,
                "y": 132
              },
              "ports": {
                "items": [
                  {
                    "id": "out",
                    "group": "out"
                  }
                ],
                "groups": {
                  "in": {
                    "position": {
                      "name": "left"
                    },
                    "attrs": {
                      ".port-label": {
                        "fill": "#000"
                      },
                      ".port-body": {
                        "fill": "#16A085",
                        "stroke": "#000",
                        "r": 10,
                        "magnet": "passive"
                      }
                    }
                  },
                  "out": {
                    "position": {
                      "name": "right"
                    },
                    "attrs": {
                      ".port-label": {
                        "fill": "#000"
                      },
                      ".port-body": {
                        "fill": "#E74C3C",
                        "stroke": "#000",
                        "r": 10,
                        "magnet": true
                      }
                    }
                  }
                }
              },
              "angle": 0,
              "dfGui": {
                "description": "Parallelize",
                "variableName": "input",
                "parameters": [
                  "['a', 'b']"
                ]
              },
              "z": 1,
              "type": "spark.parallelize",
              "id": "c9615ee0-89ee-4b31-8168-fa374461d542"
            },
            {
              "size": {
                "width": 60,
                "height": 30
              },
              "attrs": {},
              "position": {
                "x": 412,
                "y": 132
              },
              "ports": {
                "items": [
                  {
                    "id": "in",
                    "group": "in"
                  }
                ],
                "groups": {
                  "in": {
                    "position": {
                      "name": "left"
                    },
                    "attrs": {
                      ".port-label": {
                        "fill": "#000"
                      },
                      ".port-body": {
                        "fill": "#16A085",
                        "stroke": "#000",
                        "r": 10,
                        "magnet": "passive"
                      }
                    }
                  },
                  "out": {
                    "position": {
                      "name": "right"
                    },
                    "attrs": {
                      ".port-label": {
                        "fill": "#000"
                      },
                      ".port-body": {
                        "fill": "#E74C3C",
                        "stroke": "#000",
                        "r": 10,
                        "magnet": true
                      }
                    }
                  }
                }
              },
              "angle": 0,
              "dfGui": {
                "description": "Count",
                "variableName": null,
                "parameters": []
              },
              "z": 1,
              "type": "spark.count",
              "id": "b550c243-edb1-4af0-bd20-bb090caabbea"
            },
            {
              "type": "link",
              "source": {
                "id": "c9615ee0-89ee-4b31-8168-fa374461d542",
                "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
                "port": "out"
              },
              "target": {
                "id": "b550c243-edb1-4af0-bd20-bb090caabbea",
                "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
                "port": "in"
              },
              "smooth": true,
              "id": "ca38e690-737d-42fc-8359-94d48058efd5",
              "z": 2,
              "attrs": {
                ".marker-target": {
                  "d": "M 10 0 L 0 5 L 10 10 z"
                }
              }
            }
          ]
        }
      }
    ]
  },
  ui: {
    canvasContainerSpec: {},
    detailNodeId: null,
    showSettingsWindow: false,
    showCodeView: false
  }
});

const store = configureStore(initState);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
