import SparkAdapter from '../../../app/adapters/spark';
import Python from '../../../app/core/languages/Python';

export default {
  "name": "UnionAndDependency.py",
  adapter: SparkAdapter,
  language: Python,
  "usedVariables": {
    "union1": "e37529e5-8599-4f62-93c3-985b3602c80a",
    "input1": "52c418a4-1bd0-49ee-bf2f-435a8ca7d25a",
    "input2": "d62616fc-c082-4f81-8f3a-12bbdf0339c4",
    "count": "5832e2ae-8829-4e9b-bf25-3e369d831452"
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
        "x": 469,
        "y": 109
      },
      "ports": {
        "items": [
          {
            "id": "in1",
            "group": "in"
          },
          {
            "id": "in2",
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
        "description": "Union",
        "variableName": "union1",
        "parameters": []
      },
      "z": 3,
      "type": "spark.union",
      "id": "e37529e5-8599-4f62-93c3-985b3602c80a"
    },
    {
      "size": {
        "width": 60,
        "height": 30
      },
      "attrs": {},
      "position": {
        "x": 651,
        "y": 110
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
      "id": "5e8381b8-8bb3-4560-99fe-6801fa547148"
    },
    {
      "type": "link",
      "source": {
        "id": "e37529e5-8599-4f62-93c3-985b3602c80a",
        "selector": "g:nth-child(1) > g:nth-child(6) > circle:nth-child(1)",
        "port": "out"
      },
      "target": {
        "id": "5e8381b8-8bb3-4560-99fe-6801fa547148",
        "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
        "port": "in"
      },
      "smooth": true,
      "id": "d98491ad-91a3-4ceb-945c-b8653043e639",
      "z": 4,
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
        "x": 75.5,
        "y": 47
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
        "variableName": "input1",
        "parameters": [
          "[1,2,3,4]"
        ]
      },
      "z": 1,
      "type": "spark.parallelize",
      "id": "52c418a4-1bd0-49ee-bf2f-435a8ca7d25a"
    },
    {
      "size": {
        "width": 60,
        "height": 30
      },
      "attrs": {},
      "position": {
        "x": 74.5,
        "y": 165
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
        "variableName": "input2",
        "parameters": [
          "[1,2,3,4]"
        ]
      },
      "z": 1,
      "type": "spark.parallelize",
      "id": "d62616fc-c082-4f81-8f3a-12bbdf0339c4"
    },
    {
      "size": {
        "width": 60,
        "height": 30
      },
      "attrs": {},
      "position": {
        "x": 222.5,
        "y": 171
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
          "lambda x: bla"
        ]
      },
      "z": 2,
      "type": "spark.map",
      "id": "52c209ec-36d9-48ba-981e-28fc83b16139"
    },
    {
      "type": "link",
      "source": {
        "id": "52c209ec-36d9-48ba-981e-28fc83b16139",
        "selector": "g:nth-child(1) > g:nth-child(5) > circle:nth-child(1)",
        "port": "out"
      },
      "target": {
        "id": "e37529e5-8599-4f62-93c3-985b3602c80a",
        "selector": "g:nth-child(1) > g:nth-child(5) > circle:nth-child(1)",
        "port": "in2"
      },
      "smooth": true,
      "id": "81e15b74-0ce9-4f95-9142-aae7d4ec0cb6",
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
        "id": "d62616fc-c082-4f81-8f3a-12bbdf0339c4",
        "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
        "port": "out"
      },
      "target": {
        "id": "52c209ec-36d9-48ba-981e-28fc83b16139",
        "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
        "port": "in"
      },
      "smooth": true,
      "id": "620da043-8674-43bc-b4b3-92b8eee7752b",
      "z": 6,
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
        "x": 365.5,
        "y": 237
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
      "id": "5832e2ae-8829-4e9b-bf25-3e369d831452"
    },
    {
      "type": "link",
      "source": {
        "id": "52c209ec-36d9-48ba-981e-28fc83b16139",
        "selector": "g:nth-child(1) > g:nth-child(5) > circle:nth-child(1)",
        "port": "out"
      },
      "target": {
        "id": "5832e2ae-8829-4e9b-bf25-3e369d831452",
        "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
        "port": "in"
      },
      "smooth": true,
      "id": "e01f3f34-b196-434e-a5ad-cd1d6b61dfa0",
      "z": 7,
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
        "x": 270,
        "y": 48
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
          "lambda x: count"
        ]
      },
      "z": 2,
      "type": "spark.map",
      "id": "3ff59a97-df97-4945-97cd-668f7bdbb66e"
    },
    {
      "type": "link",
      "source": {
        "id": "52c418a4-1bd0-49ee-bf2f-435a8ca7d25a",
        "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
        "port": "out"
      },
      "target": {
        "id": "3ff59a97-df97-4945-97cd-668f7bdbb66e",
        "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
        "port": "in"
      },
      "smooth": true,
      "id": "e73fb820-5335-49c7-af1c-ae2377285f8b",
      "z": 8,
      "attrs": {
        ".marker-target": {
          "d": "M 10 0 L 0 5 L 10 10 z"
        }
      }
    },
    {
      "type": "link",
      "source": {
        "id": "3ff59a97-df97-4945-97cd-668f7bdbb66e",
        "selector": "g:nth-child(1) > g:nth-child(5) > circle:nth-child(1)",
        "port": "out"
      },
      "target": {
        "id": "e37529e5-8599-4f62-93c3-985b3602c80a",
        "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
        "port": "in1"
      },
      "smooth": true,
      "id": "8cdc63b5-e3ed-453f-8b8d-41e6dfb69062",
      "z": 9,
      "attrs": {
        ".marker-target": {
          "d": "M 10 0 L 0 5 L 10 10 z"
        }
      }
    }
  ]
}
}
