// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js
const SpecReporter = require('jasmine-spec-reporter');
const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
const uuidV4 = require('uuid/v4');

const consoleReporter = new SpecReporter(
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
);

const htmlReporter = new HtmlScreenshotReporter({
  dest: 'e2e-html-report',
  filename: 'index.html',
  reportTitle: "Six e2e Test Report",
  ignoreSkippedSpecs: true,
  showQuickLinks: true,
  reportOnlyFailedSpecs: false,
  captureOnlyFailedSpecs: true,
  configurationStrings: {
    "Time": new Date()
  },
  pathBuilder: function(currentSpec, suites, browserCapabilities) {
    return browserCapabilities.get('browserName') + '/' + uuidV4();
  }
});

exports.config = {
  allScriptsTimeout: 110000,
  specs: [
    // './e2e/**/login.e2e-spec.ts',
    // './e2e/**/register.e2e-spec.ts',
    // './e2e/**/register-behaviors.e2e-spec.ts',
    // './e2e/**/accept-invite.e2e-spec.ts',
    // './e2e/**/create-order.e2e-spec.ts',
    // './e2e/**/navigation.e2e-spec.ts',
    // './e2e/**/product.e2e-spec.ts',
    // './e2e/**/product-schedule.e2e-spec.ts',
    // './e2e/**/campaigns.e2e-spec.ts',
    // './e2e/**/merchant-provider.e2e-spec.ts',
    // './e2e/**/merchant-provider-group.e2e-spec.ts',
    './e2e/**/transaction.e2e-spec.ts',
    // './e2e/**/order.e2e-spec.ts',
    // './e2e/**/email-template.e2e-spec.ts'
  ],
  suites:  {
    smoke: [
      './e2e/**/login.e2e-spec.ts',
      './e2e/**/register.e2e-spec.ts',
      './e2e/**/register-behaviors.e2e-spec.ts',
      './e2e/**/accept-invite.e2e-spec.ts',
      './e2e/**/create-order.e2e-spec.ts',
      './e2e/**/navigation.e2e-spec.ts'
    ],
    temp: [
      './e2e/**/product-schedule.e2e-spec.ts'
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

    return new Promise(function(resolve){
      htmlReporter.beforeLaunch(resolve);
    });
  },
  onPrepare: function() {
    jasmine.getEnv().addReporter(consoleReporter);
    jasmine.getEnv().addReporter(htmlReporter);
  },

  afterLaunch: function(exitCode) {
    return new Promise(function(resolve){
      htmlReporter.afterLaunch(resolve.bind(this, exitCode));
    });
  }
};

