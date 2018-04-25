// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js

exports.config = {
  allScriptsTimeout: 110000,
  specs: [
    './e2e/**/product.e2e-spec.ts'
  ],
  suites:  {
    repeatable: './e2e/**/product-schedule.e2e-spec.ts'
  },
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 120000,
    print: function() {}
  },
  useAllAngular2AppRoots: true,
  beforeLaunch: function() {
    require('ts-node').register({
      project: 'e2e/tsconfig.json'
    });
  },
  onPrepare: function() {

    /*global jasmine */
    var SpecReporter = require('jasmine-spec-reporter');
    jasmine.getEnv().addReporter(new SpecReporter(
            {
              displayStacktrace: 'none',      // display stacktrace for each failed assertion, values: (all|specs|summary|none)
              displaySuccessesSummary: false, // display summary of all successes after execution
              displayFailuresSummary: true,   // display summary of all failures after execution
              displayPendingSummary: true,    // display summary of all pending specs after execution
              displaySuccessfulSpec: true,    // display each successful spec
              displayFailedSpec: true,        // display each failed spec
              displayPendingSpec: false,      // display each pending spec
              displaySpecDuration: false,     // display each spec duration
              displaySuiteNumber: false,      // display each suite number (hierarchical)
              colors: {
                success: 'green',
                failure: 'red',
                pending: 'yellow'
              },
              prefixes: {
                  success: '✓ ',
                  failure: '✗ ',
                  pending: '* '
              },
              customProcessors: []
            }
      ));
  }
};
