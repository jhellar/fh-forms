
/**
 * endsWith - Utility function to determine if a string ends with a specified string
 *
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
 * @param  {string} subjectString The string to search in
 * @param  {string} searchString  The string to search for
 * @param  {number} position      The position in the string to start searching
 * @return {boolean}              true/false
 */
module.exports = function endsWith(subjectString, searchString, position){
  if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
    position = subjectString.length;
  }
  position -= searchString.length;
  var lastIndex = subjectString.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
