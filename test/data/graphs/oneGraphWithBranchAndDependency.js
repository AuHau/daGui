import SparkAdapter from '../../../app/adapters/spark';
import Python from '../../../app/core/languages/Python';

export default {
  "name": "BranchDependency.py",
  adapter: SparkAdapter,
  language: Python,
  "usedVariables": {
    "filter": "4711005e-b525-4279-8adb-4ee563f2c3f4",
    "count": "354735b1-a66f-4f16-83eb-5b5b36296468",
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
          "x": 113,
          "y": 140
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
          "x": 571,
          "y": 141
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
        "size": {
          "width": 60,
          "height": 30
        },
        "attrs": {},
        "position": {
          "x": 265,
          "y": 141
        },
        "ports": {
          "items": [
            {
              "id": "in",
              "group": "in"
            },
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
          "description": "Map",
          "variableName": null,
          "parameters": [
            "lambda x: x==2"
          ]
        },
        "z": 2,
        "type": "spark.map",
        "id": "cf65a51b-d978-477e-aa79-5d51aa0fc805"
      },
      {
        "size": {
          "width": 60,
          "height": 30
        },
        "attrs": {},
        "position": {
          "x": 413,
          "y": 141
        },
        "ports": {
          "items": [
            {
              "id": "in",
              "group": "in"
            },
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
          "description": "Filter",
          "variableName": "filter",
          "parameters": [
            "lambda x: x == count"
          ]
        },
        "z": 1,
        "type": "spark.filter",
        "id": "4711005e-b525-4279-8adb-4ee563f2c3f4"
      },
      {
        "type": "link",
        "source": {
          "id": "c9615ee0-89ee-4b31-8168-fa374461d542",
          "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
          "port": "out"
        },
        "target": {
          "id": "cf65a51b-d978-477e-aa79-5d51aa0fc805",
          "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
          "port": "in"
        },
        "smooth": true,
        "id": "3123f140-4efe-41ba-bb96-065b76f5605c",
        "z": 3,
        "attrs": {
          ".marker-target": {
            "d": "M 10 0 L 0 5 L 10 10 z"
          }
        }
      },
      {
        "type": "link",
        "source": {
          "id": "cf65a51b-d978-477e-aa79-5d51aa0fc805",
          "selector": "g:nth-child(1) > g:nth-child(5) > circle:nth-child(1)",
          "port": "out"
        },
        "target": {
          "id": "4711005e-b525-4279-8adb-4ee563f2c3f4",
          "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
          "port": "in"
        },
        "smooth": true,
        "id": "6371a7d5-83e7-4f8a-b401-5fd0da533d63",
        "z": 4,
        "attrs": {
          ".marker-target": {
            "d": "M 10 0 L 0 5 L 10 10 z"
          }
        }
      },
      {
        "type": "link",
        "source": {
          "id": "4711005e-b525-4279-8adb-4ee563f2c3f4",
          "selector": "g:nth-child(1) > g:nth-child(5) > circle:nth-child(1)",
          "port": "out"
        },
        "target": {
          "id": "b550c243-edb1-4af0-bd20-bb090caabbea",
          "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
          "port": "in"
        },
        "smooth": true,
        "id": "d05ff6bf-9c0a-43b0-9b3d-ab67d8b43eda",
        "z": 5,
        "attrs": {
          ".marker-target": {
            "d": "M 10 0 L 0 5 L 10 10 z"
          }
        }
      },
      {
        "size": {
          "width": 60,
          "height": 30
        },
        "attrs": {},
        "position": {
          "x": 411,
          "y": 57
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
          "variableName": "count",
          "parameters": []
        },
        "z": 1,
        "type": "spark.count",
        "id": "354735b1-a66f-4f16-83eb-5b5b36296468"
      },
      {
        "type": "link",
        "source": {
          "id": "cf65a51b-d978-477e-aa79-5d51aa0fc805",
          "selector": "g:nth-child(1) > g:nth-child(5) > circle:nth-child(1)",
          "port": "out"
        },
        "target": {
          "id": "354735b1-a66f-4f16-83eb-5b5b36296468",
          "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
          "port": "in"
        },
        "smooth": true,
        "id": "18c26241-6510-4a53-bcc9-0f73bcdae15c",
        "z": 6,
        "attrs": {
          ".marker-target": {
            "d": "M 10 0 L 0 5 L 10 10 z"
          }
        }
      }
    ]
  }
}

