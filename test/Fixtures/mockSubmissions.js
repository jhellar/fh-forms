var complexSubmission1 = {
  "_id": "53ac7108b8f15d51516d14b0",
  "appClientId": "OgF52REDBM9_ZbDwJjREK-yG",
  "appCloudName": "test-t-ogf521234dv90ndm1p-dev",
  "appEnvironment": "dev",
  "appId": "OgF52MXjmVTjFJ5BRyWLHxy7",
  "deviceFormTimestamp": "2014-06-20T14:43:18.722Z",
  "deviceIPAddress": "213.233.150.90,10.189.254.5",
  "deviceId": "3C5ECCB9-3ABE-4DEC-AD7E-35B11454F366",
  "formId": "53a44886d55d83f96dad6ca8",
  "formSubmittedAgainst": {
    "updatedBy": "niall.donnelly@feedhenry.com",
    "name": "Technical Inspection Notification",
    "description": "",
    "_id": "53a44886d55d83f96dad6ca8",
    "subscribers": [],
    "pageRules": [],
    "fieldRules": [],
    "pages": [{
      "_id": "53a44886d55d83f96dad6ca7",
      "fields": [{
        "values": ["TI"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "defaultValue": "TI"
          }
        },
        "required": true,
        "type": "text",
        "name": "Notification Type",
        "_id": "53a44886d55d83f96dad6c94",
        "repeating": false
      }, {
        "values": ["Test text"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": true,
        "type": "text",
        "name": "Description",
        "_id": "53a44886d55d83f96dad6c95",
        "repeating": false
      }, {
        "values": [30002144],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": true,
        "type": "number",
        "name": "Equipment",
        "_id": "53a44886d55d83f96dad6c96",
        "repeating": false
      }, {
        "values": ["OBL126"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": false,
        "type": "text",
        "name": "Serial Number",
        "_id": "53a44886d55d83f96dad6c97",
        "repeating": false
      }, {
        "values": ["Stone "],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": false,
        "type": "text",
        "name": "Material",
        "_id": "53a44886d55d83f96dad6c98",
        "repeating": false
      }, {
        "values": ["LMK"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": false,
        "type": "text",
        "name": "Planner Group",
        "_id": "53a44886d55d83f96dad6c99",
        "repeating": false
      }, {
        "values": ["LMK-STSE"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": false,
        "type": "text",
        "name": "Main Work Ctr",
        "_id": "53a44886d55d83f96dad6c9a",
        "repeating": false
      }, {
        "values": ["Egan_C"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "defaultValue": ""
          }
        },
        "required": false,
        "type": "text",
        "name": "Reported by",
        "_id": "53a44886d55d83f96dad6c9b",
        "repeating": false
      }, {
        "values": ["Adjust"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "options": [{
              "label": "Adjust",
              "checked": false
            }, {
              "label": "Blast",
              "checked": false
            }, {
              "checked": false,
              "name": "",
              "label": "Clean"
            }, {
              "checked": false,
              "name": "",
              "label": "Clear Debris"
            }, {
              "checked": false,
              "name": "",
              "label": "Inspect"
            }, {
              "checked": false,
              "name": "",
              "label": "Install / Erect"
            }, {
              "checked": false,
              "name": "",
              "label": "Moinintoir"
            }, {
              "checked": false,
              "name": "",
              "label": "Paint"
            }, {
              "checked": false,
              "name": "",
              "label": "Pointing"
            }, {
              "checked": false,
              "name": "",
              "label": "Remove"
            }, {
              "checked": false,
              "name": "",
              "label": "Repair"
            }, {
              "checked": false,
              "name": "",
              "label": "Replace"
            }],
            "include_blank_option": false
          }
        },
        "required": true,
        "type": "dropdown",
        "name": "Coding",
        "_id": "53a44886d55d83f96dad6c9c",
        "repeating": false
      }, {
        "values": [""],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": false,
        "type": "text",
        "name": "Description",
        "_id": "53a44886d55d83f96dad6c9d",
        "repeating": false
      }, {
        "values": ["2014-07-26"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "datetimeUnit": "date"
          }
        },
        "name": "Required Start",
        "required": false,
        "type": "dateTime",
        "_id": "53a44886d55d83f96dad6c9e",
        "repeating": false
      }, {
        "values": ["2014-08-26"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "datetimeUnit": "date"
          }
        },
        "name": "Required End",
        "required": true,
        "type": "dateTime",
        "_id": "53a44886d55d83f96dad6c9f",
        "repeating": false
      }, {
        "values": ["High"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "options": [{
              "label": "High",
              "checked": false
            }, {
              "label": "Medium",
              "checked": false
            }, {
              "checked": false,
              "name": "",
              "label": "Low"
            }],
            "include_blank_option": false
          }
        },
        "required": true,
        "type": "dropdown",
        "name": "Priority",
        "_id": "53a44886d55d83f96dad6ca0",
        "repeating": false
      }, {
        "values": ["Abuttments"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "options": [{
              "label": "Abuttments",
              "checked": false
            }, {
              "label": "Approach wall",
              "checked": false
            }, {
              "checked": false,
              "name": "",
              "label": "Arch"
            }, {
              "checked": false,
              "name": "",
              "label": "Ballast Guards"
            }, {
              "checked": false,
              "name": "",
              "label": "Beams"
            }, {
              "checked": false,
              "name": "",
              "label": "Bearers"
            }, {
              "checked": false,
              "name": "",
              "label": "Bearing Pad"
            }, {
              "checked": false,
              "name": "",
              "label": "Bedstone"
            }, {
              "checked": false,
              "name": "",
              "label": "Box Section"
            }, {
              "checked": false,
              "name": "",
              "label": "Buffer Beam"
            }, {
              "checked": false,
              "name": "",
              "label": "Coping Stone"
            }, {
              "checked": false,
              "name": "",
              "label": "Crash Barriers"
            }, {
              "checked": false,
              "name": "",
              "label": "Cross Girders"
            }],
            "include_blank_option": false
          }
        },
        "name": "Object Part",
        "required": true,
        "type": "dropdown",
        "_id": "53a44886d55d83f96dad6ca1",
        "repeating": false
      }, {
        "values": ["Bent"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "options": [{
              "label": "Bent",
              "checked": false
            }, {
              "label": "Blocked",
              "checked": false
            }, {
              "checked": false,
              "name": "",
              "label": "Broken"
            }, {
              "checked": false,
              "name": "",
              "label": "Buckled"
            }, {
              "checked": false,
              "name": "",
              "label": "Chipped"
            }, {
              "checked": false,
              "name": "",
              "label": "Cracked"
            }, {
              "checked": false,
              "name": "",
              "label": "Damaged"
            }, {
              "checked": false,
              "name": "",
              "label": "Debris"
            }, {
              "checked": false,
              "name": "",
              "label": "Deflection"
            }, {
              "checked": false,
              "name": "",
              "label": "Degraded"
            }, {
              "checked": false,
              "name": "",
              "label": "Dislodged"
            }, {
              "checked": false,
              "name": "",
              "label": "Knocked Down"
            }, {
              "checked": false,
              "name": "",
              "label": "Loose"
            }],
            "include_blank_option": false
          }
        },
        "name": "Damage",
        "required": true,
        "type": "dropdown",
        "_id": "53a44886d55d83f96dad6ca2",
        "repeating": false
      }, {
        "values": [""],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": false,
        "type": "text",
        "name": "Text",
        "_id": "53a44886d55d83f96dad6ca3",
        "repeating": false
      }, {
        "values": ["Authorised Work"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "options": [{
              "label": "Authorised Work",
              "checked": false
            }, {
              "label": "Build-up of debris",
              "checked": false
            }, {
              "checked": false,
              "name": "",
              "label": "Cannot be establised"
            }, {
              "checked": false,
              "name": "",
              "label": "Contractor / 3rd Party Damage"
            }, {
              "checked": false,
              "name": "",
              "label": "Corrosion"
            }, {
              "checked": false,
              "name": "",
              "label": "Damage from burst pipes/services"
            }, {
              "checked": false,
              "name": "",
              "label": "Design error"
            }, {
              "checked": false,
              "name": "",
              "label": "Detachment of services/pipework"
            }, {
              "checked": false,
              "name": "",
              "label": "End of life cycle"
            }, {
              "checked": false,
              "name": "",
              "label": "Erosion/scour"
            }, {
              "checked": false,
              "name": "",
              "label": "Geological activity/land slip"
            }, {
              "checked": false,
              "name": "",
              "label": "Inadequate vegetation control"
            }, {
              "checked": false,
              "name": "",
              "label": "Increased loading"
            }, {
              "checked": false,
              "name": ""
            }],
            "include_blank_option": false
          }
        },
        "name": "Cause Code",
        "required": true,
        "type": "dropdown",
        "_id": "53a44886d55d83f96dad6ca4",
        "repeating": false
      }, {
        "values": [""],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": false,
        "type": "text",
        "name": "Cause Text",
        "_id": "53a44886d55d83f96dad6ca5",
        "repeating": false
      }, {
        "values": [{
          "mbaasUrl": "/mbaas/forms/:appId/submission/:submissionId/file/:fileGroupId",
          "url": "/api/v2/forms/submission/file/53ac7112859dcc5151000001?rand=0.04190378077328205",
          "fieldId": "53a44886d55d83f96dad6ca6",
          "fileUpdateTime": 1403810050144,
          "imgHeader": "data:image/png;base64,",
          "fileType": "image/png",
          "fileSize": 560342,
          "contentType": "base64",
          "hashName": "filePlaceHolder10a0bd6f827beb3bc39c5f51d7daa0ea",
          "fileName": "filePlaceHolder10a0bd6f827beb3bc39c5f51d7daa0ea.png",
          "groupId": "53ac7112859dcc5151000001"
        }],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": false,
        "type": "photo",
        "name": "Photo",
        "_id": "53a44886d55d83f96dad6ca6",
        "repeating": false
      }]
    }],
    "lastUpdated": "2014-06-20T14:43:18.722Z",
    "dateCreated": "2014-06-20T14:43:18.721Z"
  },
  "masterFormTimestamp": "2014-06-20T14:43:18.722Z",
  "timezoneOffset": -60,
  "userId": null,
  "formFields": [{
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": true,
      "type": "number",
      "name": "Equipment",
      "_id": "53a44886d55d83f96dad6c96",
      "repeating": false
    },
    "fieldValues": [30002144]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": true,
      "type": "text",
      "name": "Serial Number",
      "_id": "53a44886d55d83f96dad6c97",
      "repeating": false
    },
    "fieldValues": ["OBL126"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": false,
      "type": "text",
      "name": "Main Work Ctr",
      "_id": "53a44886d55d83f96dad6c9a",
      "repeating": false
    },
    "fieldValues": ["LMK-STSE"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": true,
      "type": "text",
      "name": "Description",
      "_id": "53a44886d55d83f96dad6c95",
      "repeating": false
    },
    "fieldValues": ["Test text"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": false,
      "type": "text",
      "name": "Planner Group",
      "_id": "53a44886d55d83f96dad6c99",
      "repeating": false
    },
    "fieldValues": ["LMK"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "defaultValue": "TI"
        }
      },
      "required": true,
      "type": "text",
      "name": "Notification Type",
      "_id": "53a44886d55d83f96dad6c94",
      "repeating": false
    },
    "fieldValues": ["TI"]
  }, {
    "fieldId": {
      "_id": "53a44886d55d83f96dad6c98",
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "defaultValue": "BRIDGE"
        }
      },
      "name": "Material",
      "required": false,
      "type": "text",
      "repeating": false
    },
    "fieldValues": ["Stone\nsome new line"]
  }, {
    "fieldId": {
      "_id": "53a44886d55d83f96dad6c9b",
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "defaultValue": "",
          "minRepeat": 1,
          "maxRepeat": 5
        }
      },
      "name": "Reported by",
      "required": true,
      "type": "text",
      "repeating": false
    },
    "fieldValues": ["Egan_C"]
  }, {
    "fieldId": {
      "_id": "53a44886d55d83f96dad6c9c",
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "options": [{
            "label": "Adjust",
            "checked": false
          }, {
            "label": "Blast",
            "checked": false
          }, {
            "checked": false,
            "name": "",
            "label": "Clean"
          }, {
            "checked": false,
            "name": "",
            "label": "Clear Debris"
          }, {
            "checked": false,
            "name": "",
            "label": "Inspect"
          }, {
            "checked": false,
            "name": "",
            "label": "Install / Erect"
          }, {
            "checked": false,
            "name": "",
            "label": "Monitor "
          }, {
            "checked": false,
            "name": "",
            "label": "Paint"
          }, {
            "checked": false,
            "name": "",
            "label": "Pointing"
          }, {
            "checked": false,
            "name": "",
            "label": "Remove"
          }, {
            "checked": false,
            "name": "",
            "label": "Repair"
          }, {
            "checked": false,
            "name": "",
            "label": "Replace"
          }, {
            "checked": false,
            "name": "",
            "label": "Reset"
          }, {
            "checked": false,
            "name": "",
            "label": "Secure"
          }, {
            "checked": false,
            "name": "",
            "label": "Stitch"
          }, {
            "checked": false,
            "name": "",
            "label": "Survey"
          }, {
            "checked": false,
            "name": "",
            "label": "Tighten"
          }, {
            "checked": false,
            "name": "",
            "label": "Vegetation Control"
          }],
          "include_blank_option": false
        }
      },
      "name": "Coding",
      "required": true,
      "type": "dropdown",
      "repeating": false
    },
    "fieldValues": ["Adjust"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": false,
      "type": "text",
      "name": "Description",
      "_id": "53a44886d55d83f96dad6c9d",
      "repeating": false
    },
    "fieldValues": [""]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "datetimeUnit": "date"
        }
      },
      "name": "Required Start",
      "required": false,
      "type": "dateTime",
      "_id": "53a44886d55d83f96dad6c9e",
      "repeating": false
    },
    "fieldValues": ["2014-07-26"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "datetimeUnit": "date"
        }
      },
      "name": "Required End",
      "required": true,
      "type": "dateTime",
      "_id": "53a44886d55d83f96dad6c9f",
      "repeating": false
    },
    "fieldValues": ["2014-08-26"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "options": [{
            "label": "High",
            "checked": false
          }, {
            "label": "Medium",
            "checked": false
          }, {
            "checked": false,
            "name": "",
            "label": "Low"
          }],
          "include_blank_option": true
        }
      },
      "required": true,
      "type": "dropdown",
      "name": "Priority",
      "_id": "53a44886d55d83f96dad6ca0",
      "repeating": false
    },
    "fieldValues": ["High"]
  }, {
    "fieldId": {
      "_id": "53a44886d55d83f96dad6ca1",
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "options": [{
            "label": "Abuttments",
            "checked": false
          }, {
            "label": "Approach wall",
            "checked": false
          }, {
            "checked": false,
            "name": "",
            "label": "Arch"
          }, {
            "checked": false,
            "name": "",
            "label": "Ballast Guards"
          }, {
            "checked": false,
            "name": "",
            "label": "Beams"
          }, {
            "checked": false,
            "name": "",
            "label": "Bearers"
          }, {
            "checked": false,
            "name": "",
            "label": "Bearing Pad"
          }, {
            "checked": false,
            "name": "",
            "label": "Bedstone"
          }, {
            "checked": false,
            "name": "",
            "label": "Box Section"
          }, {
            "checked": false,
            "name": "",
            "label": "Buffer Beam"
          }, {
            "checked": false,
            "name": "",
            "label": "Coping Stone"
          }, {
            "checked": false,
            "name": "",
            "label": "Crash Barriers"
          }, {
            "checked": false,
            "name": "",
            "label": "Cross Girders"
          }, {
            "checked": false,
            "name": "",
            "label": "Crown"
          }, {
            "checked": false,
            "name": "",
            "label": "Deck"
          }, {
            "checked": false,
            "name": "",
            "label": "Drainage"
          }, {
            "checked": false,
            "name": "",
            "label": "Flanges"
          }, {
            "checked": false,
            "name": "",
            "label": "Foundation"
          }, {
            "checked": false,
            "name": "",
            "label": "Goal Posts"
          }, {
            "checked": false,
            "name": "",
            "label": "Handrail"
          }, {
            "checked": false,
            "name": "",
            "label": "Main Girders"
          }, {
            "checked": false,
            "name": "",
            "label": "Parapets"
          }, {
            "checked": false,
            "name": "",
            "label": "Pipe"
          }, {
            "checked": false,
            "name": "",
            "label": "Pointing"
          }, {
            "checked": false,
            "name": "",
            "label": "Portal Unit"
          }, {
            "checked": false,
            "name": "",
            "label": "Rivet and bolts"
          }, {
            "checked": false,
            "name": "",
            "label": "Services"
          }, {
            "checked": false,
            "name": "",
            "label": "Signage"
          }, {
            "checked": false,
            "name": "",
            "label": "Soffit"
          }, {
            "checked": false,
            "name": "",
            "label": "Spandrel Wall"
          }, {
            "checked": false,
            "name": "",
            "label": "Steelwork"
          }, {
            "checked": false,
            "name": "",
            "label": "Steps"
          }, {
            "checked": false,
            "name": "",
            "label": "Stiffners"
          }, {
            "checked": false,
            "name": "",
            "label": "Stones"
          }, {
            "checked": false,
            "name": "",
            "label": "Timber Sleepers"
          }, {
            "checked": false,
            "name": "",
            "label": "Transverse Timber"
          }, {
            "checked": false,
            "name": "",
            "label": "Troughing"
          }, {
            "checked": false,
            "name": "",
            "label": "Voussoirs"
          }, {
            "checked": false,
            "name": "",
            "label": "Way Beams"
          }, {
            "checked": false,
            "name": "",
            "label": "Wing Wall"
          }],
          "include_blank_option": false
        }
      },
      "name": "Object Part",
      "required": true,
      "type": "dropdown",
      "repeating": false
    },
    "fieldValues": ["Abuttments"]
  }, {
    "fieldId": {
      "_id": "53a44886d55d83f96dad6ca2",
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "options": [{
            "label": "Bent",
            "checked": false
          }, {
            "label": "Blocked",
            "checked": false
          }, {
            "checked": false,
            "name": "",
            "label": "Broken"
          }, {
            "checked": false,
            "name": "",
            "label": "Buckled"
          }, {
            "checked": false,
            "name": "",
            "label": "Chipped"
          }, {
            "checked": false,
            "name": "",
            "label": "Cracked"
          }, {
            "checked": false,
            "name": "",
            "label": "Damaged"
          }, {
            "checked": false,
            "name": "",
            "label": "Debris"
          }, {
            "checked": false,
            "name": "",
            "label": "Deflection"
          }, {
            "checked": false,
            "name": "",
            "label": "Degraded"
          }, {
            "checked": false,
            "name": "",
            "label": "Dislodged"
          }, {
            "checked": false,
            "name": "",
            "label": "Knocked Down"
          }, {
            "checked": false,
            "name": "",
            "label": "Loose"
          }, {
            "checked": false,
            "name": "",
            "label": "Missing"
          }, {
            "checked": false,
            "name": "",
            "label": "Movement"
          }, {
            "checked": false,
            "name": "",
            "label": "Overflow"
          }, {
            "checked": false,
            "name": "",
            "label": "Rotten"
          }, {
            "checked": false,
            "name": "",
            "label": "Scour"
          }, {
            "checked": false,
            "name": "",
            "label": "Scraped"
          }, {
            "checked": false,
            "name": "",
            "label": "Sheared"
          }, {
            "checked": false,
            "name": "",
            "label": "Spalling"
          }, {
            "checked": false,
            "name": "",
            "label": "Superficial Damage"
          }, {
            "checked": false,
            "name": "",
            "label": "Twisted"
          }, {
            "checked": false,
            "name": "",
            "label": "Worn"
          }],
          "include_blank_option": false
        }
      },
      "name": "Damage",
      "required": true,
      "type": "dropdown",
      "repeating": false
    },
    "fieldValues": ["Bent"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": false,
      "type": "text",
      "name": "Text",
      "_id": "53a44886d55d83f96dad6ca3",
      "repeating": false
    },
    "fieldValues": [""]
  }, {
    "fieldId": {
      "_id": "53a44886d55d83f96dad6ca4",
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "options": [{
            "label": "Authorised Work",
            "checked": false
          }, {
            "label": "Build-up of debris",
            "checked": false
          }, {
            "checked": false,
            "name": "",
            "label": "Cannot be establised"
          }, {
            "checked": false,
            "name": "",
            "label": "Contractor / 3rd Party Damage"
          }, {
            "checked": false,
            "name": "",
            "label": "Corrosion"
          }, {
            "checked": false,
            "name": "",
            "label": "Damage from burst pipes/services"
          }, {
            "checked": false,
            "name": "",
            "label": "Design error"
          }, {
            "checked": false,
            "name": "",
            "label": "Detachment of services/pipework"
          }, {
            "checked": false,
            "name": "",
            "label": "End of life cycle"
          }, {
            "checked": false,
            "name": "",
            "label": "Erosion/scour"
          }, {
            "checked": false,
            "name": "",
            "label": "Geological activity/land slip"
          }, {
            "checked": false,
            "name": "",
            "label": "Inadequate vegetation control"
          }, {
            "checked": false,
            "name": "",
            "label": "Increased loading"
          }, {
            "checked": false,
            "name": "",
            "label": "Installation Error"
          }, {
            "checked": false,
            "name": "",
            "label": "Lack of Signage"
          }, {
            "checked": false,
            "name": "",
            "label": "Maintenance Error"
          }, {
            "checked": false,
            "name": "",
            "label": "Road Alignment/Condition"
          }, {
            "checked": false,
            "name": "",
            "label": "Severe Weather"
          }, {
            "checked": false,
            "name": "",
            "label": "Unauthorised Work"
          }, {
            "checked": false,
            "name": "",
            "label": "Vandelism"
          }, {
            "checked": false,
            "name": "",
            "label": "Vibration"
          }],
          "include_blank_option": false
        }
      },
      "name": "Cause Code",
      "required": true,
      "type": "dropdown",
      "repeating": false
    },
    "fieldValues": ["Authorised Work"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": false,
      "type": "text",
      "name": "Cause Text",
      "_id": "53a44886d55d83f96dad6ca5",
      "repeating": false
    },
    "fieldValues": [""]
  }, {
    "fieldId": {
      "_id": "53a44886d55d83f96dad6ca6",
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "minRepeat": 1,
          "maxRepeat": 5
        }
      },
      "name": "Photo",
      "required": false,
      "type": "photo",
      "repeating": false
    },
    "fieldValues": [{
      "mbaasUrl": "/mbaas/forms/:appId/submission/:submissionId/file/:fileGroupId",
      "url": "/api/v2/forms/submission/file/53ac7112859dcc5151000001?rand=0.04190378077328205",
      "fieldId": "53a44886d55d83f96dad6ca6",
      "fileUpdateTime": 1403810050144,
      "imgHeader": "data:image/png;base64,",
      "fileType": "image/png",
      "fileSize": 560342,
      "contentType": "base64",
      "hashName": "filePlaceHolder10a0bd6f827beb3bc39c5f51d7daa0ea",
      "fileName": "filePlaceHolder10a0bd6f827beb3bc39c5f51d7daa0ea.png",
      "groupId": "53ac7112859dcc5151000001"
    }]
  }],
  "comments": [],
  "status": "complete",
  "submissionStartedTimestamp": "2014-06-26T19:14:16.144Z",
  "updatedTimestamp": "2014-06-26T19:14:29.415Z",
  "submissionCompletedTimestamp": "2014-06-26T19:14:29.409Z"
};

