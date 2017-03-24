import SparkAdapter from '../../../app/adapters/spark';
import Python from '../../../app/core/languages/Python';

export default {
  "name": "ThreeGraphs.py",
  adapter: SparkAdapter,
  language: Python,
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
      "usedVariables": {
        "var2": "48bb3a41-a987-47f3-9a8e-f0e869c7602c",
        "var1": "222acdee-3545-4e44-86ab-b9a8e17b7b0e",
        "var3": "53693926-a289-48d1-91f6-233e505c2a0c"
      },
      $occupiedPorts: {},
      "cells": [
        {
          "size": {
            "width": 60,
            "height": 30
          },
          "attrs": {},
          "position": {
            "x": 89,
            "y": 124
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
            "variableName": "var1",
            "parameters": [
              "['a','b']",
              "numSlices=None"
            ]
          },
          "z": 1,
          "type": "spark.parallelize",
          "id": "222acdee-3545-4e44-86ab-b9a8e17b7b0e"
        },
        {
          "size": {
            "width": 60,
            "height": 30
          },
          "attrs": {},
          "position": {
            "x": 264,
            "y": 124
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
              "lambda x: var3"
            ]
          },
          "z": 2,
          "type": "spark.map",
          "id": "873c91af-d1e5-458e-995e-5bb76f03bbb2"
        },
        {
          "size": {
            "width": 60,
            "height": 30
          },
          "attrs": {},
          "position": {
            "x": 437,
            "y": 124
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
          "id": "b2825044-e3d5-4235-a2f3-d874f9037435"
        },
        {
          "size": {
            "width": 60,
            "height": 30
          },
          "attrs": {},
          "position": {
            "x": 93,
            "y": 213
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
            "variableName": "var2",
            "parameters": [
              "['a','b']"
            ]
          },
          "z": 1,
          "type": "spark.parallelize",
          "id": "48bb3a41-a987-47f3-9a8e-f0e869c7602c"
        },
        {
          "size": {
            "width": 60,
            "height": 30
          },
          "attrs": {},
          "position": {
            "x": 262,
            "y": 213
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
            "variableName": null,
            "parameters": [
              "lambda x: x % 2 == 0"
            ]
          },
          "z": 1,
          "type": "spark.filter",
          "id": "7446d817-9a94-4845-90b2-ea53caef0e1a"
        },
        {
          "size": {
            "width": 60,
            "height": 30
          },
          "attrs": {},
          "position": {
            "x": 433,
            "y": 214
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
          "id": "842dfd63-1498-4dd0-a540-456c52cbde37"
        },
        {
          "size": {
            "width": 60,
            "height": 30
          },
          "attrs": {},
          "position": {
            "x": 97,
            "y": 299
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
            "variableName": "var3",
            "parameters": [
              "['a','b']"
            ]
          },
          "z": 1,
          "type": "spark.parallelize",
          "id": "53693926-a289-48d1-91f6-233e505c2a0c"
        },
        {
          "size": {
            "width": 60,
            "height": 30
          },
          "attrs": {},
          "position": {
            "x": 259,
            "y": 299
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
              "lambda x: var2"
            ]
          },
          "z": 2,
          "type": "spark.map",
          "id": "b14cd0fb-8867-4eeb-9c6e-671ae6e56a27"
        },
        {
          "size": {
            "width": 60,
            "height": 30
          },
          "attrs": {},
          "position": {
            "x": 433,
            "y": 299
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
          "id": "a0abde77-7e88-41da-aa7d-612c701e19bb"
        },
        {
          "type": "link",
          "source": {
            "id": "53693926-a289-48d1-91f6-233e505c2a0c",
            "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
            "port": "out"
          },
          "target": {
            "id": "b14cd0fb-8867-4eeb-9c6e-671ae6e56a27",
            "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
            "port": "in"
          },
          "smooth": true,
          "id": "703cf85a-5580-4a8d-8ae8-7fcfeb78b7f9",
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
            "id": "48bb3a41-a987-47f3-9a8e-f0e869c7602c",
            "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
            "port": "out"
          },
          "target": {
            "id": "7446d817-9a94-4845-90b2-ea53caef0e1a",
            "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
            "port": "in"
          },
          "smooth": true,
          "id": "793f37f3-eaab-44a1-9b2b-c033ed6af05c",
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
            "id": "222acdee-3545-4e44-86ab-b9a8e17b7b0e",
            "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
            "port": "out"
          },
          "target": {
            "id": "873c91af-d1e5-458e-995e-5bb76f03bbb2",
            "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
            "port": "in"
          },
          "smooth": true,
          "id": "276da3de-2ffb-4f3b-bced-e566e68e3a85",
          "z": 5,
          "attrs": {
            ".marker-target": {
              "d": "M 10 0 L 0 5 L 10 10 z"
            }
          }
        },
        {
          "type": "link",
          "source": {
            "id": "873c91af-d1e5-458e-995e-5bb76f03bbb2",
            "selector": "g:nth-child(1) > g:nth-child(5) > circle:nth-child(1)",
            "port": "out"
          },
          "target": {
            "id": "b2825044-e3d5-4235-a2f3-d874f9037435",
            "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
            "port": "in"
          },
          "smooth": true,
          "id": "7fc80646-104b-4ead-a8dd-6b9f89755fb7",
          "z": 6,
          "attrs": {
            ".marker-target": {
              "d": "M 10 0 L 0 5 L 10 10 z"
            }
          }
        },
        {
          "type": "link",
          "source": {
            "id": "7446d817-9a94-4845-90b2-ea53caef0e1a",
            "selector": "g:nth-child(1) > g:nth-child(5) > circle:nth-child(1)",
            "port": "out"
          },
          "target": {
            "id": "842dfd63-1498-4dd0-a540-456c52cbde37",
            "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
            "port": "in"
          },
          "smooth": true,
          "id": "c671c8ba-4299-4e47-8eef-cb3442333de9",
          "z": 7,
          "attrs": {
            ".marker-target": {
              "d": "M 10 0 L 0 5 L 10 10 z"
            }
          }
        },
        {
          "type": "link",
          "source": {
            "id": "b14cd0fb-8867-4eeb-9c6e-671ae6e56a27",
            "selector": "g:nth-child(1) > g:nth-child(5) > circle:nth-child(1)",
            "port": "out"
          },
          "target": {
            "id": "a0abde77-7e88-41da-aa7d-612c701e19bb",
            "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
            "port": "in"
          },
          "smooth": true,
          "id": "2f96651f-ba76-496b-b6ac-12c69ec907b4",
          "z": 8,
          "attrs": {
            ".marker-target": {
              "d": "M 10 0 L 0 5 L 10 10 z"
            }
          }
        }
      ]
    }
  }
}
