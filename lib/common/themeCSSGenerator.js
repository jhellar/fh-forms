
var themeCSSGenerator = function (themeJSON, styleStructure) {
  var FH_APPFORM_PREFIX = "fh_appform_";
  var FH_APPFORM_CONTAINER_CLASS_PREFIX = "." + FH_APPFORM_PREFIX + "container ";
  var fh_styleStructure = {
    "logo": {
      "staticCSS": [
        {"key": "background-position", "value": "center"},
        {"key": "background-repeat", "value": "no-repeat"},
        {"key": "width", "value": "100%"},
        {"key": "display", "value": "inline-block"}
      ]
    },
    "sections": [
      {
        "id": "body",
        "label": "Body",
        "sub_sections": [
          {
            "id": "area",
            "label": "Area",
            "style": {
              "typography": false,
              "background": true,
              "border": false,
              "margin": false,
              "padding": false
            },
            "staticCSS": []
          }
        ]
      },
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
              "margin": false,
              "padding": false
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
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "text-align",
                "value": "center"
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
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "text-align",
                "value": "center"
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
              "margin": true,
              "padding": true
            },
            "staticCSS": [{
              "key": "text-align",
              "value": "center"
            },
              {
                "key": "width",
                "value": "100%"
              },
              {
                "key": "display",
                "value": "inline-block"
              }]
          },
          {
            "id": "description",
            "label": "Description",
            "style": {
              "typography": true,
              "background": false,
              "border": false,
              "margin": true,
              "padding": true
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
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "width",
                "value": "100%"
              }
            ],
            "classAdditions": [
              {
                "classNameAddition": " td",
                "cssAdditions": [
                  {
                    "key": "text-align",
                    "value": "center"
                  }
                ]
              },
              {
                "classNameAddition": " td .active .page_title",
                "cssAdditions": [
                  {
                    "key": "text-align",
                    "value": "center"
                  }
                ]
              },
              {
                "classNameAddition": " .page_title",
                "cssAdditions": [
                  {
                    "key": "display",
                    "value": "none"
                  }
                ]
              },
              {
                "classNameAddition": " .number",
                "cssAdditions": [
                  {
                    "key": "padding",
                    "value": "5px 10px 5px 10px"
                  }
                ]
              }
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
              "margin": false,
              "padding": false
            },
            "staticCSS": [
              {
                "key": "display",
                "value": "inline-block"
              },
              {
                "key": "border-radius",
                "value": "13px"
              }
            ]
          },
          {
            "id": "progress_steps_number_container_active",
            "class_name": "progress_steps td.active .number_container",
            "label": "Page Number Container (Active)",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": false,
              "padding": false
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
              "border": false,
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
              }
            ]
          },
          {
            "id": "title",
            "label": "Title",
            "style": {
              "typography": true,
              "background": false,
              "border": false,
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "text-align",
                "value": "center"
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
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "text-align",
                "value": "center"
              }
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
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
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
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
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
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "display",
                "value": "block"
              },
              {
                "key": "border-radius",
                "value": "5px"
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
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
              },
              {
                "key": "line-height",
                "value": "1.4em"
              },
              {
                "key": "display",
                "value": "inline-block"
              },
              {
                "key": "width",
                "value": "100%"
              }
            ],
            "classAdditions": [
              {
                "classNameAddition": " .radio",
                "cssAdditions": [
                ]
              },
              {
                "classNameAddition": " .checkbox",
                "cssAdditions": [
                  {
                    "key": "display",
                    "value": "inline"
                  }
                ]
              },
              {
                "classNameAddition": " .choice",
                "cssAdditions": [
                  {
                    "key": "display",
                    "value": "inline"
                  },
                  {
                    "key": "margin-left",
                    "value": "5px"
                  }
                ]
              },
              {
                "classNameAddition": ".repeating",
                "cssAdditions": [

                ]
              },
              {
                "classNameAddition": ".non_repeating",
                "cssAdditions": [

                ]
              }
            ]
          },
          {
            "id": "error",
            "label": "Error Highlighting",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
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
              "margin": false,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "display",
                "value": "inline"
              },
              {
                "key": "float",
                "value": "left"
              },
              {
                "key": "width",
                "value": "15%"
              },
              {
                "key": "text-align",
                "value": "center"
              }
            ]
          },
          {
            "id": "required",
            "label": "Required Symbol (*)",
            "style": {
              "typography": true,
              "background": false,
              "border": false,
              "margin": false,
              "padding": false
            },
            "staticCSS": [{
              "key": "content",
              "value": "\"*\""
            },
              {
                "key": "vertical-align",
                "value": "top"
              }],
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
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "text-align",
                "value": "center"
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
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
              }
            ],
            "classAdditions": [
              {
                "classNameAddition": ".fh_appform_two_button",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%!important"
                  }
                ]
              },
              {
                "classNameAddition": ".fh_appform_three_button",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "30%!important"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "100%"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button.fh_appform_removeInputBtn",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button.fh_appform_addInputBtn",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%"
                  }
                ]
              }
            ]
          },
          {
            "id": "default_active",
            "class_name": "button_default:active",
            "label": "Default (Active)",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
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
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
              }
            ],
            "classAdditions": [
              {
                "classNameAddition": ".fh_appform_two_button",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%!important"
                  }
                ]
              },
              {
                "classNameAddition": ".fh_appform_three_button",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "30%!important"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "100%"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button.fh_appform_removeInputBtn",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%!important"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button.fh_appform_addInputBtn",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%!important"
                  }
                ]
              }
            ]
          },
          {
            "id": "action_active",
            "class_name": "button_action:active",
            "label": "Action (Active)",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
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
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
              }
            ],
            "classAdditions": [
              {
                "classNameAddition": ".fh_appform_two_button",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%"
                  }
                ]
              },
              {
                "classNameAddition": ".fh_appform_three_button",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "33.3%"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "100%"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button.fh_appform_removeInputBtn",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button.fh_appform_addInputBtn",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%"
                  }
                ]
              }
            ]
          },
          {
            "id": "cancel_active",
            "class_name": "button_cancel:active",
            "label": "Cancel (Active)",
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": true,
              "padding": true
            },
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
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
  "_id": "53737ae5eb1f144a06ae2b38",
  "name": "Base Theme",
  "structure": {
    "logo": {
      "staticCSS": [
        {
          "key": "background-position",
          "value": "center"
        },
        {
          "key": "background-repeat",
          "value": "no-repeat"
        },
        {
          "key": "width",
          "value": "100%"
        },
        {
          "key": "display",
          "value": "inline-block"
        }
      ]
    },
    "sections": [
      {
        "id": "body",
        "label": "Body",
        "sub_sections": [
          {
            "id": "area",
            "label": "Area",
            "classAdditions": [],
            "staticCSS": [],
            "style": {
              "typography": false,
              "background": true,
              "border": false,
              "margin": false,
              "padding": false
            }
          }
        ]
      },
      {
        "id": "form",
        "label": "Form",
        "sub_sections": [
          {
            "id": "area",
            "label": "Background",
            "classAdditions": [],
            "staticCSS": [],
            "style": {
              "typography": false,
              "background": true,
              "border": true,
              "margin": false,
              "padding": false
            }
          },
          {
            "id": "title",
            "label": "Title",
            "classAdditions": [],
            "staticCSS": [
              {
                "key": "text-align",
                "value": "center"
              }
            ],
            "style": {
              "typography": true,
              "background": false,
              "border": false,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "description",
            "label": "Description",
            "classAdditions": [],
            "staticCSS": [
              {
                "key": "text-align",
                "value": "center"
              }
            ],
            "style": {
              "typography": true,
              "background": false,
              "border": false,
              "margin": true,
              "padding": true
            }
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
            "classAdditions": [],
            "staticCSS": [
              {
                "key": "text-align",
                "value": "center"
              },
              {
                "key": "width",
                "value": "100%"
              },
              {
                "key": "display",
                "value": "inline-block"
              }
            ],
            "style": {
              "typography": true,
              "background": false,
              "border": false,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "description",
            "label": "Description",
            "classAdditions": [],
            "staticCSS": [],
            "style": {
              "typography": true,
              "background": false,
              "border": false,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "progress_steps",
            "label": "Page Area",
            "classAdditions": [
              {
                "classNameAddition": " td",
                "_id": "53737b2942458548067c7a2b",
                "cssAdditions": [
                  {
                    "key": "text-align",
                    "value": "center"
                  }
                ]
              },
              {
                "classNameAddition": " td .active .page_title",
                "_id": "53737b2942458548067c7a2a",
                "cssAdditions": [
                  {
                    "key": "text-align",
                    "value": "center"
                  }
                ]
              },
              {
                "classNameAddition": " .page_title",
                "_id": "53737b2942458548067c7a29",
                "cssAdditions": [
                  {
                    "key": "display",
                    "value": "none"
                  }
                ]
              },
              {
                "classNameAddition": " .number",
                "_id": "53737b2942458548067c7a28",
                "cssAdditions": [
                  {
                    "key": "padding",
                    "value": "5px 10px 5px 10px"
                  }
                ]
              }
            ],
            "staticCSS": [
              {
                "key": "width",
                "value": "100%"
              }
            ],
            "style": {
              "typography": false,
              "background": true,
              "border": true,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "progress_steps_number_container",
            "label": "Page Number Container",
            "classAdditions": [],
            "staticCSS": [
              {
                "key": "display",
                "value": "inline-block"
              },
              {
                "key": "border-radius",
                "value": "13px"
              }
            ],
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": false,
              "padding": false
            }
          },
          {
            "id": "progress_steps_number_container_active",
            "label": "Page Number Container (Active)",
            "classAdditions": [],
            "staticCSS": [],
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": false,
              "padding": false
            }
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
            "classAdditions": [],
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
              }
            ],
            "style": {
              "typography": false,
              "background": true,
              "border": false,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "title",
            "label": "Title",
            "classAdditions": [],
            "staticCSS": [
              {
                "key": "text-align",
                "value": "center"
              }
            ],
            "style": {
              "typography": true,
              "background": false,
              "border": false,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "description",
            "label": "Description",
            "classAdditions": [],
            "staticCSS": [
              {
                "key": "text-align",
                "value": "center"
              }
            ],
            "style": {
              "typography": true,
              "background": false,
              "border": false,
              "margin": true,
              "padding": true
            }
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
            "classAdditions": [],
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
              }
            ],
            "style": {
              "typography": false,
              "background": true,
              "border": true,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "instructions",
            "label": "Instructions",
            "classAdditions": [],
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
              }
            ],
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "title",
            "label": "Title",
            "classAdditions": [],
            "staticCSS": [
              {
                "key": "display",
                "value": "block"
              },
              {
                "key": "border-radius",
                "value": "5px"
              }
            ],
            "style": {
              "typography": true,
              "background": true,
              "border": false,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "input",
            "label": "Input Area",
            "classAdditions": [
              {
                "classNameAddition": " .radio",
                "_id": "53737b2942458548067c7a27",
                "cssAdditions": []
              },
              {
                "classNameAddition": " .checkbox",
                "_id": "53737b2942458548067c7a26",
                "cssAdditions": [
                  {
                    "key": "display",
                    "value": "inline"
                  }
                ]
              },
              {
                "classNameAddition": " .choice",
                "_id": "53737b2942458548067c7a25",
                "cssAdditions": [
                  {
                    "key": "display",
                    "value": "inline"
                  },
                  {
                    "key": "margin-left",
                    "value": "5px"
                  }
                ]
              },
              {
                "classNameAddition": ".repeating",
                "_id": "53737b2942458548067c7a24",
                "cssAdditions": []
              },
              {
                "classNameAddition": ".non_repeating",
                "_id": "53737b2942458548067c7a23",
                "cssAdditions": []
              }
            ],
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
              },
              {
                "key": "line-height",
                "value": "1.4em"
              },
              {
                "key": "display",
                "value": "inline-block"
              },
              {
                "key": "width",
                "value": "100%"
              }
            ],
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "error",
            "label": "Error Highlighting",
            "classAdditions": [],
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
              }
            ],
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "numbering",
            "label": "Numbering",
            "classAdditions": [],
            "staticCSS": [
              {
                "key": "display",
                "value": "inline"
              },
              {
                "key": "float",
                "value": "left"
              },
              {
                "key": "width",
                "value": "15%"
              },
              {
                "key": "text-align",
                "value": "center"
              }
            ],
            "style": {
              "typography": true,
              "background": true,
              "border": false,
              "margin": false,
              "padding": true
            }
          },
          {
            "id": "required",
            "label": "Required Symbol (*)",
            "classAdditions": [],
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
            "style": {
              "typography": true,
              "background": false,
              "border": false,
              "margin": false,
              "padding": false
            }
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
            "classAdditions": [],
            "staticCSS": [
              {
                "key": "text-align",
                "value": "center"
              }
            ],
            "style": {
              "typography": false,
              "background": true,
              "border": true,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "default",
            "label": "Default",
            "classAdditions": [
              {
                "classNameAddition": ".fh_appform_two_button",
                "_id": "53737b2942458548067c7a22",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%!important"
                  }
                ]
              },
              {
                "classNameAddition": ".fh_appform_three_button",
                "_id": "53737b2942458548067c7a21",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "30%!important"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button",
                "_id": "53737b2942458548067c7a20",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "100%"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button.fh_appform_removeInputBtn",
                "_id": "53737b2942458548067c7a1f",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button.fh_appform_addInputBtn",
                "_id": "53737b2942458548067c7a1e",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%"
                  }
                ]
              }
            ],
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
              }
            ],
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "default_active",
            "label": "Default (Active)",
            "classAdditions": [],
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
              }
            ],
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "action",
            "label": "Action",
            "classAdditions": [
              {
                "classNameAddition": ".fh_appform_two_button",
                "_id": "53737b2942458548067c7a1d",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%!important"
                  }
                ]
              },
              {
                "classNameAddition": ".fh_appform_three_button",
                "_id": "53737b2942458548067c7a1c",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "30%!important"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button",
                "_id": "53737b2942458548067c7a1b",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "100%"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button.fh_appform_removeInputBtn",
                "_id": "53737b2942458548067c7a1a",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%!important"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button.fh_appform_addInputBtn",
                "_id": "53737b2942458548067c7a19",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%!important"
                  }
                ]
              }
            ],
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
              }
            ],
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "action_active",
            "label": "Action (Active)",
            "classAdditions": [],
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
              }
            ],
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "cancel",
            "label": "Cancel",
            "classAdditions": [
              {
                "classNameAddition": ".fh_appform_two_button",
                "_id": "53737b2942458548067c7a18",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%"
                  }
                ]
              },
              {
                "classNameAddition": ".fh_appform_three_button",
                "_id": "53737b2942458548067c7a17",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "33.3%"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button",
                "_id": "53737b2942458548067c7a16",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "100%"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button.fh_appform_removeInputBtn",
                "_id": "53737b2942458548067c7a15",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%"
                  }
                ]
              },
              {
                "classNameAddition": ".special_button.fh_appform_addInputBtn",
                "_id": "53737b2942458548067c7a14",
                "cssAdditions": [
                  {
                    "key": "width",
                    "value": "45%"
                  }
                ]
              }
            ],
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
              }
            ],
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": true,
              "padding": true
            }
          },
          {
            "id": "cancel_active",
            "label": "Cancel (Active)",
            "classAdditions": [],
            "staticCSS": [
              {
                "key": "border-radius",
                "value": "5px"
              }
            ],
            "style": {
              "typography": true,
              "background": true,
              "border": true,
              "margin": true,
              "padding": true
            }
          }
        ]
      }
    ]
  },
  "sections": [
    {
      "id": "body",
      "label": "Body",
      "sub_sections": [
        {
          "id": "area",
          "label": "Area",
          "background": {
            "background_color": "rgba(255,255,255,1)"
          }
        }
      ]
    },
    {
      "id": "form",
      "label": "Form",
      "sub_sections": [
        {
          "id": "area",
          "label": "Background",
          "background": {
            "background_color": "rgba(254,253,252,1)"
          },
          "border": {
            "thickness": "none",
            "style": "solid",
            "colour": "rgba(255,255,255,1)"
          }
        },
        {
          "id": "title",
          "label": "Title",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "typography": {
            "fontSize": "20pt",
            "fontFamily": "arial",
            "fontStyle": "bold",
            "fontColour": "rgba(3,2,2,1)"
          }
        },
        {
          "id": "description",
          "label": "Description",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "typography": {
            "fontSize": "14pt",
            "fontFamily": "arial",
            "fontStyle": "italic",
            "fontColour": "rgba(0,0,0,1)"
          }
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
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "typography": {
            "fontSize": "14pt",
            "fontFamily": "arial",
            "fontStyle": "bold",
            "fontColour": "rgba(0,0,0,1)"
          }
        },
        {
          "id": "description",
          "label": "Description",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "typography": {
            "fontSize": "12pt",
            "fontFamily": "arial",
            "fontStyle": "normal",
            "fontColour": "rgba(0,0,0,1)"
          }
        },
        {
          "id": "progress_steps",
          "label": "Page Area",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "background": {
            "background_color": "rgba(255,255,255,1)"
          },
          "border": {
            "thickness": "none",
            "style": "solid",
            "colour": "rgba(2,2,2,1)"
          }
        },
        {
          "id": "progress_steps_number_container",
          "label": "Page Number Container",
          "background": {
            "background_color": "rgba(255,255,255,1)"
          },
          "border": {
            "thickness": "thin",
            "style": "solid",
            "colour": "rgba(0,0,0,1)"
          },
          "typography": {
            "fontSize": "12pt",
            "fontFamily": "arial",
            "fontStyle": "normal",
            "fontColour": "rgba(0,0,0,1)"
          }
        },
        {
          "id": "progress_steps_number_container_active",
          "label": "Page Number Container (Active)",
          "background": {
            "background_color": "rgba(0,0,0,1)"
          },
          "border": {
            "thickness": "thin",
            "style": "solid",
            "colour": "rgba(1,1,1,1)"
          },
          "typography": {
            "fontSize": "12pt",
            "fontFamily": "arial",
            "fontStyle": "normal",
            "fontColour": "rgba(255,254,254,1)"
          }
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
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "background": {
            "background_color": "rgba(255,255,255,1)"
          }
        },
        {
          "id": "title",
          "label": "Title",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "typography": {
            "fontSize": "14pt",
            "fontFamily": "arial",
            "fontStyle": "bold",
            "fontColour": "rgba(0,0,0,1)"
          }
        },
        {
          "id": "description",
          "label": "Description",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "typography": {
            "fontSize": "12pt",
            "fontFamily": "arial",
            "fontStyle": "italic",
            "fontColour": "rgba(0,0,0,1)"
          }
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
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "background": {
            "background_color": "rgba(255,255,255,1)"
          },
          "border": {
            "thickness": "thin",
            "style": "solid",
            "colour": "rgba(2,2,2,1)"
          }
        },
        {
          "id": "instructions",
          "label": "Instructions",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "background": {
            "background_color": "rgba(255,255,255,1)"
          },
          "border": {
            "thickness": "none",
            "style": "solid",
            "colour": "rgba(2,2,2,1)"
          },
          "typography": {
            "fontSize": "12pt",
            "fontFamily": "arial",
            "fontStyle": "normal",
            "fontColour": "rgba(0,0,0,1)"
          }
        },
        {
          "id": "title",
          "label": "Title",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "background": {
            "background_color": "rgba(255,255,255,1)"
          },
          "typography": {
            "fontSize": "14pt",
            "fontFamily": "arial",
            "fontStyle": "normal",
            "fontColour": "rgba(0,0,0,1)"
          }
        },
        {
          "id": "input",
          "label": "Input Area",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "background": {
            "background_color": "rgba(231,230,230,1)"
          },
          "border": {
            "thickness": "thin",
            "style": "solid",
            "colour": "rgba(231,230,230,1)"
          },
          "typography": {
            "fontSize": "12pt",
            "fontFamily": "arial",
            "fontStyle": "normal",
            "fontColour": "rgba(0,0,0,1)"
          }
        },
        {
          "id": "error",
          "label": "Error Highlighting",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "background": {
            "background_color": "rgba(255,0,0,1)"
          },
          "border": {
            "thickness": "thin",
            "style": "solid",
            "colour": "rgba(246,16,16,1)"
          },
          "typography": {
            "fontSize": "11pt",
            "fontFamily": "arial",
            "fontStyle": "normal",
            "fontColour": "rgba(0,0,0,1)"
          }
        },
        {
          "id": "numbering",
          "label": "Numbering",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "background": {
            "background_color": "rgba(255,0,0,0)"
          },
          "typography": {
            "fontSize": "11pt",
            "fontFamily": "arial",
            "fontStyle": "normal",
            "fontColour": "rgba(0,0,0,1)"
          }
        },
        {
          "id": "required",
          "label": "Required Symbol (*)",
          "typography": {
            "fontSize": "8pt",
            "fontFamily": "arial",
            "fontStyle": "bold",
            "fontColour": "rgba(255,0,0,1)"
          }
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
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "background": {
            "background_color": "rgba(250,251,253,1)"
          },
          "border": {
            "thickness": "none",
            "style": "solid",
            "colour": "rgba(2,2,2,1)"
          }
        },
        {
          "id": "default",
          "label": "Default",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "background": {
            "background_color": "rgba(42,114,217,1)"
          },
          "border": {
            "thickness": "none",
            "style": "solid",
            "colour": "rgba(2,2,2,1)"
          },
          "typography": {
            "fontSize": "12pt",
            "fontFamily": "arial",
            "fontStyle": "bold",
            "fontColour": "rgba(0,0,0,1)"
          }
        },
        {
          "id": "default_active",
          "label": "Default (Active)",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "background": {
            "background_color": "rgba(38,104,199,1)"
          },
          "border": {
            "thickness": "none",
            "style": "solid",
            "colour": "rgba(2,2,2,1)"
          },
          "typography": {
            "fontSize": "12pt",
            "fontFamily": "arial",
            "fontStyle": "bold",
            "fontColour": "rgba(0,0,0,1)"
          }
        },
        {
          "id": "action",
          "label": "Action",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "0",
            "bottom": "5",
            "left": "5"
          },
          "background": {
            "background_color": "rgba(42,114,217,1)"
          },
          "border": {
            "thickness": "none",
            "style": "solid",
            "colour": "rgba(2,2,2,1)"
          },
          "typography": {
            "fontSize": "12pt",
            "fontFamily": "arial",
            "fontStyle": "bold",
            "fontColour": "rgba(0,0,0,1)"
          }
        },
        {
          "id": "action_active",
          "label": "Action (Active)",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "0",
            "bottom": "5",
            "left": "5"
          },
          "background": {
            "background_color": "rgba(42,114,217,1)"
          },
          "border": {
            "thickness": "none",
            "style": "solid",
            "colour": "rgba(2,2,2,1)"
          },
          "typography": {
            "fontSize": "12pt",
            "fontFamily": "arial",
            "fontStyle": "bold",
            "fontColour": "rgba(0,0,0,1)"
          }
        },
        {
          "id": "cancel",
          "label": "Cancel",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "background": {
            "background_color": "rgba(252,3,3,1)"
          },
          "border": {
            "thickness": "none",
            "style": "solid",
            "colour": "rgba(2,2,2,1)"
          },
          "typography": {
            "fontSize": "12pt",
            "fontFamily": "arial",
            "fontStyle": "bold",
            "fontColour": "rgba(0,0,0,1)"
          }
        },
        {
          "id": "cancel_active",
          "label": "Cancel (Active)",
          "padding": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "margin": {
            "top": "5",
            "right": "5",
            "bottom": "5",
            "left": "5"
          },
          "background": {
            "background_color": "rgba(252,3,3,1)"
          },
          "border": {
            "thickness": "none",
            "style": "solid",
            "colour": "rgba(2,2,2,1)"
          },
          "typography": {
            "fontSize": "12pt",
            "fontFamily": "arial",
            "fontStyle": "bold",
            "fontColour": "rgba(0,0,0,1)"
          }
        }
      ]
    }
  ],
  "logo": {
    "base64String": "data:image/png;base64,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",
    "height": 52,
    "width": 362
  },
  "css": ".fh_appform_container .fh_appform_body_area{background-color:rgba(255,255,255,1);}.fh_appform_container .fh_appform_form_area{background-color:rgba(254,253,252,1);border:none;}.fh_appform_container .fh_appform_form_title{font-size:20pt;font-family:arial;color:rgba(3,2,2,1);font-weight:bold;font-style:normal;margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;text-align:center;}.fh_appform_container .fh_appform_form_description{font-size:14pt;font-family:arial;color:rgba(0,0,0,1);font-style:italic;font-weight:normal;margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;text-align:center;}.fh_appform_container .fh_appform_page_title{font-size:14pt;font-family:arial;color:rgba(0,0,0,1);font-weight:bold;font-style:normal;margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;text-align:center;width:100%;display:inline-block;}.fh_appform_container .fh_appform_page_description{font-size:12pt;font-family:arial;color:rgba(0,0,0,1);font-weight:normal;font-style:normal;margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;}.fh_appform_container .fh_appform_progress_steps{background-color:rgba(255,255,255,1);border:none;margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;width:100%;}.fh_appform_container .fh_appform_progress_steps td{text-align:center;}.fh_appform_container .fh_appform_progress_steps td .active .page_title{text-align:center;}.fh_appform_container .fh_appform_progress_steps .page_title{display:none;}.fh_appform_container .fh_appform_progress_steps .number{padding:5px 10px 5px 10px;}.fh_appform_container .fh_appform_progress_steps .number_container{font-size:12pt;font-family:arial;color:rgba(0,0,0,1);font-weight:normal;font-style:normal;background-color:rgba(255,255,255,1);border-width:thin;border-style:solid;border-color:rgba(0,0,0,1);display:inline-block;border-radius:13px;}.fh_appform_container .fh_appform_progress_steps td.active .number_container{font-size:12pt;font-family:arial;color:rgba(255,254,254,1);font-weight:normal;font-style:normal;background-color:rgba(0,0,0,1);border-width:thin;border-style:solid;border-color:rgba(1,1,1,1);}.fh_appform_container .fh_appform_section_area{background-color:rgba(255,255,255,1);margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;border-radius:5px;}.fh_appform_container .fh_appform_section_title{font-size:14pt;font-family:arial;color:rgba(0,0,0,1);font-weight:bold;font-style:normal;margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;text-align:center;}.fh_appform_container .fh_appform_section_description{font-size:12pt;font-family:arial;color:rgba(0,0,0,1);font-style:italic;font-weight:normal;margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;text-align:center;}.fh_appform_container .fh_appform_field_area{background-color:rgba(255,255,255,1);border-width:thin;border-style:solid;border-color:rgba(2,2,2,1);margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;border-radius:5px;}.fh_appform_container .fh_appform_field_instructions{font-size:12pt;font-family:arial;color:rgba(0,0,0,1);font-weight:normal;font-style:normal;background-color:rgba(255,255,255,1);border:none;margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;border-radius:5px;}.fh_appform_container .fh_appform_field_title{font-size:14pt;font-family:arial;color:rgba(0,0,0,1);font-weight:normal;font-style:normal;background-color:rgba(255,255,255,1);margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;display:block;border-radius:5px;}.fh_appform_container .fh_appform_field_input{font-size:12pt;font-family:arial;color:rgba(0,0,0,1);font-weight:normal;font-style:normal;background-color:rgba(231,230,230,1);border-width:thin;border-style:solid;border-color:rgba(231,230,230,1);margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;border-radius:5px;line-height:1.4em;display:inline-block;width:100%;}.fh_appform_container .fh_appform_field_input .radio{}.fh_appform_container .fh_appform_field_input .checkbox{display:inline;}.fh_appform_container .fh_appform_field_input .choice{display:inline;margin-left:5px;}.fh_appform_container .fh_appform_field_input.repeating{}.fh_appform_container .fh_appform_field_input.non_repeating{}.fh_appform_container .fh_appform_field_error{font-size:11pt;font-family:arial;color:rgba(0,0,0,1);font-weight:normal;font-style:normal;background-color:rgba(255,0,0,1);border-width:thin;border-style:solid;border-color:rgba(246,16,16,1);margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;border-radius:5px;}.fh_appform_container .fh_appform_field_numbering{font-size:11pt;font-family:arial;color:rgba(0,0,0,1);font-weight:normal;font-style:normal;background-color:rgba(255,0,0,0);padding:5px 5px 5px 5px;display:inline;float:left;width:15%;text-align:center;}.fh_appform_container .fh_appform_field_required:after{font-size:8pt;font-family:arial;color:rgba(255,0,0,1);font-weight:bold;font-style:normal;content:\"*\";vertical-align:top;}.fh_appform_container .fh_appform_button_bar{background-color:rgba(250,251,253,1);border:none;margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;text-align:center;}.fh_appform_container .fh_appform_button_default{font-size:12pt;font-family:arial;color:rgba(0,0,0,1);font-weight:bold;font-style:normal;background-color:rgba(42,114,217,1);border:none;margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;border-radius:5px;}.fh_appform_container .fh_appform_button_default.fh_appform_two_button{width:45%!important;}.fh_appform_container .fh_appform_button_default.fh_appform_three_button{width:30%!important;}.fh_appform_container .fh_appform_button_default.special_button{width:100%;}.fh_appform_container .fh_appform_button_default.special_button.fh_appform_removeInputBtn{width:45%;}.fh_appform_container .fh_appform_button_default.special_button.fh_appform_addInputBtn{width:45%;}.fh_appform_container .fh_appform_button_default:active{font-size:12pt;font-family:arial;color:rgba(0,0,0,1);font-weight:bold;font-style:normal;background-color:rgba(38,104,199,1);border:none;margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;border-radius:5px;}.fh_appform_container .fh_appform_button_action{font-size:12pt;font-family:arial;color:rgba(0,0,0,1);font-weight:bold;font-style:normal;background-color:rgba(42,114,217,1);border:none;margin:5px 0px 5px 5px;padding:5px 5px 5px 5px;border-radius:5px;}.fh_appform_container .fh_appform_button_action.fh_appform_two_button{width:45%!important;}.fh_appform_container .fh_appform_button_action.fh_appform_three_button{width:30%!important;}.fh_appform_container .fh_appform_button_action.special_button{width:100%;}.fh_appform_container .fh_appform_button_action.special_button.fh_appform_removeInputBtn{width:45%!important;}.fh_appform_container .fh_appform_button_action.special_button.fh_appform_addInputBtn{width:45%!important;}.fh_appform_container .fh_appform_button_action:active{font-size:12pt;font-family:arial;color:rgba(0,0,0,1);font-weight:bold;font-style:normal;background-color:rgba(42,114,217,1);border:none;margin:5px 0px 5px 5px;padding:5px 5px 5px 5px;border-radius:5px;}.fh_appform_container .fh_appform_button_cancel{font-size:12pt;font-family:arial;color:rgba(0,0,0,1);font-weight:bold;font-style:normal;background-color:rgba(252,3,3,1);border:none;margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;border-radius:5px;}.fh_appform_container .fh_appform_button_cancel.fh_appform_two_button{width:45%;}.fh_appform_container .fh_appform_button_cancel.fh_appform_three_button{width:33.3%;}.fh_appform_container .fh_appform_button_cancel.special_button{width:100%;}.fh_appform_container .fh_appform_button_cancel.special_button.fh_appform_removeInputBtn{width:45%;}.fh_appform_container .fh_appform_button_cancel.special_button.fh_appform_addInputBtn{width:45%;}.fh_appform_container .fh_appform_button_cancel:active{font-size:12pt;font-family:arial;color:rgba(0,0,0,1);font-weight:bold;font-style:normal;background-color:rgba(252,3,3,1);border:none;margin:5px 5px 5px 5px;padding:5px 5px 5px 5px;border-radius:5px;}.fh_appform_container .fh_appform_logo{background-image:url(\"data:image/png;base64,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\");height:52px;width:362px;background-position:center;background-repeat:no-repeat;width:100%;display:inline-block;}.fh_appform_hidden{display:none;}.fh_appform_button_bar{text-align: center;}.fh_appform_field_button_bar{text-align: right;}.fh_appform_field_input_container.repeating{width:70%;float:left;}.fh_appform_field_input_container.non_repeating{width: 90%;float: left;text-align: center;margin: 0px 0px 0px 5px;padding: 0px 0px 0px 0px;}",
  "lastUpdated": "2014-05-14T14:17:09.743Z"
};


  var generatedCSS = "";
  var generationFailed = {"failed": false, "failedSections": []};

  function findSection(sectionId, subSectionId) {
    var themeSections = themeJSON.sections;
    var foundThemeSections = themeSections.filter(function (themeSection) {
      return themeSection.id == sectionId;
    });

    if (foundThemeSections.length > 0) {
      var foundThemeSubSections = foundThemeSections[0].sub_sections.filter(function (themeSubSection) {
        return themeSubSection.id == subSectionId;
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

    function parseStyleNumber(numToValidate){
      if(numToValidate !== null && !isNaN(numToValidate)){
        var numToValidateInt = parseInt(numToValidate);
        if(numToValidateInt > -1){
          return numToValidate;
        } else {
          return "0";   //Margin and padding must be > 0
        }
      } else {
        return null;
      }
    }

    function generateSpacingCSS(type, spacingJSON){
      spacingJSON = spacingJSON ? spacingJSON : {};
      //top, right, bottom left
      var marginCSS = "";
      var marginValCSS = "";
      var marginUnit = "px";
      var parsedTop = parseStyleNumber(spacingJSON.top);
      var parsedRight = parseStyleNumber(spacingJSON.right);
      var parsedBottom = parseStyleNumber(spacingJSON.bottom);
      var parsedLeft = parseStyleNumber(spacingJSON.left);

      //Must have all 4 values assigned
      if(parsedTop !== null && parsedRight !== null && parsedBottom !== null && parsedLeft !== null){
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
        "background": function (backgroundJSON) {
          if (backgroundJSON.background_color) {
            return "background-color:" + backgroundJSON.background_color + ";";
          } else {
            return null;
          }
        },
        "typography": function (fontJSON) {
          var fontCSS = "";

          if (fontJSON.fontSize) {
            fontCSS = fontCSS.concat("font-size:" + fontJSON.fontSize + ";");
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
        "border": function (borerJSON) {
          var borderStr = "";

          if (borerJSON.thickness) {
            if (borerJSON.thickness == "none") {
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
        "margin": function(marginJSON){
          return generateSpacingCSS("margin", marginJSON);
        },
        "padding": function(paddingJSON){
          return generateSpacingCSS("padding", paddingJSON);
        }
      };

      if (styleDefinition[styleType] === true) {
        var subSectionStyleDefinition = findSection(sectionId, subSectionId);
        if (subSectionStyleDefinition == null) {
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
    } else if (marginCSS === null){
      console.log("Margin css was null for section ", sectionId, " and subsection ", subSectionId);
      return null;
    } else if (paddingCSS === null){
      console.log("Padding css was null for section ", sectionId, " and subsection ", subSectionId);
      return null;
    }

    return typographyCSS + backgroundCSS + borderCSS + marginCSS + paddingCSS;
  }

  function generateCSSClassName(sectionId, subSectionId, className) {
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

    if (logoCSS == null) {
      generatedCSS = null;
      generationFailed.failed = true;
      generationFailed.failedSections.push({"section": "logo", "subSection": "logo" });
      return;
    }

    styleStructure.sections.forEach(function (themeSection) {
      var sectionId = themeSection.id;

      var subSections = themeSection.sub_sections ? themeSection.sub_sections : [];
      subSections.forEach(function (subSection) {
        var subSectionId = subSection.id;
        var subSectionStyle = subSection.style;

        var cssGenerated = generateCSS(sectionId, subSectionId, subSectionStyle);
        if (cssGenerated == null) {
          console.log("Error generating css for section: ", sectionId, " and subsection: ", subSectionId);
          generatedCSS = null;
          generationFailed.failed = true;
          generationFailed.failedSections.push({"section": sectionId, "subSection": subSectionId });
          return;
        }

        var staticCSS = generateStaticCSS(subSection.staticCSS);
        if (staticCSS == null) {
          console.log("Error getting statics css for section: ", sectionId, " and subsection: ", subSectionId);
          generatedCSS = null;
          generationFailed.failed = true;
          generationFailed.failedSections.push({"section": sectionId, "subSection": subSectionId });
          return;
        }

        var cssClassName = generateCSSClassName(sectionId, subSectionId, subSection.class_name);
        if (cssClassName == null) {
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

    generatedCSS += ".fh_appform_hidden{display:none;}.fh_appform_button_bar{text-align: center;}.fh_appform_field_button_bar{text-align: right;}.fh_appform_field_input_container.repeating{width:70%;float:left;}.fh_appform_field_input_container.non_repeating{width: 90%;float: left;margin: 0px 0px 0px 5px;padding: 0px 0px 0px 0px;}";

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

