// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    // './e2e/**/*.e2e-spec.ts'
    './e2e/**/app.e2e-spec.ts',
    './e2e/**/register.e2e-spec.ts',
    './e2e/**/login.e2e-spec.ts',
    './e2e/**/dashboard.e2e-spec.ts',
    './e2e/**/profile.e2e-spec.ts',
    './e2e/**/navigation.e2e-spec.ts',
    './e2e/**/affiliate.e2e-spec.ts',
    './e2e/**/search.e2e-spec.ts',
    './e2e/**/advanced-search.e2e-spec.ts',
    './e2e/**/accept-invite.e2e-spec.ts',
    './e2e/**/merchant-provider.e2e-spec.ts',
    './e2e/**/app.e2e-spec.ts'
  ],
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
      project: 'e2e'
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
