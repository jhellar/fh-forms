//Checking if the field is a file type.
//Currently only file, photo and signature are file types.
function isFileType(type) {
  return(type === 'file' || type === 'photo' || type === 'signature');
}

//Checking if the field is a barcode type.
function isBarcodeType(type) {
  return(type === 'barcode');
}

module.exports = {
  isFileType: isFileType,
  isBarcodeType: isBarcodeType
};
