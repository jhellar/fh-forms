var _ = require('underscore');

function getSectionMap(form) {
  var sectionId = null;
  var fieldSectionMapping = {};

  _.each(form.pages, function(page) {

    //Resetting the section ID. Sections never cross pages.
    sectionId = null;

    _.each(page.fields, function(field) {
      if (field.type === "sectionBreak") {
        //If the field is a section break, then we are starting a new section
        sectionId = field._id.toString();
      } else if (field.type !== "pageBreak") {
        //It's not a page or section break field.
        //Assign the section id to the section map
        fieldSectionMapping[field._id.toString()] = sectionId;
      }
    });
  });

  return fieldSectionMapping;
}

module.exports = getSectionMap;