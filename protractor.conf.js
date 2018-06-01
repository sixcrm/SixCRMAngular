// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js

exports.config = {
  allScriptsTimeout: 110000,
  specs: [
    './e2e/**/login.e2e-spec.ts',
    './e2e/**/register.e2e-spec.ts',
    './e2e/**/accept-invite.e2e-spec.ts',
    './e2e/**/navigation.e2e-spec.ts',
    './e2e/**/campaigns.e2e-spec.ts'
  ],
  suites:  {
    repeatable: [
      './e2e/**/login.e2e-spec.ts',
      './e2e/**/navigation.e2e-spec.ts'
      ],
    crm: [
      './e2e/**/campaigns.e2e-spec.ts',
      './e2e/**/product.e2e-spec.ts',
      './e2e/**/product-schedule.e2e-spec.ts',
      './e2e/**/email-template.e2e-spec.ts',
      './e2e/**/affiliate.e2e-spec.ts',
      './e2e/**/tracker.e2e-spec.ts',
      './e2e/**/merchant-provider.e2e-spec.ts',
      './e2e/**/merchant-provider-group.e2e-spec.ts',
      './e2e/**/fulfillment-provider.e2e-spec.ts',
      './e2e/**/smtp-provider.e2e-spec.ts'
    ],
    invite: './e2e/**/accept-invite.e2e-spec.ts',
    register: './e2e/**/register.e2e-spec.ts',
    login: './e2e/**/login.e2e-spec.ts',
    user: './e2e/**/user.e2e-spec.ts',
    account: './e2e/**/account.e2e-spec.ts',
    navigation: './e2e/**/navigation.e2e-spec.ts',
    current: './e2e/**/product.e2e-spec.ts',
    useraccount: [
      './e2e/**/user.e2e-spec.ts',
      './e2e/**/account.e2e-spec.ts',
      './e2e/**/profile.e2e-spec.ts',
      ],
    base: [
      './e2e/**/login.e2e-spec.ts',
      './e2e/**/accept-invite.e2e-spec.ts',
      './e2e/**/register.e2e-spec.ts',
      './e2e/**/user.e2e-spec.ts'
    ]
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
