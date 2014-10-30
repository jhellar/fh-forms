#fh-forms

## 0.9.3 - 2014-10-30 - IR239 - Wei Li

* 8212 - Update fh-amqp-js version

##0.9.2 - 2014-09-26 - IR239 - Niall Donnelly

* 8109 Added file name to file download url

##0.9.1 - 2014-09-26 - IR237 - Craig Brookes
* 8027 add createdBy field. set createdBy on update to be lastUpdated by if no createdby set
##0.9.0 - 2014-09-23 - IR237 - Niall Donnelly

* 7986 Added field codes to form fields.
* 6582 Duplicate Form Name Verification.
* 6587 Duplicate Theme Name Verification.

##0.8.3 - 2014-09-10 - IR236 - Craig Brookes

* 7906 teams collab minor change to allow get submissions to take an array of forms

##0.8.2 - 2014-09-02 - IR235 - Niall Donnelly

* 7896 Upgrade to rule deletion/update

##0.8.01 - 2014-08-27 - IR235 - Niall Donnelly

* 7822 Stopped returning admin fields to clients.

##0.8.00 - 2014-08-27 - IR235 - Niall Donnelly

* 7822 Added adminOnly field to form fields.

##0.7.01 - 2014-08-20 - IR234 - Niall Donnelly

* Fixed bug related to saving forms with multiple targets.

##0.7.00 - 2014-08-20 - IR234 - Niall Donnelly

* 7821 Added functionality to deal with multiple rule targets for field and page rules.

##0.6.02 - 2014-08-13 - IR233 - Niall Donnelly

* Updated theme editor css (Related to ticket 7414)

##0.6.01 - 2014-07-15 - IR232 - Niall Donnelly

* Updated theme editor css (Related to ticket 7414)

##0.6.00 - 2014-07-11 - IR231 - Niall Donnelly

* 7414 - Upgrade theme editor to bootstrap.

##0.5.21 - 2014-07-17 - IR232 - Niall Donnelly

* 7637 Fixed rules engine bug where hidden fields were being validated for input elements

##0.5.20 - 2014-05-27 - IR228 - Cbrookes

* 7242 submission search

##0.5.19 - 2014-05-29 - IR228 - Niall Donnelly

* 7301 Fix for invalid value in rules engine.

##0.5.17 - 2014-05-21 - IR227 - Niall Donnelly

* 7214 Fix for updating rules causing client to be out of sync.

##0.5.16 - 2014-05-14 - IR227 - Niall Donnelly

* 5619 Fix for deleting field and page rules when a field or page is deleted.

##0.5.15 - 2014-05-12 - IR227 - Niall Donnelly

* 6913 Radio alignment is now to the left.

##0.5.14 - 2014-05-12 - IR227 - Cbrookes

* 6918 Fix for button layout for client.

##0.5.13 - 2014-05-07 - IR227 - Cbrookes

* 6152 finish app data work

##0.5.12 - 2014-05-07 - IR227 - Cbrookes

* 7054 fix for save of multipage forms issue

##0.5.11 - 2014-05-07 - IR226 - Cbrookes

* 7044 add export to fhc forms

##0.5.10 - 2014-05-01 - IR226 - Niall Donnelly

* 6795 - fixed Numerical comparison not working in rules engine

##0.5.9 - 2014-04-30 - IR226 - Niall Donnelly

* 5824 - fixed date fields not populating across devices.

##0.5.8 - 2014-04-28 - IR226 - Niall Donnelly

* 7007 - Fixedfile not working on Android.

##0.5.7 - 2014-04-17 - IR226 - Niall Donnelly

* 6744 - file limit not working.

##0.5.6 - 2014-04-17 - IR225 - Niall Donnelly

* 6706 - get submission for client Api.

##0.5.5 - 2014-04-16 - IR225 - cbrookes

* 6827 fix for empty group values

##0.5.4 - 2014-04-11 - IR225 - mmurphy

* 6663 - Change placeholder in submissions notifications messages to avoid HTML characters - part of fix for notifications emails

##0.5.3 - 2014-04-10 - IR224 - Niall Donnelly

* 6646 - Add margin and padding to themes.

##0.5.1 - 2014-04-03 - IR224 - mmurphy

bumping version number only due to broken npm

##0.4.2 - 2014-04-03 - IR224 - mmurphy

* 6468 - Form theme edit always shows FeedHenry logo as theme logo

##0.4.1 - 2014-04-03 - IR224 - mmurphy

* 6649 - Change baseTheme Template to show error text as black on red backround - Error flagging in on-device App forms setting font to red on red

##0.4.0 - 2014-04-02 - IR224 - mmurphy

bumping version number only due to broken npm

##0.3.01 - 2014-03-26 - IR225 - cbrookes

6378 fix for log levels and logger in config


##0.3.00 - 2014-03-26 - IR225 - cbrookes

* 6515 expose submissions api

##0.2.55 - 2014-03-26 - IR225 - cbrookes

*6516 getPopulatedFormsList implimentation

##0.2.54 - 2014-03-26 - IR224 - cbrookes

* 5400-validateImmediately enable checking for validateImmediately

##0.2.53 - 2014-03-26 - IR224 - mmurphy

* 5974 - fix field formatting in submission notifications

##0.2.52 - 2014-03-21 - IR223 - cbrookes

minor fix for list submissions

##0.2.51 - 2014-03-21 - IR223 - cbrookes

