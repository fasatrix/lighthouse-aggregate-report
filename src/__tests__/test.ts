import { lighthouseReport, flagsSettings, Categories, Audits, IReport } from '../index';

describe('I should be able to get Partial metrics', () => {
  let results: IReport;
  beforeAll(async () => {
    const options = {
      targetUrl: 'https://angular.io',
      lighthouse: { onlyCategories: [Categories.bestPractises, Categories.seo] },
    };
    results = await lighthouseReport(options);
  });
  it('it should return seo', () => {
    expect(results!.seo! >= 0).toBeTruthy();
  });
  it('it should return Best Practises', () => {
    expect(results['best-practices']! >= 0).toBeTruthy();
  });
});

describe('I should be able to get default metrics', () => {
  let results: IReport;
  beforeAll(async () => {
    const options = {
      targetUrl: 'https://google.com/',
    };
    results = await lighthouseReport(options);
  });
  it('it should return Seo', () => {
    expect(results!.seo! >= 0).toBeTruthy();
  });
  it('it should return Best Practises', () => {
    expect(results['best-practices']! >= 0).toBeTruthy();
  });
  it('it should return Performance', () => {
    expect(results!.performance! >= 0).toBeTruthy();
  });
  it('it should return Accessibility', () => {
    expect(results!.accessibility! >= 0).toBeTruthy();
  });
  it('it should return PWA', () => {
    expect(results!.pwa! >= 0).toBeTruthy();
  });
  it('it should return resource-summary', () => {
    expect(results['resource-summary']!).toBeTruthy();
  });
});

describe('I should be able to debug Lighthouse errors', () => {
  let results: IReport;
  beforeAll(async () => {
    const options = {
      targetUrl: 'https://notavalidurl.com/',
      lighthouse: {
        debug: true,
      },
    };
    results = await lighthouseReport(options);
  });
  it('it should return an error', () => {
    expect(results.error!).toBeTruthy();
  });
  it('it should return with an SSL certificate specific error message', () => {
    expect(results.error?.runtimeError?.message).toEqual('DNS servers could not resolve the provided domain.');
  });
  it('it should return with an SSL certificate specific error code', () => {
    expect(results.error?.runtimeError?.code).toEqual('DNS_FAILURE');
  });
});

describe('I should be able to get Partial metrics for Authenticated App', () => {
  let results: IReport;
  beforeAll(async () => {
    const options = {
      targetUrl: 'http://automationpractice.multiformis.com/index.php?controller=authentication&back=my-account',
      lighthouse: { onlyCategories: [Categories.bestPractises, Categories.seo] },
      Login: {
        username: 'foo@foo.com',
        password: '123456789',
        usernameSelector: '#email',
        passwordSelector: '#passwd',
        buttonSelector: '#SubmitLogin > span > i',
      },
    };
    results = await lighthouseReport(options);
  });
  it('it should return seo', () => {
    expect(results!.seo! >= 0).toBeTruthy();
  });
  it('it should return Best Practises', () => {
    expect(results['best-practices']! >= 0).toBeTruthy();
  });
});

describe('I should be able to get metrics for Authenticated App if targetUrl and loginUrl are different', () => {
  let results: IReport;
  beforeAll(async () => {
    const options = {
      targetUrl: 'http://automationpractice.multiformis.com/',
      Login: {
        loginUrl: 'http://automationpractice.multiformis.com/index.php?controller=authentication&back=my-account',
        username: 'foo@foo.com',
        password: '123456789',
        usernameSelector: '#email',
        passwordSelector: '#passwd',
        buttonSelector: '#SubmitLogin',
      },
    };
    results = await lighthouseReport(options);
  });
  it('it should return seo', () => {
    expect(results!.seo! >= 0).toBeTruthy();
  });
  it('it should return Best Practises', () => {
    expect(results['best-practices']! >= 0).toBeTruthy();
  });
});

describe('It should default to Login if both Authorization and Login are passed in the config', () => {
  let resultsReporter: IReport = {};
  let resultsConf: any;
  beforeAll(async () => {
    const options = {
      targetUrl: 'http://automationpractice.multiformis.com/',
      Login: {
        loginUrl: 'http://automationpractice.multiformis.com/index.php?controller=authentication&back=my-account',
        username: 'foo@foo.com',
        password: '123456789',
        usernameSelector: '#email',
        passwordSelector: '#passwd',
        buttonSelector: '#SubmitLogin',
      },
      lighthouse: {
        extraHeaders: {
          Authorization: 'Bearer XXXXXXXXXXXXXXXXXXXX',
        },
      },
    };
    resultsConf = flagsSettings(options);
    resultsReporter = await lighthouseReport(options);
  });
  it('it should NOT return extra headers', () => {
    expect(resultsConf.extraHeaders).toBeUndefined();
  });
  it('it should return seo', () => {
    expect(resultsReporter!.seo! >= 0).toBeTruthy();
  });
  it('it should return Best Practises', () => {
    expect(resultsReporter['best-practices']! >= 0).toBeTruthy();
  });
  it('it should return Performance', () => {
    expect(resultsReporter!.performance! >= 0).toBeTruthy();
  });
  it('it should return Accessibility', () => {
    expect(resultsReporter!.accessibility! >= 0).toBeTruthy();
  });
  it('it should return PWA', () => {
    expect(resultsReporter!.pwa! >= 0).toBeTruthy();
  });
});

