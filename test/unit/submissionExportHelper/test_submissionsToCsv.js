var proxyquire = require('proxyquire');
var assert = require('assert');
var _ = require('underscore');
var util = require('util');

//Some test data
var mockSubmissions = require('../../Fixtures/mockSubmissions.js');

var complexSubmission1 = mockSubmissions.complexSubmission1;
var complexSubmissionOrder = mockSubmissions.complexSubmissionOrder;

var exportHelper = require('../../../lib/impl/submissionExportHelper/submissionsToCSV.js');

module.exports = {
  "it_should_export_csv_for_basic_submission" : function(finish) {
    var sub = [{
      "formId": "simple1",
      "formFields": [{
        "fieldId": {
          "name": 'single "text" field',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000003",
          "repeating": false
        },
        "fieldValues": [
          "test, entry"
        ]
      }],
      "formSubmittedAgainst":{
        "name" : "A Form",
        "pages":[{
          "fields":[
            {
              "name": 'single text field',
              "required": false,
              "type": "text",
              "_id": "52a65af9a43843f938000003",
              "repeating": false
            }]
        }]
      }
    }];


    exportHelper.submissionsToCSV({
      fieldHeader: "name",
      submissions: sub,
      downloadUrl: 'dummyurl:fileId'
    }, function(err, csvs){
      assert.ok(!err);
      var csvKeys = Object.keys(csvs);
      var lines = csvs[csvKeys[0]].split('\r\n');
      assert.equal(lines[0], 'single text field', "Expected header to be '\"single \"\"text\"\" field', not: " + util.inspect(lines[0]));
      assert.equal(lines[1], '"test, entry"', "Expected first line to be 'test entry', not: " + lines[1]);
      finish();
    });
  },
  "it_should_export_csv_for_basic_submission_using_field_codes":  function(finish) {
    var sub = [{
      "formId": "simple1",
      "formFields": [{
        "fieldId": {
          "name": 'single "text" field',
          "fieldCode": "fieldCodeText",
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000003",
          "repeating": false
        },
        "fieldValues": [
          "test, entry"
        ]
      }],
      "formSubmittedAgainst":{
        "name" : "A Form",
        "pages":[{
          "fields":[
            {
              "name": 'single text field',
              "fieldCode": "fieldCodeText",
              "required": false,
              "type": "text",
              "_id": "52a65af9a43843f938000003",
              "repeating": false
            }]
        }]
      }
    }];

    exportHelper.submissionsToCSV({
      fieldHeader: "fieldCode",
      submissions: sub,
      downloadUrl: 'dummyurl:fileId'
    }, function(err, csvs){
      assert.ok(!err);
      var csvKeys = Object.keys(csvs);
      var lines = csvs[csvKeys[0]].split('\r\n');
      assert.equal(lines[0], 'fieldCodeText', "Expected header to be 'fieldCodeText', not: " + util.inspect(lines[0]));
      assert.equal(lines[1], '"test, entry"', "Expected first line to be 'test entry', not: " + lines[1]);
      finish();
    });
  },
  "it_should_export_csv_for_basic_submission_no_field_code": function(finish) {
    var sub = [{
      "formId": "simple1",
      "formFields": [{
        "fieldId": {
          "name": 'single "text" field',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000003",
          "repeating": false
        },
        "fieldValues": [
          "test, entry"
        ]
      }],
      "formSubmittedAgainst":{
        "name" : "A Form",
        "pages":[{
          "fields":[
            {
              "name": 'single text field',
              "required": false,
              "type": "text",
              "_id": "52a65af9a43843f938000003",
              "repeating": false
            }]
        }]
      }
    }];

    exportHelper.submissionsToCSV({
      fieldHeader: "fieldCode",
      submissions: sub,
      downloadUrl: 'dummyurl:fileId'
    }, function(err, csvs){
      assert.ok(!err);
      var csvKeys = Object.keys(csvs);
      var lines = csvs[csvKeys[0]].split('\r\n');
      assert.equal(lines[0], 'single text field', "Expected header to be '\"single \"\"text\"\" field', not: " + util.inspect(lines[0]));
      assert.equal(lines[1], '"test, entry"', "Expected first line to be 'test entry', not: " + lines[1]);
      finish();
    });
  },
  "it_should_export_csv_file_url_and_file_name": function(finish){

    var formSubmittedAgainst = {
      "name" : "A Form",
      "pages":[{
        "fields":[
          {
            "name": 'textField1',
            "required": false,
            "type": "text",
            "_id": "52a65af9a43843f938000003",
            "repeating": false
          },
          {
            "name": 'fileField1',
            "required": false,
            "type": "file",
            "_id": "52a65af9a43843f938000004",
            "repeating": false
          },{
            "name": 'textField2',
            "required": false,
            "type": "text",
            "_id": "52a65af9a43843f938000005",
            "repeating": false
          }]
      }]
    };

    var sub = [{
      "formId": "simple1",
      "formFields": [{
        "fieldId": {
          "name": 'textField1',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000003",
          "repeating": false
        },
        "fieldValues": [
          "testEntry1"
        ]
      },  {
        "fieldId": {
          "name": 'fileField1',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000004",
          "repeating": false
        },
        "fieldValues": [
          {
            contentType: "binary",
            downloadUrl: "/api/v2/forms/submission/file/5448c0119004f04514000001",
            fieldId: "5448bf330f6a34bd449f2713",
            fileName: "file1.png",
            fileSize: 567941,
            fileType: "image/png",
            fileUpdateTime: 1414000943000,
            groupId: "5448c0119004f04514000001",
            hashName: "filePlaceHolder72e9d039ff0afec1d0a6a4be797c4402"
          }
        ]
      },{
        "fieldId": {
          "name": 'textField2',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000005",
          "repeating": false
        },
        "fieldValues": [
          "testEntry2"
        ]
      }],
      "formSubmittedAgainst": formSubmittedAgainst
    }];

    exportHelper.submissionsToCSV({
      fieldHeader: "fieldCode",
      submissions: sub,
      downloadUrl: 'dummyurl:fileId'
    }, function(err, csvs){
      assert.ok(!err);
      var csvKeys = Object.keys(csvs);
      var lines = csvs[csvKeys[0]].split('\r\n');
      assert.equal(lines[0], 'textField1,fileField1-name,fileField1-url,textField2', "Expected header to be 'textField1,fileField1-name,fileField1-url,textField2', not: " + util.inspect(lines[0]));
      assert.equal(lines[1], 'testEntry1,file1.png,dummyurl5448c0119004f04514000001,testEntry2', "Expected first line to be 'testEntry1,file1.png,dummyurl5448c0119004f04514000001,testEntry2', not: " + lines[1]);
      finish();
    });
  },
  "it_should_export_csv_file_url_and_file_name_repeating_file": function(finish){

    var formSubmittedAgainst = {
      "name" : "A Form",
      "pages":[{
        "fields":[
          {
            "name": 'textField1',
            "required": false,
            "type": "text",
            "_id": "52a65af9a43843f938000003",
            "repeating": false
          },
          {
            "name": 'fileField1',
            "required": false,
            "type": "file",
            "_id": "52a65af9a43843f938000004",
            "repeating": true,
            "fieldOptions":{
              "definition":{
                "maxRepeat":2,
                "minRepeat":1
              }
            }
          },{
            "name": 'textField2',
            "required": false,
            "type": "text",
            "_id": "52a65af9a43843f938000005",
            "repeating": false
          }]
      }]
    };

    var sub = [{
      "formId": "simple1",
      "formFields": [{
        "fieldId": {
          "name": 'textField1',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000003",
          "repeating": false
        },
        "fieldValues": [
          "testEntry1"
        ]
      },  {
        "fieldId": {
          "name": 'fileField1',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000004",
          "repeating": false
        },
        "fieldValues": [
          {
            contentType: "binary",
            downloadUrl: "/api/v2/forms/submission/file/5448c0119004f04514000001",
            fieldId: "5448bf330f6a34bd449f2713",
            fileName: "file1.png",
            fileSize: 567941,
            fileType: "image/png",
            fileUpdateTime: 1414000943000,
            groupId: "5448c0119004f04514000001",
            hashName: "filePlaceHolder72e9d039ff0afec1d0a6a4be797c4402"
          },{
            contentType: "binary",
            downloadUrl: "/api/v2/forms/submission/file/5448c0119004f04514000002",
            fieldId: "5448bf330f6a34bd449f2713",
            fileName: "file2.png",
            fileSize: 567941,
            fileType: "image/png",
            fileUpdateTime: 1414000943000,
            groupId: "5448c0119004f04514000002",
            hashName: "filePlaceHolder72e9d039ff0afec1d0a6a4be797c4403"
          }
        ]
      },{
        "fieldId": {
          "name": 'textField2',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000005",
          "repeating": false
        },
        "fieldValues": [
          "testEntry2"
        ]
      }],
      "formSubmittedAgainst": formSubmittedAgainst
    }];

    exportHelper.submissionsToCSV({
      fieldHeader: "fieldCode",
      submissions: sub,
      downloadUrl: 'dummyurl:fileId'
    }, function(err, csvs){
      assert.ok(!err);
      var csvKeys = Object.keys(csvs);
      var lines = csvs[csvKeys[0]].split('\r\n');
      assert.equal(lines[0], 'textField1,fileField1-1-name,fileField1-1-url,fileField1-2-name,fileField1-2-url,textField2', "Expected header to be 'textField1,fileField1-1-name,fileField1-1-url,fileField1-2-name,fileField1-2-url,textField2', not: " + util.inspect(lines[0]));
      assert.equal(lines[1], 'testEntry1,file1.png,dummyurl5448c0119004f04514000001,file2.png,dummyurl5448c0119004f04514000002,testEntry2', "Expected first line to be 'testEntry1,file1.png,dummyurl5448c0119004f04514000001,file2.png,dummyurl5448c0119004f04514000002,testEntry2', not: " + lines[1]);
      finish();
    });
  },
  "it_should_export_csv_file_url_and_file_name_repeating_file_no_entry": function(finish){

    var formSubmittedAgainst = {
      "name" : "A Form",
      "pages":[{
        "fields":[
          {
            "name": 'textField1',
            "required": false,
            "type": "text",
            "_id": "52a65af9a43843f938000003",
            "repeating": false
          },
          {
            "name": 'fileField1',
            "required": false,
            "type": "file",
            "_id": "52a65af9a43843f938000004",
            "repeating": true,
            "fieldOptions":{
              "definition":{
                "maxRepeat":2,
                "minRepeat":1
              }
            }
          },{
            "name": 'textField2',
            "required": false,
            "type": "text",
            "_id": "52a65af9a43843f938000005",
            "repeating": false
          }]
      }]
    };

    var sub = [{
      "formId": "simple1",
      "formFields": [{
        "fieldId": {
          "name": 'textField1',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000003",
          "repeating": false
        },
        "fieldValues": [
          "testEntry1"
        ]
      },  {
        "fieldId": {
          "name": 'fileField1',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000004",
          "repeating": false
        },
        "fieldValues": [
          {
            contentType: "binary",
            downloadUrl: "/api/v2/forms/submission/file/5448c0119004f04514000001",
            fieldId: "5448bf330f6a34bd449f2713",
            fileName: "file1.png",
            fileSize: 567941,
            fileType: "image/png",
            fileUpdateTime: 1414000943000,
            groupId: "5448c0119004f04514000001",
            hashName: "filePlaceHolder72e9d039ff0afec1d0a6a4be797c4402"
          }
        ]
      },{
        "fieldId": {
          "name": 'textField2',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000005",
          "repeating": false
        },
        "fieldValues": [
          "testEntry2"
        ]
      }],
      "formSubmittedAgainst": formSubmittedAgainst
    }];

    exportHelper.submissionsToCSV({
      fieldHeader: "fieldCode",
      submissions: sub,
      downloadUrl: 'dummyurl:fileId'
    }, function(err, csvs){
      assert.ok(!err);
      var csvKeys = Object.keys(csvs);
      var lines = csvs[csvKeys[0]].split('\r\n');
      assert.equal(lines[0], 'textField1,fileField1-1-name,fileField1-1-url,fileField1-2-name,fileField1-2-url,textField2', "Expected header to be 'textField1,fileField1-1-name,fileField1-1-url,fileField1-2-name,fileField1-2-url,textField2', not: " + util.inspect(lines[0]));
      assert.equal(lines[1], 'testEntry1,file1.png,dummyurl5448c0119004f04514000001,,,testEntry2', "Expected first line to be 'testEntry1,file1.png,dummyurl5448c0119004f04514000001,,,testEntry2', not: " + lines[1]);
      finish();
    });
  },
  "it_should_export_csv_barcode_format_and_text": function(finish){

    var formSubmittedAgainst = {
      "name" : "A Form",
      "pages":[{
        "fields":[
          {
            "name": 'textField1',
            "required": false,
            "type": "text",
            "_id": "52a65af9a43843f938000003",
            "repeating": false
          },
          {
            "name": 'barcodeField1',
            "required": false,
            "type": "barcode",
            "_id": "52a65af9a43843f938000004",
            "repeating": false
          },{
            "name": 'textField2',
            "required": false,
            "type": "text",
            "_id": "52a65af9a43843f938000005",
            "repeating": false
          }]
      }]
    };

    var sub = [{
      "formId": "simple1",
      "formFields": [{
        "fieldId": {
          "name": 'textField1',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000003",
          "repeating": false
        },
        "fieldValues": [
          "testEntry1"
        ]
      },  {
        "fieldId": {
          "name": 'barcodeField1',
          "required": false,
          "type": "barcode",
          "_id": "52a65af9a43843f938000004",
          "repeating": false
        },
        "fieldValues": [
          {
            text:"barcodeValue",
            format: "barcodeFormat"
          }
        ]
      },{
        "fieldId": {
          "name": 'textField2',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000005",
          "repeating": false
        },
        "fieldValues": [
          "testEntry2"
        ]
      }],
      "formSubmittedAgainst": formSubmittedAgainst
    }];

    exportHelper.submissionsToCSV({
      fieldHeader: "fieldCode",
      submissions: sub,
      downloadUrl: 'dummyurl:fileId'
    }, function(err, csvs){
      assert.ok(!err);
      var csvKeys = Object.keys(csvs);
      var lines = csvs[csvKeys[0]].split('\r\n');
      assert.equal(lines[0], 'textField1,barcodeField1-format,barcodeField1-text,textField2', "Expected header to be 'textField1,barcodeField1-format,barcodeField1-text,textField2', not: " + util.inspect(lines[0]));
      assert.equal(lines[1], 'testEntry1,barcodeFormat,barcodeValue,testEntry2', "Expected first line to be 'testEntry1,file1.png,dummyurl5448c0119004f04514000001,testEntry2', not: " + lines[1]);
      finish();
    });
  },
  "it_should_export_csv_barcode_format_and_text_name_repeating_barcode": function(finish){

    var formSubmittedAgainst = {
      "name" : "A Form",
      "pages":[{
        "fields":[
          {
            "name": 'textField1',
            "required": false,
            "type": "text",
            "_id": "52a65af9a43843f938000003",
            "repeating": false
          },
          {
            "name": 'barcodeField1',
            "required": false,
            "type": "barcode",
            "_id": "52a65af9a43843f938000004",
            "repeating": true,
            "fieldOptions":{
              "definition":{
                "maxRepeat":2,
                "minRepeat":1
              }
            }
          },{
            "name": 'textField2',
            "required": false,
            "type": "text",
            "_id": "52a65af9a43843f938000005",
            "repeating": false
          }]
      }]
    };

    var sub = [{
      "formId": "simple1",
      "formFields": [{
        "fieldId": {
          "name": 'textField1',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000003",
          "repeating": false
        },
        "fieldValues": [
          "testEntry1"
        ]
      },  {
        "fieldId": {
          "name": 'barcodeField1',
          "required": false,
          "type": "barcode",
          "_id": "52a65af9a43843f938000004",
          "repeating": true
        },
        "fieldValues": [
          {
            format: "barcodeFormat1",
            text: "barcodeValue1"
          },{
            format: "barcodeFormat2",
            text: "barcodeValue2"
          }
        ]
      },{
        "fieldId": {
          "name": 'textField2',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000005",
          "repeating": false
        },
        "fieldValues": [
          "testEntry2"
        ]
      }],
      "formSubmittedAgainst": formSubmittedAgainst
    }];

    exportHelper.submissionsToCSV({
      fieldHeader: "fieldCode",
      submissions: sub,
      downloadUrl: 'dummyurl:fileId'
    }, function(err, csvs){
      assert.ok(!err);
      var csvKeys = Object.keys(csvs);
      var lines = csvs[csvKeys[0]].split('\r\n');
      assert.equal(lines[0], 'textField1,barcodeField1-1-format,barcodeField1-1-text,barcodeField1-2-format,barcodeField1-2-text,textField2', "Expected header to be 'textField1,barcodeField1-1-format,barcodeField1-1-text,barcodeField1-2-format,barcodeField1-2-text,textField2', not: " + util.inspect(lines[0]));
      assert.equal(lines[1], 'testEntry1,barcodeFormat1,barcodeValue1,barcodeFormat2,barcodeValue2,testEntry2', "Expected first line to be 'testEntry1,barcodeFormat1,barcodeValue1,barcodeFormat2,barcodeValue2,testEntry2', not: " + lines[1]);
      finish();
    });
  },
  "it_should_export_csv_barcode_format_and_text_repeating_barcode_no_entry": function(finish){

    var formSubmittedAgainst = {
      "name" : "A Form",
      "pages":[{
        "fields":[
          {
            "name": 'textField1',
            "required": false,
            "type": "text",
            "_id": "52a65af9a43843f938000003",
            "repeating": false
          },
          {
            "name": 'barcodeField1',
            "required": false,
            "type": "barcode",
            "_id": "52a65af9a43843f938000004",
            "repeating": true,
            "fieldOptions":{
              "definition":{
                "maxRepeat":2,
                "minRepeat":1
              }
            }
          },{
            "name": 'textField2',
            "required": false,
            "type": "text",
            "_id": "52a65af9a43843f938000005",
            "repeating": false
          }]
      }]
    };

    var sub = [{
      "formId": "simple1",
      "formFields": [{
        "fieldId": {
          "name": 'textField1',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000003",
          "repeating": false
        },
        "fieldValues": [
          "testEntry1"
        ]
      },  {
        "fieldId": {
          "name": 'barcodeField1',
          "required": false,
          "type": "barcode",
          "_id": "52a65af9a43843f938000004",
          "repeating": true
        },
        "fieldValues": [
          {
            format: "barcodeFormat",
            text: "barcodeValue"
          }
        ]
      },{
        "fieldId": {
          "name": 'textField2',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000005",
          "repeating": false
        },
        "fieldValues": [
          "testEntry2"
        ]
      }],
      "formSubmittedAgainst": formSubmittedAgainst
    }];

    exportHelper.submissionsToCSV({
      fieldHeader: "fieldCode",
      submissions: sub,
      downloadUrl: 'dummyurl:fileId'
    }, function(err, csvs){
      assert.ok(!err);
      var csvKeys = Object.keys(csvs);
      var lines = csvs[csvKeys[0]].split('\r\n');
      assert.equal(lines[0], 'textField1,barcodeField1-1-format,barcodeField1-1-text,barcodeField1-2-format,barcodeField1-2-text,textField2', "Expected header to be 'textField1,barcodeField1-1-format,barcodeField1-1-text,barcodeField1-2-format,barcodeField1-2-text,textField2', not: " + util.inspect(lines[0]));
      assert.equal(lines[1], 'testEntry1,barcodeFormat,barcodeValue,,,testEntry2', "Expected first line to be 'testEntry1,barcodeFormat,barcodeValue,,,testEntry2', not: " + lines[1]);
      finish();
    });
  },
  "it_should_export_csv_with_null_value_in_submission": function(finish) {
    var sub = [{
      "formId": "simple1withnull",
      "formFields": [{
        "fieldId": {
          "name": 'single "text" field',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000003",
          "repeating": false
        },
        "fieldValues": [
          null
        ]
      }],
      "formSubmittedAgainst":{
        "name" : "A Form",
        "pages":[{
          "fields":[
            {
              "name": 'single text field',
              "required": false,
              "type": "text",
              "_id": "52a65af9a43843f938000003",
              "repeating": false
            }]
        }]
      }
    }];

    exportHelper.submissionsToCSV({
      fieldHeader: "name",
      submissions: sub,
      downloadUrl: 'dummyurl:fileId'
    }, function(err, csvs){
      assert.ok(!err);
      var csvKeys = Object.keys(csvs);
      var lines = csvs[csvKeys[0]].split('\r\n');
      assert.equal(lines[0], 'single text field', "Expected header to be '\"single \"\"text\"\" field', not: " + util.inspect(lines[0]));
      assert.equal(lines[1], '', "Expected first line to be '' (empty string), not: " + lines[1]);
      finish();
    });
  },
  "it_should_export_multiple_submissions_with_different_levels_of_repitition": function(finish){
    var sub = [{
      "formId": "simple1withchangingrepitition",
      "formFields": [{
        "fieldId": {
          "name": 'single text field',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000003",
          "repeating": false
        },
        "fieldValues": [
          "text1Sub1"
        ]
      }],
      "formSubmittedAgainst":{
        "name" : "A Form",
        "pages":[{
          "fields":[
            {
              "name": 'single text field',
              "required": false,
              "type": "text",
              "_id": "52a65af9a43843f938000003",
              "repeating": false
            }]
        }]
      }
    }, {
      "formId": "simple1withchangingrepitition",
      "formFields": [{
        "fieldId": {
          "name": 'single text field',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000003",
          "repeating": true,
          "fieldOptions":{
            "definition":{
              "maxRepeat":4,
              "minRepeat":2
            }
          }
        },
        "fieldValues": [
          "text1Sub2",
          "text2Sub2",
          "text3Sub2",
          "text4Sub2"
        ]
      }],
      "formSubmittedAgainst":{
        "name" : "A Form",
        "pages":[{
          "fields":[
            {
              "name": 'single text field',
              "required": false,
              "type": "text",
              "_id": "52a65af9a43843f938000003",
              "repeating": true,
              "fieldOptions":{
                "definition":{
                  "maxRepeat":4,
                  "minRepeat":2
                }
              }
            }]
        }]
      }
    }, {
      "formId": "simple1withchangingrepitition",
      "formFields": [{
        "fieldId": {
          "name": 'single text field',
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000003",
          "repeating": true,
          "fieldOptions":{
            "definition":{
              "maxRepeat":3,
              "minRepeat":1
            }
          }
        },
        "fieldValues": [
          "text1Sub3",
          "text2Sub3"
        ]
      }],
      "formSubmittedAgainst":{
        "name" : "A Form",
        "pages":[{
          "fields":[
            {
              "name": 'single text field',
              "required": false,
              "type": "text",
              "_id": "52a65af9a43843f938000003",
              "repeating": true,
              "fieldOptions":{
                "definition":{
                  "maxRepeat":3,
                  "minRepeat":1
                }
              }
            }]
        }]
      }
    }];

    exportHelper.submissionsToCSV({
      fieldHeader: "name",
      submissions: sub,
      downloadUrl: 'dummyurl:fileId'
    }, function(err, csvs){
      assert.ok(!err);
      var csvKeys = Object.keys(csvs);
      var lines = csvs[csvKeys[0]].split('\r\n');

      assert.equal(lines[0], 'single text field-1,single text field-2,single text field-3,single text field-4');
      assert.equal(lines[1], 'text1Sub1,,,');
      assert.equal(lines[2], 'text1Sub2,text2Sub2,text3Sub2,text4Sub2');
      assert.equal(lines[3], 'text1Sub3,text2Sub3,,');

      finish();
    });
  },
  "it_should_export_multiple_forms": function(finish) {
    var sub = [{
      "formId": "simple1",
      "name":"simple1",
      "formFields": [{
        "fieldId": {
          "name": "single text field",
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000003",
          "repeating": false
        },
        "fieldValues": [
          "test entry"
        ]
      }],
      "formSubmittedAgainst":{
        "name":"simple1",
        "pages":[{
          "fields":[
            {
              "name": 'single text field',
              "required": false,
              "type": "text",
              "_id": "52a65af9a43843f938000003",
              "repeating": false
            }]
        }]
      }
    }, {
      "name":"simple2",
      "formId": "simple2",
      "formFields": [{
        "fieldId": {
          "name": "single text field",
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000003",
          "repeating": false
        },
        "fieldValues": [
          "test entry"
        ]
      }],
      "formSubmittedAgainst":{
        "name":"simple2",
        "pages":[{
          "fields":[
            {
              "name": 'single text field',
              "required": false,
              "type": "text",
              "_id": "52a65af9a43843f938000003",
              "repeating": false
            }]
        }]
      }
    }];

    exportHelper.submissionsToCSV({
      fieldHeader: "name",
      submissions: sub,
      downloadUrl: 'dummyurl:fileId'
    }, function(err, csvs){
      assert.ok(!err);
      var keys = Object.keys(csvs);

      assert.ok(keys.length, 2);
      assert.ok(keys[0].indexOf('simple1') !== -1, keys[0]);
      assert.ok(keys[1].indexOf('simple2') !== -1, keys[0]);
      finish();
    });
  },
  "it_should_export_csv_for_repeating_submission": function(finish) {
    var sub = [{
      "formId": "simple2",
      "formFields": [{
        "fieldId": {
          "name": "repeating",
          "required": false,
          "type": "text",
          "_id": "52a65af9a43843f938000003",
          "repeating": true,
          "fieldOptions":{
            "definition":{
              "maxRepeat":5,
              "minRepeat":2
            }
          }
        },
        "fieldValues": ["test entry1", "test entry2"]
      }],
      "formSubmittedAgainst":{
        "name" : "simple2",
        "pages":[{
          "fields":[
            {
              "name": "repeating",
              "required": false,
              "type": "text",
              "_id": "52a65af9a43843f938000003",
              "repeating": true,
              "fieldOptions":{
                "definition":{
                  "maxRepeat":5,
                  "minRepeat":2
                }
              }
            }]
        }]
      }
    }];

    var form = {
      "updatedBy": "testing-admin@example.com",
      "name": "app forms phase ii",
      "description": "this is the sample form being used for development of app forms phase ii. it contains all standard fields and has multiple pages and rules.",
      "_id": "simple1",
      "pageRules": [],
      "fieldRules": [],
      "pages": [
        {
          "name": "page 1",
          "description": "page 1 description",
          "_id": "52a65af9a43843f938000004",
          "fields": [
            {
              "name": 'repeating',
              "helpText": "instructions",
              "required": false,
              "type": "text",
              "_id": "52a65af9a43843f938000003",
              "repeating": true,
              "fieldOptions":{
                "definition":{
                  "maxRepeat":5,
                  "minRepeat":2
                }
              }
            }
          ]
        }
      ],
      "lastUpdated": "2013-12-10T00:06:17.653Z",
      "dateCreated": "2013-12-10T00:06:17.653Z",
      "pageRef": {
        "52a65af9a43843f938000004": 0
      },
      "fieldRef": {
        "52a65af9a43843f938000003": {
          "page": 0,
          "field": 0
        }
      },
      "appsUsingForm": 123,
      "submissionsToday": 1234,
      "submissionsTotal": 124125
    };

    exportHelper.submissionsToCSV({
      fieldHeader: "name",
      submissions: sub,
      downloadUrl: 'dummyurl:fileId'
    }, function(err, csvs){
      assert.ok(!err);
      var keys = Object.keys(csvs);
      var lines = csvs[keys[0]].split('\r\n');
      assert.equal(lines[0], 'repeating-1,repeating-2,repeating-3,repeating-4,repeating-5', 'Unexpected headers!');
      assert.equal(lines[1], 'test entry1,test entry2,,,', 'Unexpected first line!');
      finish();
    });
  },
  "it_should_export_complex_submissions":  function(finish){
    var sub = [complexSubmissionOrder, complexSubmission1];

    exportHelper.submissionsToCSV({
      fieldHeader: "name",
      submissions: sub,
      downloadUrl: 'dummyurl:fileId'
    }, function(err, csvs){
      assert.ok(!err);
      var csvKeys = Object.keys(csvs);
      var lines = csvs[csvKeys[0]].split('\r\n');
      assert.equal(lines[0], "Order,Notification Type,Description,Equipment,Serial Number,Material,Planner Group,Main Work Ctr,Reported by,Coding,Description,Required Start,Priority,Object Part,Damage,Text,Cause Code,Cause Text,Photo-name,Photo-url,Photo 2 ?,Photo 2-name,Photo 2-url,Photo 3 ?,Photo 3-name,Photo 3-url,Required End");
      assert.equal(lines[1], "530132297,TI,Vegetation,30003713,UBS542A,BRIDGE,ATH,ATH-STSE,Nmc,Adjust,,,Medium,Abuttments,Debris,,Build-up of debris,,filePlaceHolderd36a25f7b613c3608a25c017202f48f0.png,dummyurl53c3ae081b70525c65000006,Yes,,,No,,,");
      assert.equal(lines[2], ",TI,Test text,30002144,OBL126,Stone some new line,LMK,LMK-STSE,Egan_C,Adjust,,2014-07-26,High,Abuttments,Bent,,Authorised Work,,filePlaceHolder10a0bd6f827beb3bc39c5f51d7daa0ea.png,dummyurl53ac7112859dcc5151000001,,,,,,,2014-08-26");
      finish();
    });
  }
};

