//Creating every field that is not a file to save.

module.exports = {
  "textFieldData":{
    "name":"textField",
    "helpText":"This is a text field",
    "type":"text",
    "repeating":true,
    "required":false,
    "fieldOptions":{
      "definition":{
        "maxRepeat":5,
        "minRepeat":2
      },
      "validation":{
        "min":20,
        "max":100
      }
    }
  },
  "fileFieldData":{
    "name":"fileField",
    "helpText":"This is a file field",
    "type":"file",
    "repeating":true,
    "required":false,
    "fieldOptions":{
      "definition":{
        "maxRepeat":5,
        "minRepeat":2
      }
    }
  },
  "photoFieldData":{
    "name":"photoField",
    "helpText":"This is a photo field",
    "type":"photo",
    "repeating":true,
    "required":false,
    "fieldOptions":{
      "definition":{
        "maxRepeat":5,
        "minRepeat":2
      }
    }
  },
  "signatureFieldData":{
    "name":"signatureField",
    "helpText":"This is a signature field",
    "type":"signature",
    "repeating":true,
    "required":false,
    "fieldOptions":{
      "definition":{
        "maxRepeat":5,
        "minRepeat":2
      }
    }
  },
  "textAreaFieldData":{
    "name":"textAreaField",
    "helpText":"This is a text area field",
    "type":"textarea",
    "repeating":true,
    "required":false,
    "fieldOptions":{
      "definition":{
        "maxRepeat":5,
        "minRepeat":3
      },
      "validation":{
        "min":50,
        "max":100
      }
    }
  },
  "numberFieldData":{
    "name":"numberField",
    "helpText":"This is a number field",
    "type":"number",
    "repeating":true,
    "required":false,
    "fieldOptions":{
      "definition":{
        "maxRepeat":5,
        "minRepeat":2
      },
      "validation":{
        "min":0,
        "max":100
      }
    }
  },
  "emailAddressFieldData":{
    "name":"emailField",
    "helpText":"This is a Email field",
    "type":"emailAddress",
    "repeating":true,
    "required":false,
    "fieldOptions":{
      "definition":{
        "maxRepeat":5,
        "minRepeat":1
      },
      "validation":{}
    }
  },
  "radioFieldData":{
    "name":"radioField",
    "helpText":"This is a Radio field",
    "type":"radio",
    "repeating":true,
    "required":false,
    "fieldOptions":{
      "definition":{
        "maxRepeat":2,
        "minRepeat":2,
        "radioChoices":[
          {
            "radioVal1":20
          },
          {
            "radioVal2":10
          },
          {
            "radioVal3":130
          },
          {
            "radioVal4":12
          }
        ]
      }
    }
  },
  "selectFieldData":{
    "name":"selectField",
    "helpText":"This is a Select field",
    "type":"select",
    "repeating":true,
    "required":false,
    "fieldOptions":{
      "definition":{
        "maxRepeat":2,
        "minRepeat":2,
        "selectChoices":[
          {
            "selectval1":32
          },
          {
            "selectval2":33
          },
          {
            "selectval3":34
          },
          {
            "selectval4":35
          }
        ]
      }
    }
  },
  "matrixFieldData":{
    "name":"matrixField",
    "helpText":"This is a Matrix field",
    "type":"matrix",
    "repeating":true,
    "required":false,
    "fieldOptions": {
      "definition": {
        "rows":[
          {
            "matRow1":3
          },
          {
            "matRow2":3
          },
          {
            "matRow3":3
          },
          {
            "matRow4":3
          },
          {
            "matRow5":3
          },
          {
            "matRow6":3
          }
        ],
        "columns":[
          {
            "matCol1":1
          },
          {
            "matCol2":2
          },
          {
            "matCol3":3
          },
          {
            "matCol4":4
          },
          {
            "matCol5":6
          }
        ],
        "maxRepeat":2,
        "minRepeat":2
      },
      "validation": {}
    }
  },
  "checkboxFieldData":{
    "name":"checkboxField",
    "helpText":"This is a Checkbox field",
    "type":"checkbox",
    "repeating":true,
    "required":false,
    "fieldOptions" : {
      "definition": {
        "checkboxChoices":[
          {
            "red":{
              "value":1,
              "selected":true
            }
          },
          {
            "blue":{
              "value":2,
              "selected":false
            }
          },
          {
            "green":{
              "value":3,
              "selected":false
            }
          },
          {
            "purple":{
              "value":4,
              "selected":false
            }
          },
          {
            "black":{
              "value":5,
              "selected":true
            }
          }
        ],
        "minRepeat":2,
        "maxRepeat":3

      },
      "validation": {
        "min":2,
        "max":3
      }
    }
  },
  "locationLatLongFieldData":{
    "name":"locationLatLongField",
    "helpText":"This is a locationLatLong field",
    "type":"locationLatLong",
    "repeating":true,
    "required":false,
    "fieldOptions": {
      "definition" : {
        "maxRepeat":4,
        "minRepeat":2
      },
      "validation" : {}
    }
  },
  "locationNorthEastFieldData":{
    "name":"locationNorthEastField",
    "helpText":"This is a locationNorthEast field",
    "type":"locationNorthEast",
    "repeating":true,
    "required":false,
    "fieldOptions": {
      "definition" : {
        "maxRepeat":2,
        "minRepeat":2
      },
      "validation" : {}
    }
  },
  "locationMapFieldData":{
    "name":"locationMapField",
    "helpText":"This is a locationMap field",
    "type":"locationMap",
    "repeating":true,
    "required":false,
    "fieldOptions": {
      "definition" : {
        "maxRepeat":6,
        "minRepeat":1
      },
      "validation" : {}
    }
  },
  "dateFieldData":{
    "name":"dateField",
    "helpText":"This is a date field",
    "type":"date",
    "repeating":true,
    "required":false,
    "fieldOptions": {
      "definition" : {
        "maxRepeat":6,
        "minRepeat":1
      },
      "validation" : {}
    }
  },
  "timeFieldData":{
    "name":"timeField",
    "helpText":"This is a time field",
    "type":"time",
    "repeating":true,
    "required":false,
    "fieldOptions": {
      "definition" : {
        "maxRepeat":6,
        "minRepeat":3
      },
      "validation" : {}
    }
  },
  "dateTimeFieldData":{
    "name":"dateTimeField",
    "helpText":"This is a dateTime field",
    "type":"dateTime",
    "repeating":true,
    "required":false,
    "fieldOptions": {
      "definition" : {
        "maxRepeat":6,
        "minRepeat":1
      },
      "validation" : {}
    }
  },
  "sectionBreakFieldData":{
    "name":"sectionBreakField",
    "helpText":"This is a sectionBreak field",
    "type":"sectionBreak",
    "repeating":false,
    "required":false,
    "fieldOptions": {}
  },
  "sectionBreak2FieldData":{
    "name":"sectionBreak2Field",
    "helpText":"This is another sectionBreak field",
    "type":"sectionBreak",
    "repeating":false,
    "required":false,
    "fieldOptions": {}
  }
}