* 6454 - changes to add form def to submission and match values (useful for studio and wfm)
deploy note : ensure that all submissions are deleted in beta

##0.2.50 - 2014-03-25 - IR224 - Martin Murphy

* 6356 - Calling List Form Apps API without Forms Admin user results in error

##0.2.49 - 2014-03-24 - IR224 - Martin Murphy

* 5901 - Allow numeric strings in as values in number field submissions

##0.2.48 - 2014-03-21 - IR223 - Niall Donnelly

* 6420 - Fixed updatedBy not being added to theme update/create

##0.2.47 - 2014-03-19 - IR223 - Craig Brookes

* form submission changes to add page data to fields to allow for removed feilds to
be rendered properly in studio

##0.2.46 - 2014-03-19 - IR223 - Niall Donnelly

* 6391 - Add appClientId to submissions.

##0.2.45 - 2014-03-18 - IR223 - mmurphy

* Fix jshint errors in constructed rules engine file

##0.2.44 - 2014-03-18 - IR223 - mmurphy

* 5901 - Add validator for strings containing numeric data

##0.2.40 - 2014-02-25 - IR222 - cbrookes

* 6192 - cant have empty file submission when not required field

##0.2.40 - 2014-02-25 - IR222 - cbrookes

* 5270 - submissions changes to add page id and name to submission
* changes to ignore validation when flag passed

##0.2.39 - 2014-02-25 - IR222 - mmurphy

* 6146 - change config_admin_user to list of device ids

##0.2.38 - 2014-02-21 - IR221 - mmurphy

* 6058 - forms module - emit log events which can be listened to in other places.

##0.2.37 - 2014-02-21 - IR221 - mmurphy

* 6057 - fix logging bugs after earlier updates

##0.2.36 - 2014-02-20 - IR221 - mmurphy

* 6138 - add default app config

##0.2.34 - 2014-02-20 - IR221 - mmurphy

* 6056 - mBaaS Debugging / Logging

##0.2.33 - 2014-02-20 - IR221 - mmurphy

* 6106 - update app forms endpoints to include config

##0.2.22 - 2014-02-18 - IR221 - mmurphy

* 6030 - AppForms Config
* 6031 - Supercore APIs for appforms config
* 6032 - mBaaS APIs for appforms config

##0.2.24 - 2014-02-10 - IR221 - mmurphy

* 5961 - add forms to existing apps needs to filter apps by group

##0.2.23 - 2014-02-10 - IR221 - Niall Donnelly


* Ticket #5967 - Prevent users from deleting themes when in use. Populate form statistics for viewable forms.

##0.2.22 - 2014-02-07 - IR220 - dmartin

* Ticket #5978 - Include pdf attachment url in submission mail message
* Ticket #5981 - Fixed form create api to allow setting subscribers
* Ticket #5983 - Setting hostname placeholder in submission mail message, to be filled in by millicore later

##0.2.21 - 2014-02-07 - IR220 - mmurphy

* Ticket #5825 - 'Required' option for text field doesn't work. Can still submit even when no text is entered
* Ticket #5826 - 'Required' option for paragraph field not working
* Ticket #5827 - 'Required' option for numbers field not working
* Ticket #5830 - Website field: When 'required' option is selected, and the user attempts to submit a blank field, there is no feedback

##0.2.20 - 2014-02-06 - IR220 - mmurphy

* Ticket #5817 - Don't raise validation error if duplicate radio options in form field definition #5817
* Ticket #5813 - Avoid raising error during validation of url field #5813
* Ticket #5815 - don't fail form field validation if dropdown options are duplicated in form definition

##0.2.19 - 2014-02-04 - IR220 - mmurphy

* Ticket #5706 - fh-forms module check to see if email needs to be sent

##0.2.18 - 2014-01-29 - IR219 - Niall Donnelly

* Ticket #5398 - added updates to fh-forms theme generator for more complex themes.

##0.2.17 - 2014-01-24 - IR219 - mmurphy

* Ticket #5729 - fix restriction on setting forms apps

##0.2.16 - 2014-01-22 - IR219 - mmurphy

* Ticket #5650 - fh-forms logic for restricting access (R&W) based on user id

##0.2.15 - 2014-01-14 - IR219 - mmurphy

* Ticket #5643 - add app forms groups to fh-forms

##0.2.14 - 2014-01-10 - IR218 - mmurphy

* Ticket #5612 - Field checking in rules engine based on format definition

##0.2.13 - 2013-12-19 - IR217 - dberesford

* Ticket 5312 - Submission export

##0.2.11 - IR217 - Martin Murphy

Change eastings/northings validation to work with uk_grid
Make formname retrival more defensive

##0.2.10 - IR217 - Martin Murphy

We seem to have changed the "checkboxChoices" key to "options"
Change client validation to allow any our file value types
Add new validation tests, fix new validation bugs

##0.2.4 - IR216 - Martin Murphy

- 5317  Add validateFieldValue to rulesEngine to validate against a value instead of a submission entry
- 5322  fix rulesEngine closure wrapping async
- 5328  fix bug in rulesEngine.checkRules where rules reference an field not submitted
- 5338  Update rulesengine.validateForm to return per-field values errors and per-field errors

##0.2.3 - IR216 - Martin Murphy
-5244  Add app and forms names to submissions list

previous versions
##0.2.2 - added ne rules-engine
