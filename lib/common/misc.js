

function generatePageAndFieldRefs(formDefinition){
  var pageRef = {};
  var fieldRef = {};

  for(var pageIndex = 0; pageIndex < formDefinition.pages.length; pageIndex++){
    pageRef[formDefinition.pages[pageIndex]._id] = pageIndex;

    for(var fieldIndex = 0; fieldIndex < formDefinition.pages[pageIndex].fields.length; fieldIndex++){
      fieldRef[formDefinition.pages[pageIndex].fields[fieldIndex]._id] = {};
      fieldRef[formDefinition.pages[pageIndex].fields[fieldIndex]._id].page = pageIndex;
      fieldRef[formDefinition.pages[pageIndex].fields[fieldIndex]._id].field = fieldIndex;
    }
  }

  return {"pageRef" : pageRef, "fieldRef": fieldRef};
}


module.exports.generatePageAndFieldRefs = generatePageAndFieldRefs;