var complexSubmissionOrder = {
  "_id": "53c3adfdbd66275c654355d9",
  "appClientId": "OgF52REDBM9_ZbDwJjREK-yG",
  "appCloudName": "irishrail-t-ogf52urb7qpc400dv90ndm1p-dev",
  "appEnvironment": "dev",
  "appId": "OgF52MXjmVTjFJ5BRyWLHxy7",
  "deviceFormTimestamp": "2014-07-11T16:55:12.675Z",
  "deviceIPAddress": "213.233.148.4,10.189.254.5,10.35.1.7",
  "deviceId": "3c4f6fa4160b1cd168414f1bbb5083db",
  "formId": "53a44886d55d83f96dad6ca8",
  "formSubmittedAgainst": {
    "_id": "53a44886d55d83f96dad6ca8",
    "description": "",
    "name": "Technical Inspection Notification",
    "updatedBy": "mj.ocarroll@feedhenry.com",
    "subscribers": [],
    "pageRules": [],
    "fieldRules": [{
      "_id": "53bfaf11a33bcfd2434e0489",
      "targetField": "53bfa7e0ac1ca9710aa9898c",
      "type": "hide",
      "ruleConditionalStatements": [{
        "sourceField": "53bfad751d4fa7740ac2ffa9",
        "restriction": "is not",
        "sourceValue": "Yes"
      }, {
        "sourceField": "53bfad751d4fa7740ac2ffa9",
        "restriction": "is",
        "sourceValue": "No"
      }],
      "ruleConditionalOperator": "or",
      "relationType": "and"
    }, {
      "_id": "53bfaf11a33bcfd2434e048a",
      "targetField": "53bfad751d4fa7740ac2ffaa",
      "type": "hide",
      "ruleConditionalStatements": [{
        "sourceField": "53bfad751d4fa7740ac2ffa9",
        "restriction": "is not",
        "sourceValue": "Yes"
      }, {
        "sourceField": "53bfad751d4fa7740ac2ffa9",
        "restriction": "is",
        "sourceValue": "No"
      }],
      "ruleConditionalOperator": "or",
      "relationType": "and"
    }, {
      "type": "hide",
      "targetField": "53bfa7e0ac1ca9710aa9898d",
      "_id": "53bfb53aa33bcfd2434e048c",
      "ruleConditionalStatements": [{
        "sourceField": "53bfad751d4fa7740ac2ffa9",
        "restriction": "is not",
        "sourceValue": "Yes"
      }, {
        "sourceField": "53bfad751d4fa7740ac2ffa9",
        "restriction": "is",
        "sourceValue": "No"
      }, {
        "sourceField": "53bfad751d4fa7740ac2ffaa",
        "restriction": "is not",
        "sourceValue": "Yes"
      }, {
        "sourceField": "53bfad751d4fa7740ac2ffaa",
        "restriction": "is",
        "sourceValue": "No"
      }],
      "ruleConditionalOperator": "or",
      "relationType": "and"
    }],
    "pages": [{
      "_id": "53a44886d55d83f96dad6ca7",
      "fields": [{
        "values": ["530132297"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": false,
        "type": "text",
        "name": "Order",
        "_id": "53bffefd3a772d4b129ab421",
        "repeating": false
      }, {
        "values": ["TI"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "defaultValue": "TI"
          }
        },
        "required": true,
        "type": "text",
        "name": "Notification Type",
        "_id": "53a44886d55d83f96dad6c94",
        "repeating": false
      }, {
        "values": ["Vegetation"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": true,
        "type": "text",
        "name": "Description",
        "_id": "53a44886d55d83f96dad6c95",
        "repeating": false
      }, {
        "values": [30003713],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": true,
        "type": "number",
        "name": "Equipment",
        "_id": "53a44886d55d83f96dad6c96",
        "repeating": false
      }, {
        "values": ["UBS542A"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": true,
        "type": "text",
        "name": "Serial Number",
        "_id": "53a44886d55d83f96dad6c97",
        "repeating": false
      }, {
        "values": ["BRIDGE"],
        "_id": "53a44886d55d83f96dad6c98",
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "defaultValue": "BRIDGE"
          }
        },
        "name": "Material",
        "required": false,
        "type": "text",
        "repeating": false
      }, {
        "values": ["ATH"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": false,
        "type": "text",
        "name": "Planner Group",
        "_id": "53a44886d55d83f96dad6c99",
        "repeating": false
      }, {
        "values": ["ATH-STSE"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": false,
        "type": "text",
        "name": "Main Work Ctr",
        "_id": "53a44886d55d83f96dad6c9a",
        "repeating": false
      }, {
        "values": ["Nmc"],
        "_id": "53a44886d55d83f96dad6c9b",
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "defaultValue": "",
            "minRepeat": 1,
            "maxRepeat": 5
          }
        },
        "name": "Reported by",
        "required": true,
        "type": "text",
        "repeating": false
      }, {
        "values": ["Adjust"],
        "_id": "53a44886d55d83f96dad6c9c",
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "options": [{
              "label": "Adjust",
              "checked": false
            }, {
              "label": "Blast",
              "checked": false
            }, {
              "checked": false,
              "name": "",
              "label": "Clean"
            }, {
              "checked": false,
              "name": "",
              "label": "Clear Debris"
            }, {
              "checked": false,
              "name": "",
              "label": "Inspect"
            }, {
              "checked": false,
              "name": "",
              "label": "Install / Erect"
            }, {
              "checked": false,
              "name": "",
              "label": "Monitor "
            }, {
              "checked": false,
              "name": "",
              "label": "Paint"
            }, {
              "checked": false,
              "name": "",
              "label": "Pointing"
            }, {
              "checked": false,
              "name": "",
              "label": "Remove"
            }, {
              "checked": false,
              "name": "",
              "label": "Repair"
            }, {
              "checked": false,
              "name": "",
              "label": "Replace"
            }, {
              "checked": false,
              "name": "",
              "label": "Reset"
            }, {
              "checked": false,
              "name": "",
              "label": "Secure"
            }, {
              "checked": false,
              "name": "",
              "label": "Stitch"
            }, {
              "checked": false,
              "name": "",
              "label": "Survey"
            }, {
              "checked": false,
              "name": "",
              "label": "Tighten"
            }, {
              "checked": false,
              "name": "",
              "label": "Vegetation Control"
            }],
            "include_blank_option": false
          }
        },
        "name": "Coding",
        "required": true,
        "type": "dropdown",
        "repeating": false
      }, {
        "values": [""],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": false,
        "type": "text",
        "name": "Description",
        "_id": "53a44886d55d83f96dad6c9d",
        "repeating": false
      }, {
        "values": [""],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "datetimeUnit": "date"
          }
        },
        "name": "Required Start",
        "required": false,
        "type": "dateTime",
        "_id": "53a44886d55d83f96dad6c9e",
        "repeating": false
      }, {
        "values": ["Medium"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "options": [{
              "label": "High",
              "checked": false
            }, {
              "label": "Medium",
              "checked": false
            }, {
              "checked": false,
              "name": "",
              "label": "Low"
            }],
            "include_blank_option": true
          }
        },
        "required": true,
        "type": "dropdown",
        "name": "Priority",
        "_id": "53a44886d55d83f96dad6ca0",
        "repeating": false
      }, {
        "values": ["Abuttments"],
        "_id": "53a44886d55d83f96dad6ca1",
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "options": [{
              "label": "Abuttments",
              "checked": false
            }, {
              "label": "Approach wall",
              "checked": false
            }, {
              "checked": false,
              "name": "",
              "label": "Arch"
            }, {
              "checked": false,
              "name": "",
              "label": "Ballast Guards"
            }, {
              "checked": false,
              "name": "",
              "label": "Beams"
            }, {
              "checked": false,
              "name": "",
              "label": "Bearers"
            }, {
              "checked": false,
              "name": "",
              "label": "Bearing Pad"
            }, {
              "checked": false,
              "name": "",
              "label": "Bedstone"
            }, {
              "checked": false,
              "name": "",
              "label": "Box Section"
            }, {
              "checked": false,
              "name": "",
              "label": "Buffer Beam"
            }, {
              "checked": false,
              "name": "",
              "label": "Coping Stone"
            }, {
              "checked": false,
              "name": "",
              "label": "Crash Barriers"
            }, {
              "checked": false,
              "name": "",
              "label": "Cross Girders"
            }, {
              "checked": false,
              "name": "",
              "label": "Crown"
            }, {
              "checked": false,
              "name": "",
              "label": "Deck"
            }, {
              "checked": false,
              "name": "",
              "label": "Drainage"
            }, {
              "checked": false,
              "name": "",
              "label": "Flanges"
            }, {
              "checked": false,
              "name": "",
              "label": "Foundation"
            }, {
              "checked": false,
              "name": "",
              "label": "Goal Posts"
            }, {
              "checked": false,
              "name": "",
              "label": "Handrail"
            }, {
              "checked": false,
              "name": "",
              "label": "Main Girders"
            }, {
              "checked": false,
              "name": "",
              "label": "Parapets"
            }, {
              "checked": false,
              "name": "",
              "label": "Pipe"
            }, {
              "checked": false,
              "name": "",
              "label": "Pointing"
            }, {
              "checked": false,
              "name": "",
              "label": "Portal Unit"
            }, {
              "checked": false,
              "name": "",
              "label": "Rivet and bolts"
            }, {
              "checked": false,
              "name": "",
              "label": "Services"
            }, {
              "checked": false,
              "name": "",
              "label": "Signage"
            }, {
              "checked": false,
              "name": "",
              "label": "Soffit"
            }, {
              "checked": false,
              "name": "",
              "label": "Spandrel Wall"
            }, {
              "checked": false,
              "name": "",
              "label": "Steelwork"
            }, {
              "checked": false,
              "name": "",
              "label": "Steps"
            }, {
              "checked": false,
              "name": "",
              "label": "Stiffners"
            }, {
              "checked": false,
              "name": "",
              "label": "Stones"
            }, {
              "checked": false,
              "name": "",
              "label": "Timber Sleepers"
            }, {
              "checked": false,
              "name": "",
              "label": "Transverse Timber"
            }, {
              "checked": false,
              "name": "",
              "label": "Troughing"
            }, {
              "checked": false,
              "name": "",
              "label": "Voussoirs"
            }, {
              "checked": false,
              "name": "",
              "label": "Way Beams"
            }, {
              "checked": false,
              "name": "",
              "label": "Wing Wall"
            }],
            "include_blank_option": false
          }
        },
        "name": "Object Part",
        "required": true,
        "type": "dropdown",
        "repeating": false
      }, {
        "values": ["Debris"],
        "_id": "53a44886d55d83f96dad6ca2",
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "options": [{
              "label": "Bent",
              "checked": false
            }, {
              "label": "Blocked",
              "checked": false
            }, {
              "checked": false,
              "name": "",
              "label": "Broken"
            }, {
              "checked": false,
              "name": "",
              "label": "Buckled"
            }, {
              "checked": false,
              "name": "",
              "label": "Chipped"
            }, {
              "checked": false,
              "name": "",
              "label": "Cracked"
            }, {
              "checked": false,
              "name": "",
              "label": "Damaged"
            }, {
              "checked": false,
              "name": "",
              "label": "Debris"
            }, {
              "checked": false,
              "name": "",
              "label": "Deflection"
            }, {
              "checked": false,
              "name": "",
              "label": "Degraded"
            }, {
              "checked": false,
              "name": "",
              "label": "Dislodged"
            }, {
              "checked": false,
              "name": "",
              "label": "Knocked Down"
            }, {
              "checked": false,
              "name": "",
              "label": "Loose"
            }, {
              "checked": false,
              "name": "",
              "label": "Missing"
            }, {
              "checked": false,
              "name": "",
              "label": "Movement"
            }, {
              "checked": false,
              "name": "",
              "label": "Overflow"
            }, {
              "checked": false,
              "name": "",
              "label": "Rotten"
            }, {
              "checked": false,
              "name": "",
              "label": "Scour"
            }, {
              "checked": false,
              "name": "",
              "label": "Scraped"
            }, {
              "checked": false,
              "name": "",
              "label": "Sheared"
            }, {
              "checked": false,
              "name": "",
              "label": "Spalling"
            }, {
              "checked": false,
              "name": "",
              "label": "Superficial Damage"
            }, {
              "checked": false,
              "name": "",
              "label": "Twisted"
            }, {
              "checked": false,
              "name": "",
              "label": "Worn"
            }],
            "include_blank_option": false
          }
        },
        "name": "Damage",
        "required": true,
        "type": "dropdown",
        "repeating": false
      }, {
        "values": [""],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": false,
        "type": "text",
        "name": "Text",
        "_id": "53a44886d55d83f96dad6ca3",
        "repeating": false
      }, {
        "values": ["Build-up of debris"],
        "_id": "53a44886d55d83f96dad6ca4",
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "options": [{
              "label": "Authorised Work",
              "checked": false
            }, {
              "label": "Build-up of debris",
              "checked": false
            }, {
              "checked": false,
              "name": "",
              "label": "Cannot be establised"
            }, {
              "checked": false,
              "name": "",
              "label": "Contractor / 3rd Party Damage"
            }, {
              "checked": false,
              "name": "",
              "label": "Corrosion"
            }, {
              "checked": false,
              "name": "",
              "label": "Damage from burst pipes/services"
            }, {
              "checked": false,
              "name": "",
              "label": "Design error"
            }, {
              "checked": false,
              "name": "",
              "label": "Detachment of services/pipework"
            }, {
              "checked": false,
              "name": "",
              "label": "End of life cycle"
            }, {
              "checked": false,
              "name": "",
              "label": "Erosion/scour"
            }, {
              "checked": false,
              "name": "",
              "label": "Geological activity/land slip"
            }, {
              "checked": false,
              "name": "",
              "label": "Inadequate vegetation control"
            }, {
              "checked": false,
              "name": "",
              "label": "Increased loading"
            }, {
              "checked": false,
              "name": "",
              "label": "Installation Error"
            }, {
              "checked": false,
              "name": "",
              "label": "Lack of Signage"
            }, {
              "checked": false,
              "name": "",
              "label": "Maintenance Error"
            }, {
              "checked": false,
              "name": "",
              "label": "Road Alignment/Condition"
            }, {
              "checked": false,
              "name": "",
              "label": "Severe Weather"
            }, {
              "checked": false,
              "name": "",
              "label": "Unauthorised Work"
            }, {
              "checked": false,
              "name": "",
              "label": "Vandelism"
            }, {
              "checked": false,
              "name": "",
              "label": "Vibration"
            }],
            "include_blank_option": false
          }
        },
        "name": "Cause Code",
        "required": true,
        "type": "dropdown",
        "repeating": false
      }, {
        "values": [""],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": false,
        "type": "text",
        "name": "Cause Text",
        "_id": "53a44886d55d83f96dad6ca5",
        "repeating": false
      }, {
        "values": [{
          "mbaasUrl": "/mbaas/forms/:appId/submission/:submissionId/file/:fileGroupId",
          "url": "/api/v2/forms/submission/file/53c3ae081b70525c65000006?rand=0.05768388323485851",
          "fieldId": "53a44886d55d83f96dad6ca6",
          "fileUpdateTime": 1405332988014,
          "imgHeader": "data:image/png;base64,",
          "fileType": "image/png",
          "fileSize": 557778,
          "contentType": "base64",
          "hashName": "filePlaceHolderd36a25f7b613c3608a25c017202f48f0",
          "fileName": "filePlaceHolderd36a25f7b613c3608a25c017202f48f0.png",
          "groupId": "53c3ae081b70525c65000006"
        }],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "required": false,
        "type": "photo",
        "name": "Photo",
        "_id": "53a44886d55d83f96dad6ca6",
        "repeating": false
      }, {
        "values": ["Yes"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "options": [{
              "label": "Yes",
              "checked": false
            }, {
              "label": "No",
              "checked": true
            }]
          }
        },
        "required": false,
        "type": "radio",
        "name": "Photo 2 ?",
        "helpText": "Add another photo if required",
        "_id": "53bfad751d4fa7740ac2ffa9",
        "repeating": false
      }, {
        "values": [],
        "_id": "53bfa7e0ac1ca9710aa9898c",
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "helpText": "",
        "name": "Photo 2",
        "required": false,
        "type": "photo",
        "repeating": false
      }, {
        "values": ["No"],
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          },
          "definition": {
            "options": [{
              "label": "Yes",
              "checked": false
            }, {
              "label": "No",
              "checked": true
            }]
          }
        },
        "required": false,
        "type": "radio",
        "name": "Photo 3 ?",
        "helpText": "Add another photo if required",
        "_id": "53bfad751d4fa7740ac2ffaa",
        "repeating": false
      }, {
        "values": [],
        "_id": "53bfa7e0ac1ca9710aa9898d",
        "fieldOptions": {
          "validation": {
            "validateImmediately": false
          }
        },
        "helpText": "",
        "name": "Photo 3",
        "required": false,
        "type": "photo",
        "repeating": false
      }]
    }],
    "lastUpdated": "2014-07-11T16:55:12.675Z",
    "dateCreated": "2014-06-20T14:43:18.721Z"
  },
  "masterFormTimestamp": "2014-07-11T16:55:12.675Z",
  "timezoneOffset": -60,
  "userId": null,
  "formFields": [{
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": false,
      "type": "text",
      "name": "Order",
      "_id": "53bffefd3a772d4b129ab421",
      "repeating": false
    },
    "fieldValues": ["530132297"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": true,
      "type": "number",
      "name": "Equipment",
      "_id": "53a44886d55d83f96dad6c96",
      "repeating": false
    },
    "fieldValues": [30003713]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": true,
      "type": "text",
      "name": "Serial Number",
      "_id": "53a44886d55d83f96dad6c97",
      "repeating": false
    },
    "fieldValues": ["UBS542A"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": false,
      "type": "text",
      "name": "Main Work Ctr",
      "_id": "53a44886d55d83f96dad6c9a",
      "repeating": false
    },
    "fieldValues": ["ATH-STSE"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": true,
      "type": "text",
      "name": "Description",
      "_id": "53a44886d55d83f96dad6c95",
      "repeating": false
    },
    "fieldValues": ["Vegetation"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": false,
      "type": "text",
      "name": "Planner Group",
      "_id": "53a44886d55d83f96dad6c99",
      "repeating": false
    },
    "fieldValues": ["ATH"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "defaultValue": "TI"
        }
      },
      "required": true,
      "type": "text",
      "name": "Notification Type",
      "_id": "53a44886d55d83f96dad6c94",
      "repeating": false
    },
    "fieldValues": ["TI"]
  }, {
    "fieldId": {
      "_id": "53a44886d55d83f96dad6c98",
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "defaultValue": "BRIDGE"
        }
      },
      "name": "Material",
      "required": false,
      "type": "text",
      "repeating": false
    },
    "fieldValues": ["BRIDGE"]
  }, {
    "fieldId": {
      "_id": "53a44886d55d83f96dad6c9b",
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "defaultValue": "",
          "minRepeat": 1,
          "maxRepeat": 5
        }
      },
      "name": "Reported by",
      "required": true,
      "type": "text",
      "repeating": false
    },
    "fieldValues": ["Nmc"]
  }, {
    "fieldId": {
      "_id": "53a44886d55d83f96dad6c9c",
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "options": [{
            "label": "Adjust",
            "checked": false
          }, {
            "label": "Blast",
            "checked": false
          }, {
            "checked": false,
            "name": "",
            "label": "Clean"
          }, {
            "checked": false,
            "name": "",
            "label": "Clear Debris"
          }, {
            "checked": false,
            "name": "",
            "label": "Inspect"
          }, {
            "checked": false,
            "name": "",
            "label": "Install / Erect"
          }, {
            "checked": false,
            "name": "",
            "label": "Monitor "
          }, {
            "checked": false,
            "name": "",
            "label": "Paint"
          }, {
            "checked": false,
            "name": "",
            "label": "Pointing"
          }, {
            "checked": false,
            "name": "",
            "label": "Remove"
          }, {
            "checked": false,
            "name": "",
            "label": "Repair"
          }, {
            "checked": false,
            "name": "",
            "label": "Replace"
          }, {
            "checked": false,
            "name": "",
            "label": "Reset"
          }, {
            "checked": false,
            "name": "",
            "label": "Secure"
          }, {
            "checked": false,
            "name": "",
            "label": "Stitch"
          }, {
            "checked": false,
            "name": "",
            "label": "Survey"
          }, {
            "checked": false,
            "name": "",
            "label": "Tighten"
          }, {
            "checked": false,
            "name": "",
            "label": "Vegetation Control"
          }],
          "include_blank_option": false
        }
      },
      "name": "Coding",
      "required": true,
      "type": "dropdown",
      "repeating": false
    },
    "fieldValues": ["Adjust"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": false,
      "type": "text",
      "name": "Description",
      "_id": "53a44886d55d83f96dad6c9d",
      "repeating": false
    },
    "fieldValues": [""]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "datetimeUnit": "date"
        }
      },
      "name": "Required Start",
      "required": false,
      "type": "dateTime",
      "_id": "53a44886d55d83f96dad6c9e",
      "repeating": false
    },
    "fieldValues": [""]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "options": [{
            "label": "High",
            "checked": false
          }, {
            "label": "Medium",
            "checked": false
          }, {
            "checked": false,
            "name": "",
            "label": "Low"
          }],
          "include_blank_option": true
        }
      },
      "required": true,
      "type": "dropdown",
      "name": "Priority",
      "_id": "53a44886d55d83f96dad6ca0",
      "repeating": false
    },
    "fieldValues": ["Medium"]
  }, {
    "fieldId": {
      "_id": "53a44886d55d83f96dad6ca1",
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "options": [{
            "label": "Abuttments",
            "checked": false
          }, {
            "label": "Approach wall",
            "checked": false
          }, {
            "checked": false,
            "name": "",
            "label": "Arch"
          }, {
            "checked": false,
            "name": "",
            "label": "Ballast Guards"
          }, {
            "checked": false,
            "name": "",
            "label": "Beams"
          }, {
            "checked": false,
            "name": "",
            "label": "Bearers"
          }, {
            "checked": false,
            "name": "",
            "label": "Bearing Pad"
          }, {
            "checked": false,
            "name": "",
            "label": "Bedstone"
          }, {
            "checked": false,
            "name": "",
            "label": "Box Section"
          }, {
            "checked": false,
            "name": "",
            "label": "Buffer Beam"
          }, {
            "checked": false,
            "name": "",
            "label": "Coping Stone"
          }, {
            "checked": false,
            "name": "",
            "label": "Crash Barriers"
          }, {
            "checked": false,
            "name": "",
            "label": "Cross Girders"
          }, {
            "checked": false,
            "name": "",
            "label": "Crown"
          }, {
            "checked": false,
            "name": "",
            "label": "Deck"
          }, {
            "checked": false,
            "name": "",
            "label": "Drainage"
          }, {
            "checked": false,
            "name": "",
            "label": "Flanges"
          }, {
            "checked": false,
            "name": "",
            "label": "Foundation"
          }, {
            "checked": false,
            "name": "",
            "label": "Goal Posts"
          }, {
            "checked": false,
            "name": "",
            "label": "Handrail"
          }, {
            "checked": false,
            "name": "",
            "label": "Main Girders"
          }, {
            "checked": false,
            "name": "",
            "label": "Parapets"
          }, {
            "checked": false,
            "name": "",
            "label": "Pipe"
          }, {
            "checked": false,
            "name": "",
            "label": "Pointing"
          }, {
            "checked": false,
            "name": "",
            "label": "Portal Unit"
          }, {
            "checked": false,
            "name": "",
            "label": "Rivet and bolts"
          }, {
            "checked": false,
            "name": "",
            "label": "Services"
          }, {
            "checked": false,
            "name": "",
            "label": "Signage"
          }, {
            "checked": false,
            "name": "",
            "label": "Soffit"
          }, {
            "checked": false,
            "name": "",
            "label": "Spandrel Wall"
          }, {
            "checked": false,
            "name": "",
            "label": "Steelwork"
          }, {
            "checked": false,
            "name": "",
            "label": "Steps"
          }, {
            "checked": false,
            "name": "",
            "label": "Stiffners"
          }, {
            "checked": false,
            "name": "",
            "label": "Stones"
          }, {
            "checked": false,
            "name": "",
            "label": "Timber Sleepers"
          }, {
            "checked": false,
            "name": "",
            "label": "Transverse Timber"
          }, {
            "checked": false,
            "name": "",
            "label": "Troughing"
          }, {
            "checked": false,
            "name": "",
            "label": "Voussoirs"
          }, {
            "checked": false,
            "name": "",
            "label": "Way Beams"
          }, {
            "checked": false,
            "name": "",
            "label": "Wing Wall"
          }],
          "include_blank_option": false
        }
      },
      "name": "Object Part",
      "required": true,
      "type": "dropdown",
      "repeating": false
    },
    "fieldValues": ["Abuttments"]
  }, {
    "fieldId": {
      "_id": "53a44886d55d83f96dad6ca2",
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "options": [{
            "label": "Bent",
            "checked": false
          }, {
            "label": "Blocked",
            "checked": false
          }, {
            "checked": false,
            "name": "",
            "label": "Broken"
          }, {
            "checked": false,
            "name": "",
            "label": "Buckled"
          }, {
            "checked": false,
            "name": "",
            "label": "Chipped"
          }, {
            "checked": false,
            "name": "",
            "label": "Cracked"
          }, {
            "checked": false,
            "name": "",
            "label": "Damaged"
          }, {
            "checked": false,
            "name": "",
            "label": "Debris"
          }, {
            "checked": false,
            "name": "",
            "label": "Deflection"
          }, {
            "checked": false,
            "name": "",
            "label": "Degraded"
          }, {
            "checked": false,
            "name": "",
            "label": "Dislodged"
          }, {
            "checked": false,
            "name": "",
            "label": "Knocked Down"
          }, {
            "checked": false,
            "name": "",
            "label": "Loose"
          }, {
            "checked": false,
            "name": "",
            "label": "Missing"
          }, {
            "checked": false,
            "name": "",
            "label": "Movement"
          }, {
            "checked": false,
            "name": "",
            "label": "Overflow"
          }, {
            "checked": false,
            "name": "",
            "label": "Rotten"
          }, {
            "checked": false,
            "name": "",
            "label": "Scour"
          }, {
            "checked": false,
            "name": "",
            "label": "Scraped"
          }, {
            "checked": false,
            "name": "",
            "label": "Sheared"
          }, {
            "checked": false,
            "name": "",
            "label": "Spalling"
          }, {
            "checked": false,
            "name": "",
            "label": "Superficial Damage"
          }, {
            "checked": false,
            "name": "",
            "label": "Twisted"
          }, {
            "checked": false,
            "name": "",
            "label": "Worn"
          }],
          "include_blank_option": false
        }
      },
      "name": "Damage",
      "required": true,
      "type": "dropdown",
      "repeating": false
    },
    "fieldValues": ["Debris"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": false,
      "type": "text",
      "name": "Text",
      "_id": "53a44886d55d83f96dad6ca3",
      "repeating": false
    },
    "fieldValues": [""]
  }, {
    "fieldId": {
      "_id": "53a44886d55d83f96dad6ca4",
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "options": [{
            "label": "Authorised Work",
            "checked": false
          }, {
            "label": "Build-up of debris",
            "checked": false
          }, {
            "checked": false,
            "name": "",
            "label": "Cannot be establised"
          }, {
            "checked": false,
            "name": "",
            "label": "Contractor / 3rd Party Damage"
          }, {
            "checked": false,
            "name": "",
            "label": "Corrosion"
          }, {
            "checked": false,
            "name": "",
            "label": "Damage from burst pipes/services"
          }, {
            "checked": false,
            "name": "",
            "label": "Design error"
          }, {
            "checked": false,
            "name": "",
            "label": "Detachment of services/pipework"
          }, {
            "checked": false,
            "name": "",
            "label": "End of life cycle"
          }, {
            "checked": false,
            "name": "",
            "label": "Erosion/scour"
          }, {
            "checked": false,
            "name": "",
            "label": "Geological activity/land slip"
          }, {
            "checked": false,
            "name": "",
            "label": "Inadequate vegetation control"
          }, {
            "checked": false,
            "name": "",
            "label": "Increased loading"
          }, {
            "checked": false,
            "name": "",
            "label": "Installation Error"
          }, {
            "checked": false,
            "name": "",
            "label": "Lack of Signage"
          }, {
            "checked": false,
            "name": "",
            "label": "Maintenance Error"
          }, {
            "checked": false,
            "name": "",
            "label": "Road Alignment/Condition"
          }, {
            "checked": false,
            "name": "",
            "label": "Severe Weather"
          }, {
            "checked": false,
            "name": "",
            "label": "Unauthorised Work"
          }, {
            "checked": false,
            "name": "",
            "label": "Vandelism"
          }, {
            "checked": false,
            "name": "",
            "label": "Vibration"
          }],
          "include_blank_option": false
        }
      },
      "name": "Cause Code",
      "required": true,
      "type": "dropdown",
      "repeating": false
    },
    "fieldValues": ["Build-up of debris"]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "required": false,
      "type": "text",
      "name": "Cause Text",
      "_id": "53a44886d55d83f96dad6ca5",
      "repeating": false
    },
    "fieldValues": [""]
  }, {
    "fieldId": {
      "_id": "53a44886d55d83f96dad6ca6",
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "minRepeat": 1,
          "maxRepeat": 5
        }
      },
      "name": "Photo",
      "required": false,
      "type": "photo",
      "repeating": false
    },
    "fieldValues": [{
      "mbaasUrl": "/mbaas/forms/:appId/submission/:submissionId/file/:fileGroupId",
      "url": "/api/v2/forms/submission/file/53c3ae081b70525c65000006?rand=0.05768388323485851",
      "fieldId": "53a44886d55d83f96dad6ca6",
      "fileUpdateTime": 1405332988014,
      "imgHeader": "data:image/png;base64,",
      "fileType": "image/png",
      "fileSize": 557778,
      "contentType": "base64",
      "hashName": "filePlaceHolderd36a25f7b613c3608a25c017202f48f0",
      "fileName": "filePlaceHolderd36a25f7b613c3608a25c017202f48f0.png",
      "groupId": "53c3ae081b70525c65000006"
    }]
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "options": [{
            "label": "Yes",
            "checked": false
          }, {
            "label": "No",
            "checked": true
          }]
        }
      },
      "required": false,
      "type": "radio",
      "name": "Photo 2 ?",
      "helpText": "Add another photo if required",
      "_id": "53bfad751d4fa7740ac2ffa9",
      "repeating": false
    },
    "fieldValues": ["Yes"]
  }, {
    "fieldId": {
      "_id": "53bfa7e0ac1ca9710aa9898c",
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "helpText": "",
      "name": "Photo 2",
      "required": false,
      "type": "photo",
      "repeating": false
    },
    "fieldValues": []
  }, {
    "fieldId": {
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        },
        "definition": {
          "options": [{
            "label": "Yes",
            "checked": false
          }, {
            "label": "No",
            "checked": true
          }]
        }
      },
      "required": false,
      "type": "radio",
      "name": "Photo 3 ?",
      "helpText": "Add another photo if required",
      "_id": "53bfad751d4fa7740ac2ffaa",
      "repeating": false
    },
    "fieldValues": ["No"]
  }, {
    "fieldId": {
      "_id": "53bfa7e0ac1ca9710aa9898d",
      "fieldOptions": {
        "validation": {
          "validateImmediately": false
        }
      },
      "helpText": "",
      "name": "Photo 3",
      "required": false,
      "type": "photo",
      "repeating": false
    },
    "fieldValues": []
  }],
  "comments": [],
  "status": "complete",
  "submissionStartedTimestamp": "2014-07-14T10:16:29.989Z",
  "updatedTimestamp": "2014-07-14T10:16:42.618Z",
  "submissionCompletedTimestamp": "2014-07-14T10:16:42.606Z"
};

module.exports = {
  complexSubmission1: complexSubmission1,
  complexSubmissionOrder: complexSubmissionOrder
};