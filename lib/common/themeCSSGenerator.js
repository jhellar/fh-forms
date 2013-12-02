
module.exports = function(themeJSON){


  //Generate fh_appform_logo
  //Generate fh_appform_button_navigation
  //Generate fh_appform_button_action
  //Generate fh_appform_button_cancel

  //Generate fh_appform_navigation
  //Generate fh_appform_header
  //Generate fh_appform_body
  //Generate fh_appform_form
  //Generate fh_appform_field_title
  //Generate fh_appform_field_area
  //Generate fh_appform_field_input
  //Generate fh_appform_field_instructions
  //Generate fh_appform_title
  //Generate fh_appform_description

  var FH_APPFORM_PREFIX = "fh_appform_";

  var generatedCSSJSON = {
    "fh_appform_logo" : "",
    "fh_appform_button_navigation" : "",
    "fh_appform_button_action" : "",
    "fh_appform_button_cancel" : "",
    "fh_appform_navigation" : "",
    "fh_appform_header" : "",
    "fh_appform_body" : "",
    "fh_appform_form" : "",
    "fh_appform_field_title": "",
    "fh_appform_field_area": "",
    "fh_appform_field_input": "",
    "fh_appform_field_instructions": "",
    "fh_appform_title": "",
    "fh_appform_description": ""
  }
  //Convienience Functions
  function getBackgroundColour(colourField){
    return "background-color:" + colourField + ";"
  }

  function getButtonFont(){
    var buttonCSS = "";
    var buttonFontDetails = themeJSON.typography.buttons;
    if(buttonFontDetails){
      buttonCSS.append("font-size:" + buttonFontDetails.fontSize + ";");
      buttonCSS.append("font-family:" + buttonFontDetails.fontFamily + ";");
      buttonCSS.append("color:" + buttonFontDetails.fontColour + ";");

      if(buttonFontDetails.fontStyle === "italic"){
        buttonCSS.append("font-style:" + buttonFontDetails.fontStyle + ";");
        buttonCSS.append("font-weight:normal;");
      } else if (buttonFontDetails.fontStyle === "bold") {
        buttonCSS.append("font-weight:" + buttonFontDetails.fontStyle + ";");
        buttonCSS.append("font-style:normal;");
      } else {
        buttonCSS.append("font-weight:normal;");
        buttonCSS.append("font-style:normal;");
      }
    }

    return buttonCSS;
  }

  function fh_appform_logo(){
    var logoStr = "." + FH_APPFORM_PREFIX + "logo{background-image:url(\"data:image/png;base64,"
    if(themeJSON.logo){
      logoStr.append(themeJSON.logo.toString());
    }

    logoStr.append("\")}");
    return logoStr;
  }
  function fh_appform_button_navigation(){
    var navButtonStr = ".fh_appform_button_navigation{";

    if(themeJSON.colours.buttons.navigation){
      navButtonStr.append(this.getBackgroundColour(themeJSON.colours.buttons.navigation));
    }

    navButtonStr.append(this.getButtonFont());

    navButtonStr.append("}");
  }
  function fh_appform_button_action(){
    var navButtonStr = ".fh_appform_button_action{";

    if(themeJSON.colours.buttons.action){
      navButtonStr.append(this.getBackgroundColour(themeJSON.colours.buttons.action));
    }

    navButtonStr.append(this.getButtonFont());

    navButtonStr.append("}");
  }
  function fh_appform_button_cancel(){
    var navButtonStr = ".fh_appform_button_cancel{";

    if(themeJSON.colours.buttons.cancel){
      navButtonStr.append(this.getBackgroundColour(themeJSON.colours.buttons.cancel));
    }

    navButtonStr.append(this.getButtonFont());

    navButtonStr.append("}");
  }
  function fh_appform_navigation(){
    var navStr = ".fh_appform_navigation{";


    navStr.append("}");
  }
  function fh_appform_header(){}
  function fh_appform_body(){}
  function fh_appform_form(){}
  function fh_appform_field_title(){}
  function fh_appform_field_area(){}
  function fh_appform_field_input(){}
  function fh_appform_field_instructions(){}
  function fh_appform_title(){}
  function fh_appform_description(){}



  for(var css_class in generatedCSSJSON){
    if(this[css_class]){
      var generatedCSSString = this[css_class];
      generatedCSSJSON[css_class] = generatedCSSString;
    } else {
      return null;
    }
  }

  var fullCSSString = "";

  for(var css_class in generatedCSSJSON){
    fullCSSString.append(generatedCSSJSON[css_class]);
  }

  return
}