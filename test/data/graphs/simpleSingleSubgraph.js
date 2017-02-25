import SparkAdapter from '../../../app/adapters/spark';
import Python from '../../../app/core/languages/Python';

export default {
  name: 'Simple.py',
  adapter: SparkAdapter,
  language: Python,
  "usedVariables": {
    "input": "c9615ee0-89ee-4b31-8168-fa374461d542"
  },
  $occupiedPorts: {

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