describe('It should be using extraHeaders if passed in the config', () => {
  let resultsReporter: IReport = {};
  let resultsConf: any;
  beforeAll(async () => {
    const options = {
      targetUrl: 'http://automationpractice.multiformis.com/',
      lighthouse: {
        extraHeaders: {
          Authorization: 'Bearer XXXXXXXXXXXXXXXXXXXX',
        },
      },
    };
    resultsConf = flagsSettings(options);
    resultsReporter = await lighthouseReport(options);
  });
  it('it should NOT return extra headers', () => {
    expect(resultsConf.extraHeaders).toBeTruthy();
  });
  it('it should return seo', () => {
    expect(resultsReporter!.seo! >= 0).toBeTruthy();
  });
  it('it should return Best Practises', () => {
    expect(resultsReporter['best-practices']! >= 0).toBeTruthy();
  });
  it('it should return Performance', () => {
    expect(resultsReporter!.performance! >= 0).toBeTruthy();
  });
  it('it should return Accessibility', () => {
    expect(resultsReporter!.accessibility! >= 0).toBeTruthy();
  });
  it('it should return PWA', () => {
    expect(resultsReporter!.pwa! >= 0).toBeTruthy();
  });
});

describe('I should be able to get audits metrics different than default', () => {
  let results: IReport = {};
  beforeAll(async () => {
    const options = {
      targetUrl: 'https://google.com',
      lighthouse: {
        onlyAudits: [
          Audits.firstContentfulPaint,
          Audits.firstMeaningfulPaint,
          Audits.largestContentfulPaint,
          Audits.largestContentfulPaintAllFrames,
          Audits.cumulativeLayoutShift,
          Audits.maxPotentialFid,
          Audits.totalBlockingTime,
          Audits.interactive,
          Audits.speedIndex,
          Audits.redirects,
          Audits.viewport,
        ],
      },
    };
    results = await lighthouseReport(options);
  });
  it('it should return first-meaningful-paint', () => {
    expect(results['first-meaningful-paint'] >= 0).toBeTruthy();
  });
  it('it should return first-contentful-paint', () => {
    expect(results['first-contentful-paint'] >= 0).toBeTruthy();
  });
  it('it should return largest-contentful-paint', () => {
    expect(results['largest-contentful-paint'] >= 0).toBeTruthy();
  });
  it('it should return cumulative-layout-shift', () => {
    expect(results['cumulative-layout-shift'] >= 0).toBeTruthy();
  });
  it('it should return max-potential-fid', () => {
    expect(results['max-potential-fid'] >= 0).toBeTruthy();
  });
  it('it should return total-blocking-time', () => {
    expect(results['total-blocking-time'] >= 0).toBeTruthy();
  });
  it('it should return interactive', () => {
    expect(results.interactive >= 0).toBeTruthy();
  });
  it('it should return speed-index', () => {
    expect(results['speed-index'] >= 0).toBeTruthy();
  });
  it('it should return redirects', () => {
    expect(results.redirects >= 0).toBeTruthy();
  });
});

describe('I should be able to get the default audits metrics for mobile mode', () => {
  let results: IReport = {};
  beforeAll(async () => {
    const options = {
      isMobile: true,
      targetUrl: 'https://google.com',
    };
    results = await lighthouseReport(options);
  });
  it('it should return Seo', () => {
    expect(results!.seo! >= 0).toBeTruthy();
  });
  it('it should return Best Practises', () => {
    expect(results['best-practices']! >= 0).toBeTruthy();
  });
  it('it should return Performance', () => {
    expect(results!.performance! >= 0).toBeTruthy();
  });
  it('it should return Accessibility', () => {
    expect(results!.accessibility! >= 0).toBeTruthy();
  });
  it('it should return PWA', () => {
    expect(results!.pwa! >= 0).toBeTruthy();
  });
  it('it should return interactive', () => {
    expect(results.interactive >= 0).toBeTruthy();
  });
  it('it should return first-contentful-paint', () => {
    expect(results['first-contentful-paint'] >= 0).toBeTruthy();
  });
});
