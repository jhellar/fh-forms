var themeCSSGenerator = function(themeJSON, styleStructure) {
  var FH_APPFORM_PREFIX = "fh_appform_";
  var FH_APPFORM_CONTAINER_CLASS_PREFIX = "#" + FH_APPFORM_PREFIX + "container ";
  var fh_styleStructure = {
    "logo": {
      "staticCSS": [
        {"key": "background-position", "value": "center"},
        {"key": "background-repeat", "value": "no-repeat"},
        {"key": "background-size", "value": "100% 100%"},
        {"key": "display", "value": "inline-block"},
        {"key": "max-height", "value": "150px"}, //set max height for logo
        {"key": "max-width", "value": "90%"} //max width for logo
      ]
    },
    "sections": [
      {
        "id": "form",
        "label": "Form",
        "sub_sections": [
          {
            "id": "area",
            "label": "Background",
            "style": {
              "typography": false,
              "background": true,
              "border": true,
              "margin": {"top": false, "right": false, "bottom": false, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [
            ]
          },
          {
            "id": "title",
            "label": "Title",
            "style": {
              "typography": true,
              "background": false,
              "border": false,
              "margin": {"top": true, "right": false, "bottom": true, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [
              {
                "key": "line-height",
                "value": "1em"
              }
            ]
          }
        ]
      },
      {
        "id": "page",
        "label": "Page",
        "sub_sections": [
          {
            "id": "title",
            "label": "Title",
            "style": {
              "typography": true,
              "background": false,
              "border": false,
              "margin": {"top": true, "right": true, "bottom": true, "left": true},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": []
          },
          {
            "id": "description",
            "label": "Description",
            "style": {
              "typography": true,
              "background": false,
              "border": false,
              "margin": {"top": true, "right": true, "bottom": true, "left": true},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": []
          },
          {
            "id": "progress_steps",
            "label": "Page Area",
            "class_name": "progress_steps",
            "style": {
              "typography": false,
              "background": true,
              "border": true,
              "margin": {"top": true, "right": false, "bottom": true, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [

            ],
            "classAdditions": [

            ]
          },
          {
            "id": "progress_steps_number_container",
            "label": "Page Number Container",
            "class_name": "progress_steps .number_container",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": {"top": false, "right": false, "bottom": false, "left": false},
              "padding": {"top": true, "right": false, "bottom": true, "left": false}
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "0px"
              }
            ]
          },
          {
            "id": "progress_steps_number_container_active",
            "class_name": "progress_steps li.active .number_container",
            "label": "Page Number Container (Active)",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": {"top": false, "right": false, "bottom": false, "left": false},
              "padding": {"top": true, "right": false, "bottom": true, "left": false}
            },
            "staticCSS": []
          }
        ]
      },
      {
        "id": "section",
        "label": "Section",
        "sub_sections": [
          {
            "id": "area",
            "label": "Area",
            "style": {
              "typography": false,
              "background": true,
              "border": true,
              "margin": {"top": true, "right": false, "bottom": true, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "0px"
              }
            ]
          },
          {
            "id": "title",
            "label": "Title",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": {"top": true, "right": false, "bottom": true, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [
              {
                "key": "line-height",
                "value": "1em"
              }
            ]
          },
          {
            "id": "description",
            "label": "Description",
            "style": {
              "typography": true,
              "background": false,
              "border": false,
              "margin": {"top": true, "right": false, "bottom": true, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [

            ]
          }
        ]
      },
      {
        "id": "field",
        "label": "Field",
        "sub_sections": [
          {
            "id": "area",
            "label": "Area",
            "style": {
              "typography": false,
              "background": true,
              "border": true,
              "margin": {"top": true, "right": false, "bottom": true, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "0px"
              }
            ]
          },
          {
            "id": "title",
            "label": "Title",
            "style": {
              "typography": true,
              "background": true,
              "border": false,
              "margin": {"top": true, "right": false, "bottom": true, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "0px"
              }
            ]
          },
          {
            "id": "instructions",
            "label": "Instructions",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": {"top": true, "right": false, "bottom": true, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "0px"
              }
            ]
          },
          {
            "id": "input",
            "label": "Input Area",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": {"top": true, "right": false, "bottom": true, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "0px"
              }
            ],
            "classAdditions": [

            ]
          },
          {
            "id": "error",
            "label": "Error Highlighting",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": {"top": true, "right": false, "bottom": true, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "0px"
              },
              {
                "key": "height",
                "value": "100%"
              }
            ]
          },
          {
            "id": "numbering",
            "label": "Numbering",
            "style": {
              "typography": true,
              "background": true,
              "border": false,
              "margin": {"top": false, "right": false, "bottom": false, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [

            ]
          },
          {
            "id": "required",
            "label": "Required Symbol (*)",
            "style": {
              "typography": true,
              "background": false,
              "border": false,
              "margin": {"top": false, "right": false, "bottom": false, "left": false},
              "padding": {"top": false, "right": false, "bottom": false, "left": false}
            },
            "staticCSS": [
              {
                "key": "content",
                "value": "\"*\""
              },
              {
                "key": "vertical-align",
                "value": "top"
              }
            ],
            "class_name": "field_required:after"
          }
        ]
      },
      {
        "id": "button",
        "label": "Buttons",
        "sub_sections": [
          {
            "id": "bar",
            "label": "Button Bar",
            "style": {
              "typography": false,
              "background": true,
              "border": true,
              "margin": {"top": true, "right": false, "bottom": true, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [
              {
                "key": "border-spacing",
                "value": "5px 0px"
              }
            ]
          },
          {
            "id": "default",
            "label": "Default",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": {"top": false, "right": false, "bottom": false, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "0px"
              },
              {
                "key": "white-space",
                "value": "normal"
              }
            ],
            "classAdditions": [

            ]
          },
          {
            "id": "default_active",
            "class_name": "button_default:active, #fh_appform_container .button_default.active",
            "label": "Default (Active)",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": {"top": false, "right": false, "bottom": false, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "0px"
              },
              {
                "key": "white-space",
                "value": "normal"
              }
            ],
            "classAdditions": [

            ]
          },
          {
            "id": "action",
            "label": "Action",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": {"top": false, "right": false, "bottom": false, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "0px"
              },
              {
                "key": "white-space",
                "value": "normal"
              }
            ],
            "classAdditions": [

            ]
          },
          {
            "id": "action_active",
            "class_name": "button_action:active ,#fh_appform_container .fh_appform_button_action.active",
            "label": "Action (Active)",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": {"top": false, "right": false, "bottom": false, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "0px"
              },
              {
                "key": "white-space",
                "value": "normal"
              }
            ],
            "classAdditions": [

            ]
          },
          {
            "id": "cancel",
            "label": "Cancel",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": {"top": false, "right": false, "bottom": false, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "0px"
              },
              {
                "key": "white-space",
                "value": "normal"
              }
            ],
            "classAdditions": [

            ]
          },
          {
            "id": "cancel_active",
            "class_name": "button_cancel:active, #fh_appform_container .button_cancel.active",
            "label": "Cancel (Active)",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": {"top": false, "right": false, "bottom": false, "left": false},
              "padding": {"top": true, "right": true, "bottom": true, "left": true}
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "0px"
              },
              {
                "key": "white-space",
                "value": "normal"
              }
            ],
            "classAdditions": [

            ]
          }
        ]
      }
    ]};


  styleStructure = styleStructure ? styleStructure : fh_styleStructure;

  var baseTheme = {
    "name": "Base Template",
    "structure": {
      "logo": {
        "staticCSS": [{
          "key": "background-position",
          "value": "center"
        }, {
          "key": "background-repeat",
          "value": "no-repeat"
        }, {
          "key": "background-size",
          "value": "100% 100%"
        }, {
          "key": "display",
          "value": "inline-block"
        }, {
          "key": "max-height",
          "value": "150px"
        }, {
          "key": "max-width",
          "value": "90%"
        }]
      },
      "sections": [{
        "id": "form",
        "label": "Form",
        "sub_sections": [{
          "id": "area",
          "label": "Background",
          "classAdditions": [],
          "staticCSS": [],
          "style": {
            "typography": false,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": false,
              "right": false,
              "bottom": false,
              "left": false
            }
          }
        }, {
          "id": "title",
          "label": "Title",
          "classAdditions": [],
          "staticCSS": [{
            "key": "line-height",
            "value": "1em"
          }],
          "style": {
            "typography": true,
            "background": false,
            "border": false,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": true,
              "right": false,
              "bottom": true,
              "left": false
            }
          }
        }]
      }, {
        "id": "page",
        "label": "Page",
        "sub_sections": [{
          "id": "title",
          "label": "Title",
          "classAdditions": [],
          "staticCSS": [],
          "style": {
            "typography": true,
            "background": false,
            "border": false,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            }
          }
        }, {
          "id": "description",
          "label": "Description",
          "classAdditions": [],
          "staticCSS": [],
          "style": {
            "typography": true,
            "background": false,
            "border": false,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            }
          }
        }, {
          "id": "progress_steps",
          "label": "Page Area",
          "classAdditions": [],
          "staticCSS": [],
          "style": {
            "typography": false,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": true,
              "right": false,
              "bottom": true,
              "left": false
            }
          }
        }, {
          "id": "progress_steps_number_container",
          "label": "Page Number Container",
          "classAdditions": [],
          "staticCSS": [{
            "key": "border-radius",
            "value": "0px"
          }],
          "style": {
            "typography": true,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": false,
              "bottom": true,
              "left": false
            },
            "margin": {
              "top": false,
              "right": false,
              "bottom": false,
              "left": false
            }
          }
        }, {
          "id": "progress_steps_number_container_active",
          "label": "Page Number Container (Active)",
          "classAdditions": [],
          "staticCSS": [],
          "style": {
            "typography": true,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": false,
              "bottom": true,
              "left": false
            },
            "margin": {
              "top": false,
              "right": false,
              "bottom": false,
              "left": false
            }
          }
        }]
      }, {
        "id": "section",
        "label": "Section",
        "sub_sections": [{
          "id": "area",
          "label": "Area",
          "classAdditions": [],
          "staticCSS": [{
            "key": "border-radius",
            "value": "0px"
          }],
          "style": {
            "typography": false,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": true,
              "right": false,
              "bottom": true,
              "left": false
            }
          }
        }, {
          "id": "title",
          "label": "Title",
          "classAdditions": [],
          "staticCSS": [{
            "key": "line-height",
            "value": "1em"
          }],
          "style": {
            "typography": true,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": true,
              "right": false,
              "bottom": true,
              "left": false
            }
          }
        }, {
          "id": "description",
          "label": "Description",
          "classAdditions": [],
          "staticCSS": [],
          "style": {
            "typography": true,
            "background": false,
            "border": false,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": true,
              "right": false,
              "bottom": true,
              "left": false
            }
          }
        }]
      }, {
        "id": "field",
        "label": "Field",
        "sub_sections": [{
          "id": "area",
          "label": "Area",
          "classAdditions": [],
          "staticCSS": [{
            "key": "border-radius",
            "value": "0px"
          }],
          "style": {
            "typography": false,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": true,
              "right": false,
              "bottom": true,
              "left": false
            }
          }
        }, {
          "id": "title",
          "label": "Title",
          "classAdditions": [],
          "staticCSS": [{
            "key": "border-radius",
            "value": "0px"
          }],
          "style": {
            "typography": true,
            "background": true,
            "border": false,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": true,
              "right": false,
              "bottom": true,
              "left": false
            }
          }
        }, {
          "id": "instructions",
          "label": "Instructions",
          "classAdditions": [],
          "staticCSS": [{
            "key": "border-radius",
            "value": "0px"
          }],
          "style": {
            "typography": true,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": true,
              "right": false,
              "bottom": true,
              "left": false
            }
          }
        }, {
          "id": "input",
          "label": "Input Area",
          "classAdditions": [],
          "staticCSS": [{
            "key": "border-radius",
            "value": "0px"
          }],
          "style": {
            "typography": true,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": true,
              "right": false,
              "bottom": true,
              "left": false
            }
          }
        }, {
          "id": "error",
          "label": "Error Highlighting",
          "classAdditions": [],
          "staticCSS": [{
            "key": "border-radius",
            "value": "0px"
          }, {
            "key": "height",
            "value": "100%"
          }],
          "style": {
            "typography": true,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": true,
              "right": false,
              "bottom": true,
              "left": false
            }
          }
        }, {
          "id": "numbering",
          "label": "Numbering",
          "classAdditions": [],
          "staticCSS": [],
          "style": {
            "typography": true,
            "background": true,
            "border": false,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": false,
              "right": false,
              "bottom": false,
              "left": false
            }
          }
        }, {
          "id": "required",
          "label": "Required Symbol (*)",
          "classAdditions": [],
          "staticCSS": [{
            "key": "content",
            "value": "\"*\""
          }, {
            "key": "vertical-align",
            "value": "top"
          }],
          "style": {
            "typography": true,
            "background": false,
            "border": false,
            "padding": {
              "top": false,
              "right": false,
              "bottom": false,
              "left": false
            },
            "margin": {
              "top": false,
              "right": false,
              "bottom": false,
              "left": false
            }
          }
        }]
      }, {
        "id": "button",
        "label": "Buttons",
        "sub_sections": [{
          "id": "bar",
          "label": "Button Bar",
          "classAdditions": [],
          "staticCSS": [{
            "key": "border-spacing",
            "value": "5px 0px"
          }],
          "style": {
            "typography": false,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": true,
              "right": false,
              "bottom": true,
              "left": false
            }
          }
        }, {
          "id": "default",
          "label": "Default",
          "classAdditions": [],
          "staticCSS": [{
            "key": "border-radius",
            "value": "0px"
          }, {
            "key": "white-space",
            "value": "normal"
          }],
          "style": {
            "typography": true,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": false,
              "right": false,
              "bottom": false,
              "left": false
            }
          }
        }, {
          "id": "default_active",
          "label": "Default (Active)",
          "classAdditions": [],
          "staticCSS": [{
            "key": "border-radius",
            "value": "0px"
          }, {
            "key": "white-space",
            "value": "normal"
          }],
          "style": {
            "typography": true,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": false,
              "right": false,
              "bottom": false,
              "left": false
            }
          }
        }, {
          "id": "action",
          "label": "Action",
          "classAdditions": [],
          "staticCSS": [{
            "key": "border-radius",
            "value": "0px"
          }, {
            "key": "white-space",
            "value": "normal"
          }],
          "style": {
            "typography": true,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": false,
              "right": false,
              "bottom": false,
              "left": false
            }
          }
        }, {
          "id": "action_active",
          "label": "Action (Active)",
          "classAdditions": [],
          "staticCSS": [{
            "key": "border-radius",
            "value": "0px"
          }, {
            "key": "white-space",
            "value": "normal"
          }],
          "style": {
            "typography": true,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": false,
              "right": false,
              "bottom": false,
              "left": false
            }
          }
        }, {
          "id": "cancel",
          "label": "Cancel",
          "classAdditions": [],
          "staticCSS": [{
            "key": "border-radius",
            "value": "0px"
          }, {
            "key": "white-space",
            "value": "normal"
          }],
          "style": {
            "typography": true,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": false,
              "right": false,
              "bottom": false,
              "left": false
            }
          }
        }, {
          "id": "cancel_active",
          "label": "Cancel (Active)",
          "classAdditions": [],
          "staticCSS": [{
            "key": "border-radius",
            "value": "0px"
          }, {
            "key": "white-space",
            "value": "normal"
          }],
          "style": {
            "typography": true,
            "background": true,
            "border": true,
            "padding": {
              "top": true,
              "right": true,
              "bottom": true,
              "left": true
            },
            "margin": {
              "top": false,
              "right": false,
              "bottom": false,
              "left": false
            }
          }
        }]
      }]
    },
    "sections": [{
      "id": "form",
      "label": "Form",
      "sub_sections": [{
        "id": "area",
        "label": "Background",
        "padding": {
          "top": "16",
          "right": "16",
          "bottom": "0",
          "left": "16"
        },
        "background": {
          "background_color": "rgba(255,255,255,1)"
        },
        "border": {
          "thickness": "none",
          "style": "solid",
          "colour": "rgba(0,0,0,1)"
        }
      }, {
        "id": "title",
        "label": "Title",
        "padding": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "margin": {
          "top": "10",
          "right": "0",
          "bottom": "10",
          "left": "0"
        },
        "typography": {
          "fontSize": "1.6",
          "fontFamily": "arial",
          "fontStyle": "bold",
          "fontColour": "rgba(76,76,76,1)"
        }
      }]
    }, {
      "id": "page",
      "label": "Page",
      "sub_sections": [{
        "id": "title",
        "label": "Title",
        "padding": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "margin": {
          "top": "10",
          "right": "0",
          "bottom": "10",
          "left": "0"
        },
        "typography": {
          "fontSize": "1.4",
          "fontFamily": "arial",
          "fontStyle": "bold",
          "fontColour": "rgba(76,76,76,1)"
        }
      }, {
        "id": "description",
        "label": "Description",
        "padding": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "margin": {
          "top": "0",
          "right": "0",
          "bottom": "10",
          "left": "0"
        },
        "typography": {
          "fontSize": "1",
          "fontFamily": "arial",
          "fontStyle": "normal",
          "fontColour": "rgba(76,76,76,1)"
        }
      }, {
        "id": "progress_steps",
        "label": "Page Area",
        "padding": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "margin": {
          "top": "0",
          "right": "0",
          "bottom": "10",
          "left": "0"
        },
        "background": {
          "background_color": "rgba(255,255,255,1)"
        },
        "border": {
          "thickness": "none",
          "style": "solid",
          "colour": "rgba(2,2,2,1)"
        }
      }, {
        "id": "progress_steps_number_container",
        "label": "Page Number Container",
        "padding": {
          "top": "5",
          "right": "0",
          "bottom": "5",
          "left": "0"
        },
        "background": {
          "background_color": "rgba(220,220,220,1)"
        },
        "border": {
          "thickness": "none",
          "style": "solid",
          "colour": "rgba(0,0,0,1)"
        },
        "typography": {
          "fontSize": "1",
          "fontFamily": "arial",
          "fontStyle": "normal",
          "fontColour": "rgba(76,76,76,1)"
        }
      }, {
        "id": "progress_steps_number_container_active",
        "label": "Page Number Container (Active)",
        "padding": {
          "top": "5",
          "right": "0",
          "bottom": "5",
          "left": "0"
        },
        "background": {
          "background_color": "rgba(76,76,76,1)"
        },
        "border": {
          "thickness": "none",
          "style": "solid",
          "colour": "rgba(1,1,1,1)"
        },
        "typography": {
          "fontSize": "1",
          "fontFamily": "arial",
          "fontStyle": "bold",
          "fontColour": "rgba(255,254,254,1)"
        }
      }]
    }, {
      "id": "section",
      "label": "Section",
      "sub_sections": [{
        "id": "area",
        "label": "Area",
        "padding": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "margin": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "background": {
          "background_color": "rgba(255,255,255,1)"
        },
        "border": {
          "thickness": "none",
          "style": "solid",
          "colour": "rgba(1,1,1,1)"
        }
      }, {
        "id": "title",
        "label": "Title",
        "padding": {
          "top": "5",
          "right": "5",
          "bottom": "5",
          "left": "5"
        },
        "margin": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "background": {
          "background_color": "rgba(220,220,220,1)"
        },
        "border": {
          "thickness": "none",
          "style": "solid",
          "colour": "rgba(1,1,1,1)"
        },
        "typography": {
          "fontSize": "1",
          "fontFamily": "arial",
          "fontStyle": "bold",
          "fontColour": "rgba(76,76,76,1)"
        }
      }, {
        "id": "description",
        "label": "Description",
        "padding": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "margin": {
          "top": "0",
          "right": "0",
          "bottom": "10",
          "left": "0"
        },
        "typography": {
          "fontSize": "1.0",
          "fontFamily": "arial",
          "fontStyle": "italic",
          "fontColour": "rgba(76,76,76,1)"
        }
      }]
    }, {
      "id": "field",
      "label": "Field",
      "sub_sections": [{
        "id": "area",
        "label": "Area",
        "padding": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "margin": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "background": {
          "background_color": "rgba(255,255,255,1)"
        },
        "border": {
          "thickness": "none",
          "style": "solid",
          "colour": "rgba(2,2,2,1)"
        }
      }, {
        "id": "title",
        "label": "Title",
        "padding": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "margin": {
          "top": "20",
          "right": "0",
          "bottom": "5",
          "left": "0"
        },
        "background": {
          "background_color": "rgba(255,255,255,1)"
        },
        "typography": {
          "fontSize": "1.0",
          "fontFamily": "arial",
          "fontStyle": "normal",
          "fontColour": "rgba(76,76,76,1)"
        }
      }, {
        "id": "instructions",
        "label": "Instructions",
        "padding": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "margin": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "background": {
          "background_color": "rgba(76,76,76,0.8)"
        },
        "border": {
          "thickness": "none",
          "style": "solid",
          "colour": "rgba(2,2,2,1)"
        },
        "typography": {
          "fontSize": "1.0",
          "fontFamily": "arial",
          "fontStyle": "bold",
          "fontColour": "rgba(255,255,255,1)"
        }
      }, {
        "id": "input",
        "label": "Input Area",
        "padding": {
          "top": "8",
          "right": "8",
          "bottom": "8",
          "left": "8"
        },
        "margin": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "background": {
          "background_color": "rgba(255,255,255,1)"
        },
        "border": {
          "thickness": "thin",
          "style": "solid",
          "colour": "rgba(204,204,204,1)"
        },
        "typography": {
          "fontSize": "1.0",
          "fontFamily": "arial",
          "fontStyle": "normal",
          "fontColour": "rgba(76,76,76,1)"
        }
      }, {
        "id": "error",
        "label": "Error Highlighting",
        "padding": {
          "top": "8",
          "right": "8",
          "bottom": "8",
          "left": "8"
        },
        "margin": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "background": {
          "background_color": "rgba(255,255,255,1)"
        },
        "border": {
          "thickness": "thin",
          "style": "solid",
          "colour": "rgba(0,0,0,1)"
        },
        "typography": {
          "fontSize": "1.0",
          "fontFamily": "arial",
          "fontStyle": "normal",
          "fontColour": "rgba(163,0,0,1)"
        }
      }, {
        "id": "numbering",
        "label": "Numbering",
        "padding": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "background": {
          "background_color": "rgba(255,0,0,1)"
        },
        "typography": {
          "fontSize": "1.0",
          "fontFamily": "arial",
          "fontStyle": "normal",
          "fontColour": "rgba(0,0,0,1)"
        }
      }, {
        "id": "required",
        "label": "Required Symbol (*)",
        "typography": {
          "fontSize": "1.0",
          "fontFamily": "arial",
          "fontStyle": "normal",
          "fontColour": "rgba(204,0,0,1)"
        }
      }]
    }, {
      "id": "button",
      "label": "Buttons",
      "sub_sections": [{
        "id": "bar",
        "label": "Button Bar",
        "padding": {
          "top": "0",
          "right": "0",
          "bottom": "0",
          "left": "0"
        },
        "margin": {
          "top": "20",
          "right": "0",
          "bottom": "20",
          "left": "0"
        },
        "background": {
          "background_color": "rgba(255,255,255,1)"
        },
        "border": {
          "thickness": "none",
          "style": "dashed",
          "colour": "rgba(2,2,2,0.5)"
        }
      }, {
        "id": "default",
        "label": "Default",
        "padding": {
          "top": "8",
          "right": "8",
          "bottom": "8",
          "left": "8"
        },
        "background": {
          "background_color": "rgba(220,220,220,1)"
        },
        "border": {
          "thickness": "none",
          "style": "solid",
          "colour": "rgba(76,76,76,0.5)"
        },
        "typography": {
          "fontSize": "1",
          "fontFamily": "arial",
          "fontStyle": "bold",
          "fontColour": "rgba(76,76,76,1)"
        }
      }, {
        "id": "default_active",
        "label": "Default (Active)",
        "padding": {
          "top": "8",
          "right": "8",
          "bottom": "8",
          "left": "8"
        },
        "background": {
          "background_color": "rgba(76,76,76,1)"
        },
        "border": {
          "thickness": "none",
          "style": "solid",
          "colour": "rgba(2,2,2,1)"
        },
        "typography": {
          "fontSize": "1",
          "fontFamily": "arial",
          "fontStyle": "normal",
          "fontColour": "rgba(255,255,255,1)"
        }
      }, {
        "id": "action",
        "label": "Action",
        "padding": {
          "top": "8",
          "right": "8",
          "bottom": "8",
          "left": "8"
        },
        "background": {
          "background_color": "rgba(0,139,171,1)"
        },
        "border": {
          "thickness": "none",
          "style": "solid",
          "colour": "rgba(0,0,0,1)"
        },
        "typography": {
          "fontSize": "1",
          "fontFamily": "arial",
          "fontStyle": "bold",
          "fontColour": "rgba(255,254,254,1)"
        }
      }, {
        "id": "action_active",
        "label": "Action (Active)",
        "padding": {
          "top": "8",
          "right": "8",
          "bottom": "8",
          "left": "8"
        },
        "background": {
          "background_color": "rgba(0,0,0,1)"
        },
        "border": {
          "thickness": "none",
          "style": "solid",
          "colour": "rgba(0,0,0,1)"
        },
        "typography": {
          "fontSize": "1",
          "fontFamily": "arial",
          "fontStyle": "normal",
          "fontColour": "rgba(255,255,255,1)"
        }
      }, {
        "id": "cancel",
        "label": "Cancel",
        "padding": {
          "top": "8",
          "right": "8",
          "bottom": "8",
          "left": "8"
        },
        "background": {
          "background_color": "rgba(204,0,0,1)"
        },
        "border": {
          "thickness": "none",
          "style": "solid",
          "colour": "rgba(2,2,2,1)"
        },
        "typography": {
          "fontSize": "1",
          "fontFamily": "arial",
          "fontStyle": "normal",
          "fontColour": "rgba(0,0,0,1)"
        }
      }, {
        "id": "cancel_active",
        "label": "Cancel (Active)",
        "padding": {
          "top": "8",
          "right": "8",
          "bottom": "8",
          "left": "8"
        },
        "background": {
          "background_color": "rgba(163,0,0,1)"
        },
        "border": {
          "thickness": "none",
          "style": "solid",
          "colour": "rgba(2,2,2,1)"
        },
        "typography": {
          "fontSize": "1",
          "fontFamily": "arial",
          "fontStyle": "bold",
          "fontColour": "rgba(255,255,255,1)"
        }
      }]
    }],
    "logo": {
      "base64String": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMjE3LjEyOHB4IiBoZWlnaHQ9IjY5LjcxMXB4IiB2aWV3Qm94PSItNDguNTIyIDI1LjE0NSAyMTcuMTI4IDY5LjcxMSINCgkgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAtNDguNTIyIDI1LjE0NSAyMTcuMTI4IDY5LjcxMSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8Zz4NCgkJPHBhdGggZD0iTTIwLjgzOCw3Ny4wODRoMC4zMTRsMC40NzQsMC43NzdoMC4zMDZsLTAuNTEzLTAuNzkyYzAuMjY3LTAuMDMxLDAuNDY4LTAuMTcxLDAuNDY4LTAuNDkyDQoJCQljMC0wLjM1Ny0wLjIxLTAuNTExLTAuNjM1LTAuNTExaC0wLjY4NnYxLjc5NWgwLjI3MVY3Ny4wODR6IE0yMC44MzgsNzYuODU1di0wLjU2aDAuMzczYzAuMTksMCwwLjM5MywwLjA0MywwLjM5MywwLjI2Nw0KCQkJYzAsMC4yNzUtMC4yMDYsMC4yOTYtMC40MzgsMC4yOTZoLTAuMzI4Vjc2Ljg1NXoiLz4NCgkJPHBhdGggZD0iTTIyLjkyMSw3Ni45NjhjMCwwLjk2OS0wLjc5LDEuNzU4LTEuNzYxLDEuNzU4Yy0wLjk3MywwLTEuNzYzLTAuNzg5LTEuNzYzLTEuNzU4YzAtMC45NzQsMC43OS0xLjc2MywxLjc2My0xLjc2Mw0KCQkJQzIyLjEzNCw3NS4yMDUsMjIuOTIxLDc1Ljk5NCwyMi45MjEsNzYuOTY4eiBNMjEuMTYsNzUuNTE5Yy0wLjgwMiwwLTEuNDUsMC42NDYtMS40NSwxLjQ0OWMwLDAuODAxLDAuNjQ4LDEuNDQ0LDEuNDUsMS40NDQNCgkJCWMwLjgsMCwxLjQ0OC0wLjY0NCwxLjQ0OC0xLjQ0NEMyMi42MDgsNzYuMTY1LDIxLjk2LDc1LjUxOSwyMS4xNiw3NS41MTl6Ii8+DQoJCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xMS4zODcsNzguNDQxYy0yLjQ2NSwwLTQuNzA5LDAuNDI5LTYuMzYzLDEuMTE5Yy0wLjE4MywwLjA5LTAuMzEyLDAuMjc4LTAuMzEyLDAuNDk4DQoJCQljMCwwLjA3NiwwLjAxOSwwLjE1NywwLjA1MSwwLjIyN2MwLjE5NiwwLjU2OC0wLjEyNiwxLjE4NC0xLjcyOCwxLjUzNGMtMi4zNzQsMC41MTktMy44NzMsMi45NzItNC43MzEsMy43ODQNCgkJCWMtMS4wMDYsMC45NTYtMy44NTEsMS41NDUtMy40MjMsMC45NzRjMC4zMzUtMC40NDMsMS42MTUtMS44MzIsMi4zOTQtMy4zMzdjMC42OTYtMS4zNDMsMS4zMTYtMS43MjYsMi4xNy0zLjAwNw0KCQkJYzAuMjUtMC4zNzcsMS4yMjItMS42OTYsMS41MDUtMi43NGMwLjMxNy0xLjAxOCwwLjIxLTIuMywwLjMzMS0yLjgyNGMwLjE3NC0wLjc2MywwLjg5My0yLjQwOSwwLjk0NS0zLjMzOA0KCQkJYzAuMDMtMC41MjctMi4xOTgsMC43NDgtMy4yNTUsMC43NDhjLTEuMDU4LDAtMi4wODgtMC42MzItMy4wMzMtMC42NzhjLTEuMTctMC4wNTMtMS45MjEsMC45MDQtMi45ODEsMC43MzYNCgkJCWMtMC42MDMtMC4wOTktMS4xMTMtMC42MjktMi4xNjctMC42NjdjLTEuNTAzLTAuMDU1LTMuMzQsMC44MzUtNi43OTIsMC43MjVjLTMuMzk0LTAuMTEzLTYuNTI4LTQuMjkxLTYuOTU4LTQuOTU4DQoJCQljLTAuNS0wLjc3Ny0xLjExMy0wLjc3Ny0xLjc4LTAuMTY1Yy0wLjY2OCwwLjYxMS0xLjQ5MiwwLjEzLTEuNzI2LTAuMjgxYy0wLjQ0Ni0wLjc3Ny0xLjYzNy0zLjA1NC0zLjQ4LTMuNTMyDQoJCQljLTIuNTUtMC42NjEtMy44MzksMS40MTItMy42NzIsMy4wNmMwLjE2OSwxLjY3MywxLjI1MSwyLjE0MywxLjc1MSwzLjAzMmMwLjUsMC44OTEsMC43NTgsMS40NjUsMS43MDEsMS44NTkNCgkJCWMwLjY2OCwwLjI3OCwwLjkxNywwLjY4OSwwLjcxOSwxLjIzOGMtMC4xNzUsMC40NzgtMC44NywwLjU4NS0xLjMyNywwLjYwOGMtMC45NzMsMC4wNDctMS42NTMtMC4yMTgtMi4xNS0wLjUzMw0KCQkJYy0wLjU3Ny0wLjM3MS0xLjA0Ny0wLjg4Mi0xLjU1MS0xLjc0OWMtMC41ODMtMC45NTktMS41MDItMS4zNzQtMi41Ny0xLjM3NGMtMC41MSwwLTAuOTg5LDAuMTM0LTEuNDEyLDAuMzUxDQoJCQljLTEuNjc4LDAuODczLTMuNjc0LDEuMzg5LTUuODIyLDEuMzg5bC0yLjQyNiwwLjAwNmM0LjY1MiwxMy43ODUsMTcuNjg2LDIzLjcxLDMzLjA0MiwyMy43MWMxMi4yNjUsMCwyMy4wNDgtNi4zMzYsMjkuMjYyLTE1LjkxDQoJCQlDMTQuMjUzLDc4LjYzOSwxMi44Myw3OC40NDEsMTEuMzg3LDc4LjQ0MXoiLz4NCgkJPHBhdGggZD0iTS02LjA2Miw3NS43MjJjLTAuMDMsMC0wLjA2LDAuMDE3LTAuMDgxLDAuMDM3Yy0wLjQ1MSwwLjUyNS0wLjY0NiwwLjY5Ni0wLjk3MSwwLjk2Yy0wLjc4OCwwLjYzMi0xLjY4NS0wLjA4MS0yLjI2LTAuNDIzDQoJCQljLTEuMjgtMC43NDgtMi4zMS0wLjI3Ni0yLjU2MSwwLjMwNGMtMC4yNDksMC41ODksMC4wMjgsMS4yOTEsMC43MjUsMS4xOThjMC45NzYtMC4xMjgsMS4wMTgsMC4wMjIsMS43MjUsMC40NzMNCgkJCWMxLjMxNSwwLjgzMiwyLjI3MywwLjM4LDIuNzYzLTAuMDE1YzAuNDA5LTAuMzI1LDAuNjM1LTAuNjA0LDAuODQ4LTAuOTk4YzAuMzc3LTAuNzQ4LDAuMDctMS4zMzYtMC4xMS0xLjUxMQ0KCQkJQy02LjAwNyw3NS43MzYtNi4wMzUsNzUuNzIyLTYuMDYyLDc1LjcyMnoiLz4NCgkJPHBhdGggZD0iTS0xMy42NjQsMjUuMTQ1Yy0xOS4yNTEsMC0zNC44NTgsMTUuNjA1LTM0Ljg1OCwzNC44NTVjMCwzLjg5NywwLjYzOSw3LjY0NCwxLjgxOSwxMS4xNGgyLjQyNA0KCQkJYzIuMTQ4LDAsNC4xNDYtMC41MTYsNS44MjItMS4zODljMC40MjUtMC4yMTcsMC45MDMtMC4zNTEsMS40MTItMC4zNTFjMS4wNywwLDEuOTg5LDAuNDE1LDIuNTcyLDEuMzc0DQoJCQljMC41MDMsMC44NywwLjk3MywxLjM4MSwxLjU1MSwxLjc0NmMwLjQ5NCwwLjMxOCwxLjE3NywwLjU4LDIuMTQ4LDAuNTM2YzAuNDU3LTAuMDIxLDEuMTUzLTAuMTMxLDEuMzI3LTAuNjA4DQoJCQljMC4yLTAuNTQ5LTAuMDUxLTAuOTYzLTAuNzE5LTEuMjM4Yy0wLjk0Mi0wLjM5NS0xLjE5Ny0wLjk3Mi0xLjY5OS0xLjg2MmMtMC41MDEtMC44OS0xLjU4NC0xLjM1OS0xLjc1Mi0zLjAzMg0KCQkJYy0wLjE2OC0xLjY0NywxLjEyNC0zLjcyNCwzLjY3NC0zLjA2MmMxLjg0MiwwLjQ3OSwzLjAzNCwyLjc1NSwzLjQ3OSwzLjUzOGMwLjIzNSwwLjQwOCwxLjA1NywwLjg4NywxLjcyNiwwLjI3OA0KCQkJYzAuNjY2LTAuNjE1LDEuMjgtMC42MTUsMS43ODIsMC4xNjhjMC40MjgsMC42NjEsMy41NjIsNC44NDIsNi45NTgsNC45NTJjMy40NSwwLjExLDUuMjg3LTAuNzc5LDYuNzkxLTAuNzI1DQoJCQljMS4wNTYsMC4wNDEsMS41NjQsMC41NzEsMi4xNjksMC42NjdjMS4wNTgsMC4xNjgsMS44MTEtMC43ODksMi45NzktMC43M2MwLjk0NSwwLjA0NiwxLjk3NiwwLjY3NSwzLjAzMywwLjY3NQ0KCQkJYzEuMDU3LDAsMy4yODctMS4yNzUsMy4yNTUtMC43NDhjLTAuMDU0LDAuOTMyLTAuNzcsMi41NzgtMC45NDUsMy4zMzhjLTAuMTIyLDAuNTI3LTAuMDE1LDEuODA3LTAuMzMxLDIuODI3DQoJCQljLTAuMjgzLDEuMDQ0LTEuMjU0LDIuMzYzLTEuNTA1LDIuNzQzYy0wLjg1NCwxLjI3OC0xLjQ3MywxLjY2MS0yLjE3LDMuMDA0Yy0wLjc3OCwxLjUwNS0yLjA1OSwyLjg5NC0yLjM5NCwzLjMzNw0KCQkJYy0wLjQyOCwwLjU3MSwyLjQxNy0wLjAxOCwzLjQyNC0wLjk3NGMwLjg1Ny0wLjgxMiwyLjM1Ni0zLjI2LDQuNzMtMy43ODRjMS42MDEtMC4zNTEsMS45MjMtMC45NjYsMS43MjctMS41MzQNCgkJCWMtMC4wMjktMC4wNjMtMC4wNTEtMC4xNDUtMC4wNTEtMC4yMjdjMC0wLjIxNywwLjEzLTAuNDA1LDAuMzEyLTAuNDk4YzEuNjU0LTAuNjksMy44OTgtMS4xMTYsNi4zNjMtMS4xMTYNCgkJCWMxLjQ0MSwwLDIuODY2LDAuMTkxLDQuMjEsMC41MDFDMTkuMTM2LDczLjQ4OCwyMS4xOSw2Ni45ODgsMjEuMTksNjBDMjEuMTksNDAuNzUsNS41ODUsMjUuMTQ1LTEzLjY2NCwyNS4xNDV6Ii8+DQoJCTxwYXRoIGZpbGw9IiNDQzAwMDAiIGQ9Ik02LjAwNCw1MC43MjdjLTAuMzQ1LDEuMTU3LTAuODM1LDIuNjM5LTMuMDE0LDMuNzU2Yy0wLjMxNywwLjE2My0wLjQzOS0wLjEwNC0wLjI5MS0wLjM1NQ0KCQkJYzAuODIyLTEuMzk5LDAuOTctMS43NSwxLjIxLTIuMzA0YzAuMzM1LTAuODA4LDAuNTEtMS45NTgtMC4xNTUtNC4zNTVDMi40NDIsNDIuNzUyLTAuMjkxLDM2LjQ0Ny0yLjI4LDM0LjQwMQ0KCQkJYy0xLjkxNy0xLjk3My01LjM5NC0yLjUzLTguNTM3LTEuNzI0Yy0xLjE1NywwLjI5NS0zLjQyMSwxLjQ3My03LjYxNywwLjUyOWMtNy4yNjctMS42MzctOC4zNDIsMi4wMDItOC43NTgsMy41ODUNCgkJCWMtMC40MTksMS41ODYtMS40MTksNi4wOS0xLjQxOSw2LjA5Yy0wLjMzMywxLjgzNS0wLjc3MSw1LjAyNSwxMC41MTEsNy4xNzRjNS4yNTYsMS4wMDEsNS41MjIsMi4zNTgsNS43NTQsMy4zMzcNCgkJCWMwLjQxOSwxLjc1LDEuMDg0LDIuNzUzLDEuODM1LDMuMjUzYzAuNzUyLDAuNTAyLDAsMC45MTUtMC44MzIsMWMtMi4yMzksMC4yMzItMTAuNTExLTIuMTQtMTUuNDA0LTQuOTINCgkJCWMtNC4wMDQtMi40NDctNC4wNzEtNC42NDktMy4xNTQtNi41MmMtNi4wNDctMC42NTQtMTAuNTg4LDAuNTY3LTExLjQxLDMuNDNjLTEuNDExLDQuOTEyLDEwLjgwNCwxMy4zMDYsMjQuNzEyLDE3LjUxOQ0KCQkJYzE0LjU5Nyw0LjQxOSwyOS42MTIsMS4zMzQsMzEuMjgxLTcuODQzQzE1LjQzNyw1NS4xNDYsMTEuOTI1LDUyLjA2Miw2LjAwNCw1MC43Mjd6IE0tMTYuMzc3LDQxLjc0Mg0KCQkJYy00LjAyNiwwLjI5LTQuNDQ0LDAuNzI2LTUuMTk4LDEuNTI5Yy0xLjA2MiwxLjEzNC0yLjQ2NC0xLjQ2OS0yLjQ2NC0xLjQ2OWMtMC44NDEtMC4xNzctMS44NTktMS41MzItMS4zMTEtMi43OTgNCgkJCWMwLjU0Mi0xLjI1MSwxLjU0MS0wLjg3OCwxLjg1NC0wLjQ4N2MwLjM4MywwLjQ3NiwxLjE5NiwxLjI1MSwyLjI1MywxLjIyNGMxLjA1Ny0wLjAyNiwyLjI3NS0wLjI0OSwzLjk3Ni0wLjI0OQ0KCQkJYzEuNzI0LDAsMi44OCwwLjY0NCwyLjk0NywxLjE5N0MtMTQuMjYyLDQxLjE1OS0xNC40NTksNDEuNjAzLTE2LjM3Nyw0MS43NDJ6IE0tNy42NjksMzcuNzMzDQoJCQljLTAuNzIyLTAuMDE4LTEuNDAyLTAuMTIyLTEuOTg3LTAuMjljLTAuMDctMC4wMTctMC4xMTgtMC4wNzctMC4xMTgtMC4xNDhjMC0wLjA2OSwwLjA1MS0wLjEyOSwwLjEyMS0wLjE0Ng0KCQkJYzEuMzkzLTAuMzIzLDIuMzM1LTAuODQ5LDIuMjY3LTEuMzQ4Yy0wLjA4Ny0wLjY2LTEuOTEyLTEuMDIxLTQuMDcyLTAuODAzYy0wLjIzNiwwLjAyNS0wLjQ2NywwLjA1NC0wLjY5MSwwLjA5DQoJCQljLTAuMDA2LDAtMC4wMTIsMC4wMDEtMC4wMTgsMC4wMDFjLTAuMDYyLDAtMC4xMTItMC4wNDktMC4xMTItMC4xMDdjMC0wLjA0MiwwLjAyNS0wLjA3OSwwLjA2NC0wLjA5Ng0KCQkJYzAuNzgtMC40MTQsMS45NDQtMC43NDEsMy4yNzgtMC44NzZjMC40LTAuMDQxLDAuNzkxLTAuMDYyLDEuMTY3LTAuMDYzYzAuMDY2LDAsMC4xMzIsMCwwLjIsMA0KCQkJYzIuMjM0LDAuMDUxLDQuMDIyLDAuOTM5LDMuOTk3LDEuOTgxQy0zLjYwMSwzNi45NzgtNS40MzMsMzcuNzg0LTcuNjY5LDM3LjczM3oiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0zOC45NTgsNjIuMTk4YzAtMy4xOTYtMC4wNjUtNS41NDYtMC4xOTYtNy42NzJoNS4yMjhsMC4yMjUsNC41MzVoMC4xNzFjMS4xNzQtMy4zNiwzLjk1OS01LjA3Niw2LjUzNy01LjA3Ng0KCQkJYzAuNTksMCwwLjkzNCwwLjAyMiwxLjQxNSwwLjEzdjUuNjg4Yy0wLjU2NS0wLjExLTEuMDkyLTAuMTcyLTEuODE4LTAuMTcyYy0yLjg3OCwwLTQuODc1LDEuODMtNS40MTIsNC41NjgNCgkJCWMtMC4xMDMsMC41MzQtMC4xNTcsMS4xNzItMC4xNTcsMS44MjF2MTIuMzg0SDM4LjkxTDM4Ljk1OCw2Mi4xOTh6Ii8+DQoJCTxwYXRoIGQ9Ik01OS42MjgsNjguMDljMC4xNTgsNC4zMjksMy41MDcsNi4yMiw3LjM3NSw2LjIyYzIuNzc4LDAsNC43NjUtMC40MzYsNi41OTEtMS4xMDVsMC44OTEsNC4xNTINCgkJCWMtMi4wNDEsMC44Ny00Ljg3NywxLjUxNC04LjM0MiwxLjUxNGMtNy43NTUsMC0xMi4yOTYtNC43ODctMTIuMjk2LTEyLjEwM2MwLTYuNTkxLDMuOTk5LTEyLjgyNiwxMS42NzgtMTIuODI2DQoJCQljNy43NjUsMCwxMC4yOTQsNi4zODYsMTAuMjk0LDExLjYxNGMwLDEuMTE5LTAuMTAyLDIuMDIzLTAuMjE1LDIuNThMNTkuNjI4LDY4LjA5eiBNNzAuMTI5LDYzLjg4Ng0KCQkJYzAuMDI5LTIuMjE2LTAuOTM0LTUuODItNC45NzktNS44MmMtMy43MTcsMC01LjI2MywzLjM3MS01LjUzNCw1LjgySDcwLjEyOXoiLz4NCgkJPHBhdGggZD0iTTE0Ny4zMSw3Mi43MjljMCwxLjg5LDAuMDc1LDMuODQ1LDAuMzQ4LDUuNjc3aC0yLjE3NWwtMC4zNDgtMy40MjdoLTAuMTFjLTEuMTYsMS44NDQtMy44MjEsMy45NjYtNy42MiwzLjk2Ng0KCQkJYy00LjgwOCwwLTcuMDQ2LTMuMzgxLTcuMDQ2LTYuNTY0YzAtNS41MTgsNC44NjgtOC44NDEsMTQuNTkxLTguNzM5di0wLjYzOGMwLTIuMzY0LTAuNDU4LTcuMDgxLTYuMTEyLTcuMDQzDQoJCQljLTIuMDk0LDAtNC4yNzQsMC41Ni02LjAwMiwxLjc4MmwtMC43NTQtMS43MjFjMi4xODQtMS40NzksNC44NTQtMi4wNjMsNy4wMTQtMi4wNjNjNi44OTgsMCw4LjIxNSw1LjE3Nyw4LjIxNSw5LjQ0NVY3Mi43Mjl6DQoJCQkgTTE0NC45NDksNjUuNjMxYy01LjIwOC0wLjE1LTEyLjA3NywwLjYzOC0xMi4wNzcsNi4zNzZjMCwzLjQzNywyLjI2OCw0Ljk3OSw0Ljc1Niw0Ljk3OWMzLjk4MywwLDYuMjQ4LTIuNDY1LDcuMDcxLTQuNzkNCgkJCWMwLjE3NS0wLjUxLDAuMjUtMS4wMjYsMC4yNS0xLjQzM1Y2NS42MzFMMTQ0Ljk0OSw2NS42MzF6Ii8+DQoJCTxwYXRoIGQ9Ik0xNTYuNzIxLDQ5LjIzN3Y1LjI2N2g2LjgxNHYxLjkxOGgtNi44MTR2MTUuNTMzYzAsMy4wMzgsMC45NDUsNC45NDMsMy41MTUsNC45NDNjMS4yMjksMCwyLjEtMC4xNjIsMi43MTQtMC4zNzQNCgkJCWwwLjI4NCwxLjgzYy0wLjc3MSwwLjMyNC0xLjg1MywwLjU3NC0zLjI5NywwLjU3NGMtMS43NDIsMC0zLjE5Mi0wLjU0OS00LjEyMy0xLjY5M2MtMS4wODEtMS4yNTMtMS40NTItMy4yNi0xLjQ1Mi01LjY5OFY1Ni40MjMNCgkJCWgtNC4wMzN2LTEuOTE3aDQuMDMzdi00LjM5NUwxNTYuNzIxLDQ5LjIzN3oiLz4NCgkJPHBhdGggZD0iTTE2Ni41MjEsNzcuMTM0aDAuMzEzbDAuNDc2LDAuNzc5aDAuMzA1bC0wLjUxNC0wLjc5NGMwLjI2Ny0wLjAzNSwwLjQ3LTAuMTc0LDAuNDctMC40OTMNCgkJCWMwLTAuMzU5LTAuMjE1LTAuNTExLTAuNjM1LTAuNTExaC0wLjY4OHYxLjc5OGgwLjI3MlY3Ny4xMzRMMTY2LjUyMSw3Ny4xMzR6IE0xNjYuNTIxLDc2LjkwMXYtMC41NmgwLjM3MQ0KCQkJYzAuMTg2LDAsMC4zOTIsMC4wNDQsMC4zOTIsMC4yNjRjMCwwLjI3OC0wLjIwNiwwLjI5Ni0wLjQzOCwwLjI5NkgxNjYuNTIxeiIvPg0KCQk8cGF0aCBkPSJNMTY4LjYwNiw3Ny4wMTVjMCwwLjk2OS0wLjc5MiwxLjc1Ny0xLjc2LDEuNzU3Yy0wLjk3MiwwLTEuNzYzLTAuNzg4LTEuNzYzLTEuNzU3YzAtMC45NzUsMC43OTEtMS43NjMsMS43NjMtMS43NjMNCgkJCUMxNjcuODE0LDc1LjI1MiwxNjguNjA2LDc2LjA0LDE2OC42MDYsNzcuMDE1eiBNMTY2Ljg0Nyw3NS41NjRjLTAuODA3LDAtMS40NTMsMC42NDYtMS40NTMsMS40NWMwLDAuOCwwLjY0NiwxLjQ0NCwxLjQ1MywxLjQ0NA0KCQkJYzAuNzk3LDAsMS40NDYtMC42NDUsMS40NDYtMS40NDRDMTY4LjI5Myw3Ni4yMTEsMTY3LjY0MSw3NS41NjQsMTY2Ljg0Nyw3NS41NjR6Ii8+DQoJCTxwYXRoIGQ9Ik05NS43OTYsNTcuMDk1aC0wLjA5OWMtMS4wNjctMS43NjMtMy40MjItMy4xMS02LjY5Mi0zLjExYy01Ljc0MSwwLTEwLjc0Miw0Ljc1Mi0xMC43MDUsMTIuNzUzDQoJCQljMCw3LjM0Miw0LjUxNSwxMi4yMDEsMTAuMjE4LDEyLjIwMWMzLjQ0NSwwLDYuMzI3LTEuNjQxLDcuNzU0LTQuMzE0aDAuMTA0bDAuMjcyLDMuNzgxaDUuMzc5Yy0wLjExLTEuNjI0LTAuMi00LjI1NC0wLjItNi42OTgNCgkJCVY0NS4zNmwtNi4wMzQtMS43MzJ2MTMuNDY3SDk1Ljc5NnogTTk1Ljc5Niw2OC4wNTJjMCwwLjYzMy0wLjA0NCwxLjIyMS0wLjE4LDEuNzYxYy0wLjYwOSwyLjYxNS0yLjc0Niw0LjI5Ny01LjIxNyw0LjI5Nw0KCQkJYy0zLjgwMSwwLTUuOTc2LTMuMjA0LTUuOTc2LTcuNTkxYzAtNC40MzEsMi4xNTctNy44NjEsNi4wNDMtNy44NjFjMi43MTQsMCw0LjY1OSwxLjkxNCw1LjE5NSw0LjIzOQ0KCQkJYzAuMTAyLDAuNDksMC4xMzQsMS4wOTQsMC4xMzQsMS41NzRWNjguMDUyeiIvPg0KCQk8cGF0aCBkPSJNMTE3Ljc5OCw1My45NTljLTEuODE4LDAtMy40NDUsMC41MjQtNC44MTYsMS4zNjhjLTEuNDIxLDAuODMzLTIuNTc4LDIuMTE3LTMuMjY1LDMuNDQ2aC0wLjA5NlY0Ny41OTlsLTIuMzYzLTAuNjc5DQoJCQl2MzEuNDg2aDIuMzYzVjYzLjc5YzAtMC45NzIsMC4wNzUtMS42NDUsMC4zMjQtMi4zNTRjMS4wMTktMi45NzQsMy44MjItNS40MTIsNy4yMDktNS40MTJjNC44OTIsMCw2LjU4NSwzLjkyMyw2LjU4NSw4LjIyOA0KCQkJdjE0LjE1NWgyLjM2MlY2My45OUMxMjYuMDk5LDU1LjA4NywxMjAuMDYsNTMuOTU5LDExNy43OTgsNTMuOTU5eiIvPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K",
      "height": 70,
      "width": 218
    },
    "css": ".fh_appform_form_area{background-color:rgba(255,255,255,1);border:none;margin:0px 0px 0px 0px;padding:16px 16px 0px 16px;}#fh_appform_container .fh_appform_form_title{font-size:1.6em;font-family:arial;color:rgba(76,76,76,1);font-weight:bold;font-style:normal;margin:10px 0px 10px 0px;padding:0px 0px 0px 0px;line-height:1em;}#fh_appform_container .fh_appform_page_title{font-size:1.4em;font-family:arial;color:rgba(76,76,76,1);font-weight:bold;font-style:normal;margin:10px 0px 10px 0px;padding:0px 0px 0px 0px;}#fh_appform_container .fh_appform_page_description{font-size:1em;font-family:arial;color:rgba(76,76,76,1);font-weight:normal;font-style:normal;margin:0px 0px 10px 0px;padding:0px 0px 0px 0px;}#fh_appform_container .fh_appform_progress_steps{background-color:rgba(255,255,255,1);border:none;margin:0px 0px 10px 0px;padding:0px 0px 0px 0px;}#fh_appform_container .fh_appform_progress_steps .number_container{font-size:1em;font-family:arial;color:rgba(76,76,76,1);font-weight:normal;font-style:normal;background-color:rgba(220,220,220,1);border:none;margin:0px 0px 0px 0px;padding:5px 0px 5px 0px;border-radius:0px;}#fh_appform_container .fh_appform_progress_steps li.active .number_container{font-size:1em;font-family:arial;color:rgba(255,254,254,1);font-weight:bold;font-style:normal;background-color:rgba(76,76,76,1);border:none;margin:0px 0px 0px 0px;padding:5px 0px 5px 0px;}#fh_appform_container .fh_appform_section_area{background-color:rgba(255,255,255,1);border:none;margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;border-radius:0px;}#fh_appform_container .fh_appform_section_title{font-size:1em;font-family:arial;color:rgba(76,76,76,1);font-weight:bold;font-style:normal;background-color:rgba(220,220,220,1);border:none;margin:0px 0px 0px 0px;padding:5px 5px 5px 5px;line-height:1em;}#fh_appform_container .fh_appform_section_description{font-size:1.0em;font-family:arial;color:rgba(76,76,76,1);font-style:italic;font-weight:normal;margin:0px 0px 10px 0px;padding:0px 0px 0px 0px;}#fh_appform_container .fh_appform_field_area{background-color:rgba(255,255,255,1);border:none;margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;border-radius:0px;}#fh_appform_container .fh_appform_field_title{font-size:1.0em;font-family:arial;color:rgba(76,76,76,1);font-weight:normal;font-style:normal;background-color:rgba(255,255,255,1);margin:20px 0px 5px 0px;padding:0px 0px 0px 0px;border-radius:0px;}#fh_appform_container .fh_appform_field_instructions{font-size:1.0em;font-family:arial;color:rgba(255,255,255,1);font-weight:bold;font-style:normal;background-color:rgba(76,76,76,0.8);border:none;margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;border-radius:0px;}#fh_appform_container .fh_appform_field_input{font-size:1.0em;font-family:arial;color:rgba(76,76,76,1);font-weight:normal;font-style:normal;background-color:rgba(255,255,255,1);border-width:thin;border-style:solid;border-color:rgba(204,204,204,1);margin:0px 0px 0px 0px;padding:8px 8px 8px 8px;border-radius:0px;}#fh_appform_container .fh_appform_field_error{font-size:1.0em;font-family:arial;color:rgba(163,0,0,1);font-weight:normal;font-style:normal;background-color:rgba(255,255,255,1);border-width:thin;border-style:solid;border-color:rgba(0,0,0,1);margin:0px 0px 0px 0px;padding:8px 8px 8px 8px;border-radius:0px;height:100%;}#fh_appform_container .fh_appform_field_numbering{font-size:1.0em;font-family:arial;color:rgba(0,0,0,1);font-weight:normal;font-style:normal;background-color:rgba(255,0,0,1);margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;}#fh_appform_container .fh_appform_field_required:after{font-size:1.0em;font-family:arial;color:rgba(204,0,0,1);font-weight:normal;font-style:normal;margin:0px 0px 0px 0px;padding:0px 0px 0px 0px;content:\"*\";vertical-align:top;}#fh_appform_container .fh_appform_button_bar{background-color:rgba(255,255,255,1);border:none;margin:20px 0px 20px 0px;padding:0px 0px 0px 0px;border-spacing:5px 0px;}#fh_appform_container .fh_appform_button_default{font-size:1em;font-family:arial;color:rgba(76,76,76,1);font-weight:bold;font-style:normal;background-color:rgba(220,220,220,1);border:none;margin:0px 0px 0px 0px;padding:8px 8px 8px 8px;border-radius:0px;white-space:normal;}#fh_appform_container .fh_appform_button_default:active, #fh_appform_container .button_default.active{font-size:1em;font-family:arial;color:rgba(255,255,255,1);font-weight:normal;font-style:normal;background-color:rgba(76,76,76,1);border:none;margin:0px 0px 0px 0px;padding:8px 8px 8px 8px;border-radius:0px;white-space:normal;}#fh_appform_container .fh_appform_button_action{font-size:1em;font-family:arial;color:rgba(255,254,254,1);font-weight:bold;font-style:normal;background-color:rgba(0,139,171,1);border:none;margin:0px 0px 0px 0px;padding:8px 8px 8px 8px;border-radius:0px;white-space:normal;}#fh_appform_container .fh_appform_button_action:active ,#fh_appform_container .fh_appform_button_action.active{font-size:1em;font-family:arial;color:rgba(255,255,255,1);font-weight:normal;font-style:normal;background-color:rgba(0,0,0,1);border:none;margin:0px 0px 0px 0px;padding:8px 8px 8px 8px;border-radius:0px;white-space:normal;}#fh_appform_container .fh_appform_button_cancel{font-size:1em;font-family:arial;color:rgba(0,0,0,1);font-weight:normal;font-style:normal;background-color:rgba(204,0,0,1);border:none;margin:0px 0px 0px 0px;padding:8px 8px 8px 8px;border-radius:0px;white-space:normal;}#fh_appform_container .fh_appform_button_cancel:active, #fh_appform_container .button_cancel.active{font-size:1em;font-family:arial;color:rgba(255,255,255,1);font-weight:bold;font-style:normal;background-color:rgba(163,0,0,1);border:none;margin:0px 0px 0px 0px;padding:8px 8px 8px 8px;border-radius:0px;white-space:normal;}#fh_appform_container .fh_appform_logo{background-image:url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMjE3LjEyOHB4IiBoZWlnaHQ9IjY5LjcxMXB4IiB2aWV3Qm94PSItNDguNTIyIDI1LjE0NSAyMTcuMTI4IDY5LjcxMSINCgkgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAtNDguNTIyIDI1LjE0NSAyMTcuMTI4IDY5LjcxMSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8Zz4NCgkJPHBhdGggZD0iTTIwLjgzOCw3Ny4wODRoMC4zMTRsMC40NzQsMC43NzdoMC4zMDZsLTAuNTEzLTAuNzkyYzAuMjY3LTAuMDMxLDAuNDY4LTAuMTcxLDAuNDY4LTAuNDkyDQoJCQljMC0wLjM1Ny0wLjIxLTAuNTExLTAuNjM1LTAuNTExaC0wLjY4NnYxLjc5NWgwLjI3MVY3Ny4wODR6IE0yMC44MzgsNzYuODU1di0wLjU2aDAuMzczYzAuMTksMCwwLjM5MywwLjA0MywwLjM5MywwLjI2Nw0KCQkJYzAsMC4yNzUtMC4yMDYsMC4yOTYtMC40MzgsMC4yOTZoLTAuMzI4Vjc2Ljg1NXoiLz4NCgkJPHBhdGggZD0iTTIyLjkyMSw3Ni45NjhjMCwwLjk2OS0wLjc5LDEuNzU4LTEuNzYxLDEuNzU4Yy0wLjk3MywwLTEuNzYzLTAuNzg5LTEuNzYzLTEuNzU4YzAtMC45NzQsMC43OS0xLjc2MywxLjc2My0xLjc2Mw0KCQkJQzIyLjEzNCw3NS4yMDUsMjIuOTIxLDc1Ljk5NCwyMi45MjEsNzYuOTY4eiBNMjEuMTYsNzUuNTE5Yy0wLjgwMiwwLTEuNDUsMC42NDYtMS40NSwxLjQ0OWMwLDAuODAxLDAuNjQ4LDEuNDQ0LDEuNDUsMS40NDQNCgkJCWMwLjgsMCwxLjQ0OC0wLjY0NCwxLjQ0OC0xLjQ0NEMyMi42MDgsNzYuMTY1LDIxLjk2LDc1LjUxOSwyMS4xNiw3NS41MTl6Ii8+DQoJCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xMS4zODcsNzguNDQxYy0yLjQ2NSwwLTQuNzA5LDAuNDI5LTYuMzYzLDEuMTE5Yy0wLjE4MywwLjA5LTAuMzEyLDAuMjc4LTAuMzEyLDAuNDk4DQoJCQljMCwwLjA3NiwwLjAxOSwwLjE1NywwLjA1MSwwLjIyN2MwLjE5NiwwLjU2OC0wLjEyNiwxLjE4NC0xLjcyOCwxLjUzNGMtMi4zNzQsMC41MTktMy44NzMsMi45NzItNC43MzEsMy43ODQNCgkJCWMtMS4wMDYsMC45NTYtMy44NTEsMS41NDUtMy40MjMsMC45NzRjMC4zMzUtMC40NDMsMS42MTUtMS44MzIsMi4zOTQtMy4zMzdjMC42OTYtMS4zNDMsMS4zMTYtMS43MjYsMi4xNy0zLjAwNw0KCQkJYzAuMjUtMC4zNzcsMS4yMjItMS42OTYsMS41MDUtMi43NGMwLjMxNy0xLjAxOCwwLjIxLTIuMywwLjMzMS0yLjgyNGMwLjE3NC0wLjc2MywwLjg5My0yLjQwOSwwLjk0NS0zLjMzOA0KCQkJYzAuMDMtMC41MjctMi4xOTgsMC43NDgtMy4yNTUsMC43NDhjLTEuMDU4LDAtMi4wODgtMC42MzItMy4wMzMtMC42NzhjLTEuMTctMC4wNTMtMS45MjEsMC45MDQtMi45ODEsMC43MzYNCgkJCWMtMC42MDMtMC4wOTktMS4xMTMtMC42MjktMi4xNjctMC42NjdjLTEuNTAzLTAuMDU1LTMuMzQsMC44MzUtNi43OTIsMC43MjVjLTMuMzk0LTAuMTEzLTYuNTI4LTQuMjkxLTYuOTU4LTQuOTU4DQoJCQljLTAuNS0wLjc3Ny0xLjExMy0wLjc3Ny0xLjc4LTAuMTY1Yy0wLjY2OCwwLjYxMS0xLjQ5MiwwLjEzLTEuNzI2LTAuMjgxYy0wLjQ0Ni0wLjc3Ny0xLjYzNy0zLjA1NC0zLjQ4LTMuNTMyDQoJCQljLTIuNTUtMC42NjEtMy44MzksMS40MTItMy42NzIsMy4wNmMwLjE2OSwxLjY3MywxLjI1MSwyLjE0MywxLjc1MSwzLjAzMmMwLjUsMC44OTEsMC43NTgsMS40NjUsMS43MDEsMS44NTkNCgkJCWMwLjY2OCwwLjI3OCwwLjkxNywwLjY4OSwwLjcxOSwxLjIzOGMtMC4xNzUsMC40NzgtMC44NywwLjU4NS0xLjMyNywwLjYwOGMtMC45NzMsMC4wNDctMS42NTMtMC4yMTgtMi4xNS0wLjUzMw0KCQkJYy0wLjU3Ny0wLjM3MS0xLjA0Ny0wLjg4Mi0xLjU1MS0xLjc0OWMtMC41ODMtMC45NTktMS41MDItMS4zNzQtMi41Ny0xLjM3NGMtMC41MSwwLTAuOTg5LDAuMTM0LTEuNDEyLDAuMzUxDQoJCQljLTEuNjc4LDAuODczLTMuNjc0LDEuMzg5LTUuODIyLDEuMzg5bC0yLjQyNiwwLjAwNmM0LjY1MiwxMy43ODUsMTcuNjg2LDIzLjcxLDMzLjA0MiwyMy43MWMxMi4yNjUsMCwyMy4wNDgtNi4zMzYsMjkuMjYyLTE1LjkxDQoJCQlDMTQuMjUzLDc4LjYzOSwxMi44Myw3OC40NDEsMTEuMzg3LDc4LjQ0MXoiLz4NCgkJPHBhdGggZD0iTS02LjA2Miw3NS43MjJjLTAuMDMsMC0wLjA2LDAuMDE3LTAuMDgxLDAuMDM3Yy0wLjQ1MSwwLjUyNS0wLjY0NiwwLjY5Ni0wLjk3MSwwLjk2Yy0wLjc4OCwwLjYzMi0xLjY4NS0wLjA4MS0yLjI2LTAuNDIzDQoJCQljLTEuMjgtMC43NDgtMi4zMS0wLjI3Ni0yLjU2MSwwLjMwNGMtMC4yNDksMC41ODksMC4wMjgsMS4yOTEsMC43MjUsMS4xOThjMC45NzYtMC4xMjgsMS4wMTgsMC4wMjIsMS43MjUsMC40NzMNCgkJCWMxLjMxNSwwLjgzMiwyLjI3MywwLjM4LDIuNzYzLTAuMDE1YzAuNDA5LTAuMzI1LDAuNjM1LTAuNjA0LDAuODQ4LTAuOTk4YzAuMzc3LTAuNzQ4LDAuMDctMS4zMzYtMC4xMS0xLjUxMQ0KCQkJQy02LjAwNyw3NS43MzYtNi4wMzUsNzUuNzIyLTYuMDYyLDc1LjcyMnoiLz4NCgkJPHBhdGggZD0iTS0xMy42NjQsMjUuMTQ1Yy0xOS4yNTEsMC0zNC44NTgsMTUuNjA1LTM0Ljg1OCwzNC44NTVjMCwzLjg5NywwLjYzOSw3LjY0NCwxLjgxOSwxMS4xNGgyLjQyNA0KCQkJYzIuMTQ4LDAsNC4xNDYtMC41MTYsNS44MjItMS4zODljMC40MjUtMC4yMTcsMC45MDMtMC4zNTEsMS40MTItMC4zNTFjMS4wNywwLDEuOTg5LDAuNDE1LDIuNTcyLDEuMzc0DQoJCQljMC41MDMsMC44NywwLjk3MywxLjM4MSwxLjU1MSwxLjc0NmMwLjQ5NCwwLjMxOCwxLjE3NywwLjU4LDIuMTQ4LDAuNTM2YzAuNDU3LTAuMDIxLDEuMTUzLTAuMTMxLDEuMzI3LTAuNjA4DQoJCQljMC4yLTAuNTQ5LTAuMDUxLTAuOTYzLTAuNzE5LTEuMjM4Yy0wLjk0Mi0wLjM5NS0xLjE5Ny0wLjk3Mi0xLjY5OS0xLjg2MmMtMC41MDEtMC44OS0xLjU4NC0xLjM1OS0xLjc1Mi0zLjAzMg0KCQkJYy0wLjE2OC0xLjY0NywxLjEyNC0zLjcyNCwzLjY3NC0zLjA2MmMxLjg0MiwwLjQ3OSwzLjAzNCwyLjc1NSwzLjQ3OSwzLjUzOGMwLjIzNSwwLjQwOCwxLjA1NywwLjg4NywxLjcyNiwwLjI3OA0KCQkJYzAuNjY2LTAuNjE1LDEuMjgtMC42MTUsMS43ODIsMC4xNjhjMC40MjgsMC42NjEsMy41NjIsNC44NDIsNi45NTgsNC45NTJjMy40NSwwLjExLDUuMjg3LTAuNzc5LDYuNzkxLTAuNzI1DQoJCQljMS4wNTYsMC4wNDEsMS41NjQsMC41NzEsMi4xNjksMC42NjdjMS4wNTgsMC4xNjgsMS44MTEtMC43ODksMi45NzktMC43M2MwLjk0NSwwLjA0NiwxLjk3NiwwLjY3NSwzLjAzMywwLjY3NQ0KCQkJYzEuMDU3LDAsMy4yODctMS4yNzUsMy4yNTUtMC43NDhjLTAuMDU0LDAuOTMyLTAuNzcsMi41NzgtMC45NDUsMy4zMzhjLTAuMTIyLDAuNTI3LTAuMDE1LDEuODA3LTAuMzMxLDIuODI3DQoJCQljLTAuMjgzLDEuMDQ0LTEuMjU0LDIuMzYzLTEuNTA1LDIuNzQzYy0wLjg1NCwxLjI3OC0xLjQ3MywxLjY2MS0yLjE3LDMuMDA0Yy0wLjc3OCwxLjUwNS0yLjA1OSwyLjg5NC0yLjM5NCwzLjMzNw0KCQkJYy0wLjQyOCwwLjU3MSwyLjQxNy0wLjAxOCwzLjQyNC0wLjk3NGMwLjg1Ny0wLjgxMiwyLjM1Ni0zLjI2LDQuNzMtMy43ODRjMS42MDEtMC4zNTEsMS45MjMtMC45NjYsMS43MjctMS41MzQNCgkJCWMtMC4wMjktMC4wNjMtMC4wNTEtMC4xNDUtMC4wNTEtMC4yMjdjMC0wLjIxNywwLjEzLTAuNDA1LDAuMzEyLTAuNDk4YzEuNjU0LTAuNjksMy44OTgtMS4xMTYsNi4zNjMtMS4xMTYNCgkJCWMxLjQ0MSwwLDIuODY2LDAuMTkxLDQuMjEsMC41MDFDMTkuMTM2LDczLjQ4OCwyMS4xOSw2Ni45ODgsMjEuMTksNjBDMjEuMTksNDAuNzUsNS41ODUsMjUuMTQ1LTEzLjY2NCwyNS4xNDV6Ii8+DQoJCTxwYXRoIGZpbGw9IiNDQzAwMDAiIGQ9Ik02LjAwNCw1MC43MjdjLTAuMzQ1LDEuMTU3LTAuODM1LDIuNjM5LTMuMDE0LDMuNzU2Yy0wLjMxNywwLjE2My0wLjQzOS0wLjEwNC0wLjI5MS0wLjM1NQ0KCQkJYzAuODIyLTEuMzk5LDAuOTctMS43NSwxLjIxLTIuMzA0YzAuMzM1LTAuODA4LDAuNTEtMS45NTgtMC4xNTUtNC4zNTVDMi40NDIsNDIuNzUyLTAuMjkxLDM2LjQ0Ny0yLjI4LDM0LjQwMQ0KCQkJYy0xLjkxNy0xLjk3My01LjM5NC0yLjUzLTguNTM3LTEuNzI0Yy0xLjE1NywwLjI5NS0zLjQyMSwxLjQ3My03LjYxNywwLjUyOWMtNy4yNjctMS42MzctOC4zNDIsMi4wMDItOC43NTgsMy41ODUNCgkJCWMtMC40MTksMS41ODYtMS40MTksNi4wOS0xLjQxOSw2LjA5Yy0wLjMzMywxLjgzNS0wLjc3MSw1LjAyNSwxMC41MTEsNy4xNzRjNS4yNTYsMS4wMDEsNS41MjIsMi4zNTgsNS43NTQsMy4zMzcNCgkJCWMwLjQxOSwxLjc1LDEuMDg0LDIuNzUzLDEuODM1LDMuMjUzYzAuNzUyLDAuNTAyLDAsMC45MTUtMC44MzIsMWMtMi4yMzksMC4yMzItMTAuNTExLTIuMTQtMTUuNDA0LTQuOTINCgkJCWMtNC4wMDQtMi40NDctNC4wNzEtNC42NDktMy4xNTQtNi41MmMtNi4wNDctMC42NTQtMTAuNTg4LDAuNTY3LTExLjQxLDMuNDNjLTEuNDExLDQuOTEyLDEwLjgwNCwxMy4zMDYsMjQuNzEyLDE3LjUxOQ0KCQkJYzE0LjU5Nyw0LjQxOSwyOS42MTIsMS4zMzQsMzEuMjgxLTcuODQzQzE1LjQzNyw1NS4xNDYsMTEuOTI1LDUyLjA2Miw2LjAwNCw1MC43Mjd6IE0tMTYuMzc3LDQxLjc0Mg0KCQkJYy00LjAyNiwwLjI5LTQuNDQ0LDAuNzI2LTUuMTk4LDEuNTI5Yy0xLjA2MiwxLjEzNC0yLjQ2NC0xLjQ2OS0yLjQ2NC0xLjQ2OWMtMC44NDEtMC4xNzctMS44NTktMS41MzItMS4zMTEtMi43OTgNCgkJCWMwLjU0Mi0xLjI1MSwxLjU0MS0wLjg3OCwxLjg1NC0wLjQ4N2MwLjM4MywwLjQ3NiwxLjE5NiwxLjI1MSwyLjI1MywxLjIyNGMxLjA1Ny0wLjAyNiwyLjI3NS0wLjI0OSwzLjk3Ni0wLjI0OQ0KCQkJYzEuNzI0LDAsMi44OCwwLjY0NCwyLjk0NywxLjE5N0MtMTQuMjYyLDQxLjE1OS0xNC40NTksNDEuNjAzLTE2LjM3Nyw0MS43NDJ6IE0tNy42NjksMzcuNzMzDQoJCQljLTAuNzIyLTAuMDE4LTEuNDAyLTAuMTIyLTEuOTg3LTAuMjljLTAuMDctMC4wMTctMC4xMTgtMC4wNzctMC4xMTgtMC4xNDhjMC0wLjA2OSwwLjA1MS0wLjEyOSwwLjEyMS0wLjE0Ng0KCQkJYzEuMzkzLTAuMzIzLDIuMzM1LTAuODQ5LDIuMjY3LTEuMzQ4Yy0wLjA4Ny0wLjY2LTEuOTEyLTEuMDIxLTQuMDcyLTAuODAzYy0wLjIzNiwwLjAyNS0wLjQ2NywwLjA1NC0wLjY5MSwwLjA5DQoJCQljLTAuMDA2LDAtMC4wMTIsMC4wMDEtMC4wMTgsMC4wMDFjLTAuMDYyLDAtMC4xMTItMC4wNDktMC4xMTItMC4xMDdjMC0wLjA0MiwwLjAyNS0wLjA3OSwwLjA2NC0wLjA5Ng0KCQkJYzAuNzgtMC40MTQsMS45NDQtMC43NDEsMy4yNzgtMC44NzZjMC40LTAuMDQxLDAuNzkxLTAuMDYyLDEuMTY3LTAuMDYzYzAuMDY2LDAsMC4xMzIsMCwwLjIsMA0KCQkJYzIuMjM0LDAuMDUxLDQuMDIyLDAuOTM5LDMuOTk3LDEuOTgxQy0zLjYwMSwzNi45NzgtNS40MzMsMzcuNzg0LTcuNjY5LDM3LjczM3oiLz4NCgk8L2c+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0zOC45NTgsNjIuMTk4YzAtMy4xOTYtMC4wNjUtNS41NDYtMC4xOTYtNy42NzJoNS4yMjhsMC4yMjUsNC41MzVoMC4xNzFjMS4xNzQtMy4zNiwzLjk1OS01LjA3Niw2LjUzNy01LjA3Ng0KCQkJYzAuNTksMCwwLjkzNCwwLjAyMiwxLjQxNSwwLjEzdjUuNjg4Yy0wLjU2NS0wLjExLTEuMDkyLTAuMTcyLTEuODE4LTAuMTcyYy0yLjg3OCwwLTQuODc1LDEuODMtNS40MTIsNC41NjgNCgkJCWMtMC4xMDMsMC41MzQtMC4xNTcsMS4xNzItMC4xNTcsMS44MjF2MTIuMzg0SDM4LjkxTDM4Ljk1OCw2Mi4xOTh6Ii8+DQoJCTxwYXRoIGQ9Ik01OS42MjgsNjguMDljMC4xNTgsNC4zMjksMy41MDcsNi4yMiw3LjM3NSw2LjIyYzIuNzc4LDAsNC43NjUtMC40MzYsNi41OTEtMS4xMDVsMC44OTEsNC4xNTINCgkJCWMtMi4wNDEsMC44Ny00Ljg3NywxLjUxNC04LjM0MiwxLjUxNGMtNy43NTUsMC0xMi4yOTYtNC43ODctMTIuMjk2LTEyLjEwM2MwLTYuNTkxLDMuOTk5LTEyLjgyNiwxMS42NzgtMTIuODI2DQoJCQljNy43NjUsMCwxMC4yOTQsNi4zODYsMTAuMjk0LDExLjYxNGMwLDEuMTE5LTAuMTAyLDIuMDIzLTAuMjE1LDIuNThMNTkuNjI4LDY4LjA5eiBNNzAuMTI5LDYzLjg4Ng0KCQkJYzAuMDI5LTIuMjE2LTAuOTM0LTUuODItNC45NzktNS44MmMtMy43MTcsMC01LjI2MywzLjM3MS01LjUzNCw1LjgySDcwLjEyOXoiLz4NCgkJPHBhdGggZD0iTTE0Ny4zMSw3Mi43MjljMCwxLjg5LDAuMDc1LDMuODQ1LDAuMzQ4LDUuNjc3aC0yLjE3NWwtMC4zNDgtMy40MjdoLTAuMTFjLTEuMTYsMS44NDQtMy44MjEsMy45NjYtNy42MiwzLjk2Ng0KCQkJYy00LjgwOCwwLTcuMDQ2LTMuMzgxLTcuMDQ2LTYuNTY0YzAtNS41MTgsNC44NjgtOC44NDEsMTQuNTkxLTguNzM5di0wLjYzOGMwLTIuMzY0LTAuNDU4LTcuMDgxLTYuMTEyLTcuMDQzDQoJCQljLTIuMDk0LDAtNC4yNzQsMC41Ni02LjAwMiwxLjc4MmwtMC43NTQtMS43MjFjMi4xODQtMS40NzksNC44NTQtMi4wNjMsNy4wMTQtMi4wNjNjNi44OTgsMCw4LjIxNSw1LjE3Nyw4LjIxNSw5LjQ0NVY3Mi43Mjl6DQoJCQkgTTE0NC45NDksNjUuNjMxYy01LjIwOC0wLjE1LTEyLjA3NywwLjYzOC0xMi4wNzcsNi4zNzZjMCwzLjQzNywyLjI2OCw0Ljk3OSw0Ljc1Niw0Ljk3OWMzLjk4MywwLDYuMjQ4LTIuNDY1LDcuMDcxLTQuNzkNCgkJCWMwLjE3NS0wLjUxLDAuMjUtMS4wMjYsMC4yNS0xLjQzM1Y2NS42MzFMMTQ0Ljk0OSw2NS42MzF6Ii8+DQoJCTxwYXRoIGQ9Ik0xNTYuNzIxLDQ5LjIzN3Y1LjI2N2g2LjgxNHYxLjkxOGgtNi44MTR2MTUuNTMzYzAsMy4wMzgsMC45NDUsNC45NDMsMy41MTUsNC45NDNjMS4yMjksMCwyLjEtMC4xNjIsMi43MTQtMC4zNzQNCgkJCWwwLjI4NCwxLjgzYy0wLjc3MSwwLjMyNC0xLjg1MywwLjU3NC0zLjI5NywwLjU3NGMtMS43NDIsMC0zLjE5Mi0wLjU0OS00LjEyMy0xLjY5M2MtMS4wODEtMS4yNTMtMS40NTItMy4yNi0xLjQ1Mi01LjY5OFY1Ni40MjMNCgkJCWgtNC4wMzN2LTEuOTE3aDQuMDMzdi00LjM5NUwxNTYuNzIxLDQ5LjIzN3oiLz4NCgkJPHBhdGggZD0iTTE2Ni41MjEsNzcuMTM0aDAuMzEzbDAuNDc2LDAuNzc5aDAuMzA1bC0wLjUxNC0wLjc5NGMwLjI2Ny0wLjAzNSwwLjQ3LTAuMTc0LDAuNDctMC40OTMNCgkJCWMwLTAuMzU5LTAuMjE1LTAuNTExLTAuNjM1LTAuNTExaC0wLjY4OHYxLjc5OGgwLjI3MlY3Ny4xMzRMMTY2LjUyMSw3Ny4xMzR6IE0xNjYuNTIxLDc2LjkwMXYtMC41NmgwLjM3MQ0KCQkJYzAuMTg2LDAsMC4zOTIsMC4wNDQsMC4zOTIsMC4yNjRjMCwwLjI3OC0wLjIwNiwwLjI5Ni0wLjQzOCwwLjI5NkgxNjYuNTIxeiIvPg0KCQk8cGF0aCBkPSJNMTY4LjYwNiw3Ny4wMTVjMCwwLjk2OS0wLjc5MiwxLjc1Ny0xLjc2LDEuNzU3Yy0wLjk3MiwwLTEuNzYzLTAuNzg4LTEuNzYzLTEuNzU3YzAtMC45NzUsMC43OTEtMS43NjMsMS43NjMtMS43NjMNCgkJCUMxNjcuODE0LDc1LjI1MiwxNjguNjA2LDc2LjA0LDE2OC42MDYsNzcuMDE1eiBNMTY2Ljg0Nyw3NS41NjRjLTAuODA3LDAtMS40NTMsMC42NDYtMS40NTMsMS40NWMwLDAuOCwwLjY0NiwxLjQ0NCwxLjQ1MywxLjQ0NA0KCQkJYzAuNzk3LDAsMS40NDYtMC42NDUsMS40NDYtMS40NDRDMTY4LjI5Myw3Ni4yMTEsMTY3LjY0MSw3NS41NjQsMTY2Ljg0Nyw3NS41NjR6Ii8+DQoJCTxwYXRoIGQ9Ik05NS43OTYsNTcuMDk1aC0wLjA5OWMtMS4wNjctMS43NjMtMy40MjItMy4xMS02LjY5Mi0zLjExYy01Ljc0MSwwLTEwLjc0Miw0Ljc1Mi0xMC43MDUsMTIuNzUzDQoJCQljMCw3LjM0Miw0LjUxNSwxMi4yMDEsMTAuMjE4LDEyLjIwMWMzLjQ0NSwwLDYuMzI3LTEuNjQxLDcuNzU0LTQuMzE0aDAuMTA0bDAuMjcyLDMuNzgxaDUuMzc5Yy0wLjExLTEuNjI0LTAuMi00LjI1NC0wLjItNi42OTgNCgkJCVY0NS4zNmwtNi4wMzQtMS43MzJ2MTMuNDY3SDk1Ljc5NnogTTk1Ljc5Niw2OC4wNTJjMCwwLjYzMy0wLjA0NCwxLjIyMS0wLjE4LDEuNzYxYy0wLjYwOSwyLjYxNS0yLjc0Niw0LjI5Ny01LjIxNyw0LjI5Nw0KCQkJYy0zLjgwMSwwLTUuOTc2LTMuMjA0LTUuOTc2LTcuNTkxYzAtNC40MzEsMi4xNTctNy44NjEsNi4wNDMtNy44NjFjMi43MTQsMCw0LjY1OSwxLjkxNCw1LjE5NSw0LjIzOQ0KCQkJYzAuMTAyLDAuNDksMC4xMzQsMS4wOTQsMC4xMzQsMS41NzRWNjguMDUyeiIvPg0KCQk8cGF0aCBkPSJNMTE3Ljc5OCw1My45NTljLTEuODE4LDAtMy40NDUsMC41MjQtNC44MTYsMS4zNjhjLTEuNDIxLDAuODMzLTIuNTc4LDIuMTE3LTMuMjY1LDMuNDQ2aC0wLjA5NlY0Ny41OTlsLTIuMzYzLTAuNjc5DQoJCQl2MzEuNDg2aDIuMzYzVjYzLjc5YzAtMC45NzIsMC4wNzUtMS42NDUsMC4zMjQtMi4zNTRjMS4wMTktMi45NzQsMy44MjItNS40MTIsNy4yMDktNS40MTJjNC44OTIsMCw2LjU4NSwzLjkyMyw2LjU4NSw4LjIyOA0KCQkJdjE0LjE1NWgyLjM2MlY2My45OUMxMjYuMDk5LDU1LjA4NywxMjAuMDYsNTMuOTU5LDExNy43OTgsNTMuOTU5eiIvPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K\");height:70px;width:218px;background-position:center;background-repeat:no-repeat;background-size:100% 100%;display:inline-block;max-height:150px;max-width:90%;}#fh_appform_container .fh_appform_progress_steps .pagination{padding-right:0;margin-top:5px;margin-bottom:5px}#fh_appform_container .fh_appform_field_input_container.col-xs-12{padding-left:0;padding-right:0}#fh_appform_container input[type=text].fh_appform_field_input{height:100%}#fh_appform_container .fh_appform_page.col-xs-12{padding-left:0;padding-right:0}#fh_appform_container .fh_appform_logo_container.col-xs-12{text-align:center}#fh_appform_container .fh_appform_input_wrapper.col-xs-12{padding-left:0;padding-right:0}#fh_appform_container .fh_appform_section_area.panel.panel-default .panel-body{padding:0;margin:0}#fh_appform_container .sigPad ul{margin:0}#fh_appform_container .btn.text-left{text-align:left}#fh_appform_container .choice_icon:before{width:15px}#fh_appform_container .choice_icon{padding-right:10px}#fh_appform_container .fh_appform_field_area button:first-child{margin-top:0}#fh_appform_container .fh_appform_field_area button,#fh_appform_container .fh_appform_field_area button.fh_appform_removeInputBtn{margin-top:5px}#fh_appform_container .panel-body .fh_appform_field_area:first-child{margin-top:5px}#fh_appform_container .fh_appform_field_area button.fh_appform_removeInputBtn.active{margin-top:5px!important}#fh_appform_container .fh_appform_field_area button.active{margin-top:5px}#fh_appform_container .fh_appform_field_area button:active{margin-top:5px}#fh_appform_container .fh_appform_field_area button.fh_appform_removeInputBtn:active{margin-top:5px!important}#fh_appform_container .fh_appform_field_area button:active:first-child{margin-top:0}#fh_appform_container .fh_appform_field_area button.active:first-child{margin-top:0}#fh_appform_container .fh_appform_field_input_container.repeating{padding-right:0;padding-left:0}#fh_appform_container .fh_appform_field_input_container.repeating button.special_button{margin-top:0}#fh_appform_container .fh_appform_input_wrapper .fh_appform_field_wrapper:first-child{margin-top:0}#fh_appform_container .fh_appform_section_area .fh_appform_field_area:last-child{margin-bottom:0}#fh_appform_container .fh_appform_page .fh_appform_section_area:first-child{margin-top:0}#fh_appform_container .btn-group{font-size:12px}#fh_appform_container .fh_appform_field_wrapper{padding:0}#fh_appform_container .fh_appform_field_button_bar{padding:0}#fh_appform_container input[type=file].fh_appform_field_input {position:absolute;opacity: 0.01;z-index: 9999;}" };


  var generatedCSS = "";
  var generationFailed = {"failed": false, "failedSections": []};

  function findSection(sectionId, subSectionId) {
    var themeSections = themeJSON.sections;
    var foundThemeSections = themeSections.filter(function(themeSection) {
      return themeSection.id === sectionId;
    });

    if (foundThemeSections.length > 0) {
      var foundThemeSubSections = foundThemeSections[0].sub_sections.filter(function(themeSubSection) {
        return themeSubSection.id === subSectionId;
      });

      if (foundThemeSubSections.length > 0) {
        return foundThemeSubSections[0];
      } else {
        console.log("No sub section found for sub section id: ", subSectionId);
        return null;
      }
    } else {
      console.log("No section found for section id: ", sectionId);
      return null;
    }
  }

  function generateCSS(sectionId, subSectionId, styleDefinition) {

    function parseStyleNumber(numToValidate) {
      if (numToValidate !== null && !isNaN(numToValidate)) {
        var numToValidateInt = parseInt(numToValidate);
        if (numToValidateInt > -1) {
          return numToValidate;
        } else {
          return "0";   //Margin and padding must be > 0
        }
      } else {
        return null;
      }
    }

    function generateSpacingCSS(type, spacingJSON, spacingStructure) {
      spacingJSON = spacingJSON ? spacingJSON : {};
      //top, right, bottom, left
      var marginCSS = "";
      var marginValCSS = "";
      var marginUnit = "px";
      var parsedTop = spacingStructure.top ? parseStyleNumber(spacingJSON.top) : 0;
      var parsedRight = spacingStructure.right ? parseStyleNumber(spacingJSON.right) : 0;
      var parsedBottom = spacingStructure.bottom ? parseStyleNumber(spacingJSON.bottom) : 0;
      var parsedLeft = spacingStructure.left ? parseStyleNumber(spacingJSON.left) : 0;

      //Must have all 4 values assigned
      if (parsedTop !== null && parsedRight !== null && parsedBottom !== null && parsedLeft !== null) {
        marginValCSS = parsedTop + marginUnit + " " + parsedRight + marginUnit + " " + parsedBottom + marginUnit + " " + parsedLeft + marginUnit;
        marginCSS = type + ":" + marginValCSS + ";";
        return marginCSS;
      } else {
        console.log("Error generating " + type + ". Invalid values: ", JSON.stringify(spacingJSON));
        return null;
      }
    }

    function generateStyleType(styleType) {
      var styleFunctions = {
        "background": function(backgroundJSON) {
          if (backgroundJSON.background_color) {
            return "background-color:" + backgroundJSON.background_color + ";";
          } else {
            return null;
          }
        },
        "typography": function(fontJSON) {
          var fontCSS = "";

          if (fontJSON.fontSize) {
            fontCSS = fontCSS.concat("font-size:" + fontJSON.fontSize + "em;");
          } else {
            return null;
          }

          if (fontJSON.fontFamily) {
            fontCSS = fontCSS.concat("font-family:" + fontJSON.fontFamily + ";");
          } else {
            return null;
          }

          if (fontJSON.fontColour) {
            fontCSS = fontCSS.concat("color:" + fontJSON.fontColour + ";");
          } else {
            return null;
          }

          if (fontJSON.fontStyle) {
            if (fontJSON.fontStyle === "italic") {
              fontCSS = fontCSS.concat("font-style:" + fontJSON.fontStyle + ";");
              fontCSS = fontCSS.concat("font-weight:normal;");
            } else if (fontJSON.fontStyle === "bold") {
              fontCSS = fontCSS.concat("font-weight:" + fontJSON.fontStyle + ";");
              fontCSS = fontCSS.concat("font-style:normal;");
            } else if (fontJSON.fontStyle === "normal") {
              fontCSS = fontCSS.concat("font-weight:normal;");
              fontCSS = fontCSS.concat("font-style:normal;");
            } else {
              return null;
            }
          } else {
            return null;
          }

          return fontCSS;
        },
        "border": function(borerJSON) {
          var borderStr = "";

          if (borerJSON.thickness) {
            if (borerJSON.thickness === "none") {
              return borderStr.concat("border:" + borerJSON.thickness + ";");
            } else {
              borderStr = borderStr.concat("border-width:" + borerJSON.thickness + ";");
            }
          } else {
            return null;
          }

          if (borerJSON.style) {
            borderStr = borderStr.concat("border-style:" + borerJSON.style + ";");
          } else {
            return null;
          }

          if (borerJSON.colour) {
            borderStr = borderStr.concat("border-color:" + borerJSON.colour + ";");
          } else {
            return null;
          }

          return borderStr;
        },
        "margin": function(marginJSON, marginStructure) {
          return generateSpacingCSS("margin", marginJSON, marginStructure);
        },
        "padding": function(paddingJSON, paddingStructure) {
          return generateSpacingCSS("padding", paddingJSON, paddingStructure);
        }
      };
      var subSectionStyleDefinition = null;
      if (styleDefinition[styleType] === true) {
        subSectionStyleDefinition = findSection(sectionId, subSectionId);
        if (subSectionStyleDefinition === null) {
          console.log("Expected style definition for section id: ", sectionId, " and subsection id: ", subSectionId);
          return null;
        }

        if (!subSectionStyleDefinition[styleType]) {
          console.log("No style definition for expected: ", styleType, subSectionStyleDefinition);
          return null;
        }

        if (styleFunctions[styleType]) {
          return styleFunctions[styleType](subSectionStyleDefinition[styleType]);
        } else {
          console.log("Expected style function for type: ", styleType);
          return null;
        }
      } else if (styleDefinition[styleType] === false) {
        return "";//No style, return empty string
      } else if (typeof(styleDefinition[styleType]) === "object") {
        subSectionStyleDefinition = findSection(sectionId, subSectionId);
        if (subSectionStyleDefinition === null) {
          console.log("Expected style definition for section id: ", sectionId, " and subsection id: ", subSectionId);
          return null;
        }

        if (styleFunctions[styleType]) {
          return styleFunctions[styleType](subSectionStyleDefinition[styleType], styleDefinition[styleType]);
        } else {
          console.log("Expected style function for type: ", styleType);
          return null;
        }
      } else {
        return null;
      }
    }

    var typographyCSS = generateStyleType("typography");
    var backgroundCSS = generateStyleType("background");
    var borderCSS = generateStyleType("border");
    var marginCSS = generateStyleType("margin");
    var paddingCSS = generateStyleType("padding");

    if (typographyCSS === null) {
      console.log("Typography css was null for section ", sectionId, " and subsection ", subSectionId);
      return null;
    } else if (backgroundCSS === null) {
      console.log("Background css was null for section ", sectionId, " and subsection ", subSectionId);
      return null;
    } else if (borderCSS === null) {
      console.log("Border css was null for section ", sectionId, " and subsection ", subSectionId);
      return null;
    } else if (marginCSS === null) {
      console.log("Margin css was null for section ", sectionId, " and subsection ", subSectionId);
      return null;
    } else if (paddingCSS === null) {
      console.log("Padding css was null for section ", sectionId, " and subsection ", subSectionId);
      return null;
    }

    return typographyCSS + backgroundCSS + borderCSS + marginCSS + paddingCSS;
  }

  function generateCSSClassName(sectionId, subSectionId, className) {

    if (sectionId === "form" && subSectionId === "area") {
      if (className) {
        return "." + FH_APPFORM_PREFIX + className;
      } else {
        return "." + FH_APPFORM_PREFIX + sectionId + "_" + subSectionId;
      }
    }

    if (className) {
      return FH_APPFORM_CONTAINER_CLASS_PREFIX + "." + FH_APPFORM_PREFIX + className;
    } else {
      return FH_APPFORM_CONTAINER_CLASS_PREFIX + "." + FH_APPFORM_PREFIX + sectionId + "_" + subSectionId;
    }
  }

  function generateStaticCSS(staticCSSArray) {
    var staticCSSStr = "";
    staticCSSArray = staticCSSArray ? staticCSSArray : [];

    for (var cssObjIndex = 0; cssObjIndex < staticCSSArray.length; cssObjIndex++) {
      var cssObject = staticCSSArray[cssObjIndex];
      if (!cssObject.key) {
        return null;
      }

      if (!cssObject.value) {
        return null;
      }
      staticCSSStr += cssObject.key + ":" + cssObject.value + ";";
    }

    return staticCSSStr;
  }

  function generateClassAdditions(className, classAdditions) {
    var classAdditionCSS = "";

    classAdditions = classAdditions ? classAdditions : [];

    if (classAdditions) {
      for (var classAddIndex = 0; classAddIndex < classAdditions.length; classAddIndex++) {
        var classAdditionObject = classAdditions[classAddIndex];
        var fullClassName = className + classAdditionObject.classNameAddition;
        var staticCSS = generateStaticCSS(classAdditionObject.cssAdditions);

        classAdditionCSS += fullClassName + "{" + staticCSS + "}";
      }
    }

    return classAdditionCSS;
  }

  function generateLogoCSS() {
    if (styleStructure.logo) { //Only intend to generate a logo if it exists in the theme structure.
      if (themeJSON.logo) {
        var logoStr = "";
        var logoStaticCSS = "";
        var logoClassName = "";
        var base64Image = themeJSON.logo.base64String;
        var imageHeight = themeJSON.logo.height;
        var imageWidth = themeJSON.logo.width;


        if (base64Image && imageHeight && imageWidth) {
          logoStr += "background-image:url(\"" + base64Image + "\");";
          logoStr += "height:" + imageHeight + "px;";
          logoStr += "width:" + imageWidth + "px;";

          logoStaticCSS = generateStaticCSS(styleStructure.logo.staticCSS);

          logoStr = logoStr + logoStaticCSS;

          logoClassName = generateCSSClassName("logo", "logo", "logo");

          var fullLogoCSS = logoClassName + "{" + logoStr + "}";

          return fullLogoCSS;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return "";
    }
  }

  function generateThemeCSS() {

    if (!styleStructure.sections || !Array.isArray(styleStructure.sections)) {
      return null;
    }

    var logoCSS = generateLogoCSS();

    if (logoCSS === null) {
      generatedCSS = null;
      generationFailed.failed = true;
      generationFailed.failedSections.push({"section": "logo", "subSection": "logo" });
      return;
    }

    styleStructure.sections.forEach(function(themeSection) {
      var sectionId = themeSection.id;

      var subSections = themeSection.sub_sections ? themeSection.sub_sections : [];
      subSections.forEach(function(subSection) {
        var subSectionId = subSection.id;
        var subSectionStyle = subSection.style;

        var cssGenerated = generateCSS(sectionId, subSectionId, subSectionStyle);
        if (cssGenerated === null) {
          console.log("Error generating css for section: ", sectionId, " and subsection: ", subSectionId);
          generatedCSS = null;
          generationFailed.failed = true;
          generationFailed.failedSections.push({"section": sectionId, "subSection": subSectionId });
          return;
        }

        var staticCSS = generateStaticCSS(subSection.staticCSS);
        if (staticCSS === null) {
          console.log("Error getting statics css for section: ", sectionId, " and subsection: ", subSectionId);
          generatedCSS = null;
          generationFailed.failed = true;
          generationFailed.failedSections.push({"section": sectionId, "subSection": subSectionId });
          return;
        }

        var cssClassName = generateCSSClassName(sectionId, subSectionId, subSection.class_name);
        if (cssClassName === null) {
          console.log("Error getting css class name for section: ", sectionId, " and subsection: ", subSectionId);
          generatedCSS = null;
          generationFailed.failed = true;
          generationFailed.failedSections.push({"section": sectionId, "subSection": subSectionId });
          return;
        }

        var fullClassDefinition = cssClassName + "{" + cssGenerated + staticCSS + "}";

        var additionalClassCSS = generateClassAdditions(cssClassName, subSection.classAdditions);

        fullClassDefinition += additionalClassCSS;

        generatedCSS += fullClassDefinition;
      });
    });
    generatedCSS += logoCSS;

    generatedCSS += "#fh_appform_container .fh_appform_progress_steps .pagination{padding-right:0;margin-top:5px;margin-bottom:5px}#fh_appform_container .fh_appform_field_input_container.col-xs-12{padding-left:0;padding-right:0}#fh_appform_container input[type=text].fh_appform_field_input{height:100%}#fh_appform_container .fh_appform_page.col-xs-12{padding-left:0;padding-right:0}#fh_appform_container .fh_appform_logo_container.col-xs-12{text-align:center}#fh_appform_container .fh_appform_input_wrapper.col-xs-12{padding-left:0;padding-right:0}#fh_appform_container .fh_appform_section_area.panel.panel-default .panel-body{padding:0;margin:0}#fh_appform_container .sigPad ul{margin:0}#fh_appform_container .btn.text-left{text-align:left}#fh_appform_container .choice_icon:before{width:15px}#fh_appform_container .choice_icon{padding-right:10px}#fh_appform_container .fh_appform_field_area button:first-child{margin-top:0}#fh_appform_container .fh_appform_field_area button,#fh_appform_container .fh_appform_field_area button.fh_appform_removeInputBtn{margin-top:5px}#fh_appform_container .panel-body .fh_appform_field_area:first-child{margin-top:5px}#fh_appform_container .fh_appform_field_area button.fh_appform_removeInputBtn.active{margin-top:5px!important}#fh_appform_container .fh_appform_field_area button.active{margin-top:5px}#fh_appform_container .fh_appform_field_area button:active{margin-top:5px}#fh_appform_container .fh_appform_field_area button.fh_appform_removeInputBtn:active{margin-top:5px!important}#fh_appform_container .fh_appform_field_area button:active:first-child{margin-top:0}#fh_appform_container .fh_appform_field_area button.active:first-child{margin-top:0}#fh_appform_container .fh_appform_field_input_container.repeating{padding-right:0;padding-left:0}#fh_appform_container .fh_appform_field_input_container.repeating button.special_button{margin-top:0}#fh_appform_container .fh_appform_input_wrapper .fh_appform_field_wrapper:first-child{margin-top:0}#fh_appform_container .fh_appform_section_area .fh_appform_field_area:last-child{margin-bottom:0}#fh_appform_container .fh_appform_page .fh_appform_section_area:first-child{margin-top:0}#fh_appform_container .btn-group{font-size:12px}#fh_appform_container .fh_appform_field_wrapper{padding:0}#fh_appform_container .fh_appform_field_button_bar{padding:0}#fh_appform_container input[type=file].fh_appform_field_input {position:absolute;opacity: 0.01;z-index: 9999;}";

    return {
      "generatedCSS": generatedCSS,
      "generationResult": generationFailed
    };
  }

  var generationFunctions = {
    "findSection": findSection,
    "generateCSS": generateCSS,
    "generateCSSClassName": generateCSSClassName,
    "generateStaticCSS": generateStaticCSS,
    "generateClassAdditions": generateClassAdditions,
    "generateLogoCSS": generateLogoCSS
  };

  return {
    "generationFunctions": generationFunctions,
    "generateThemeCSS": generateThemeCSS,
    "styleStructure": styleStructure,
    "baseTheme": baseTheme
  };
};

module.exports.themeCSSGenerator = themeCSSGenerator;
