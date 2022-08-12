import { lighthouseReport, configurationSettings, Categories, Audits } from '../index';

describe('I should be able to get Partial metrics', () => {
  let results = {};
  beforeAll(async () => {
    const options = {
      targetUrl: 'https://google.com',
      lighthouse: { onlyCategories: [Categories.bestPractises, Categories.seo] },
    };
    results = await lighthouseReport(options);
  });
  it('it should return seo', () => {
    // @ts-ignore
    expect(results.seo >= 0).toBeTruthy();
  });
  it('it should return Best Practises', () => {
    // @ts-ignore
    expect(results['best-practices'] >= 0).toBeTruthy();
  });
});

describe('I should be able to get default metrics', () => {
  let results = {};
  beforeAll(async () => {
    const options = {
      targetUrl: 'https://google.com',
    };
    results = await lighthouseReport(options);
  });
  it('it should return Seo', () => {
    // @ts-ignore
    expect(results.seo >= 0).toBeTruthy();
  });
  it('it should return Best Practises', () => {
    // @ts-ignore
    expect(results['best-practices'] >= 0).toBeTruthy();
  });
  it('it should return Performance', () => {
    // @ts-ignore
    expect(results.performance >= 0).toBeTruthy();
  });
  it('it should return Accessibility', () => {
    // @ts-ignore
    expect(results.accessibility >= 0).toBeTruthy();
  });
  it('it should return PWA', () => {
    // @ts-ignore
    expect(results.pwa >= 0).toBeTruthy();
  });
});

describe('I should be able to get Partial metrics for Authenticated App', () => {
  let results = {};
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
    // @ts-ignore
    expect(results.seo >= 0).toBeTruthy();
  });
  it('it should return Best Practises', () => {
    // @ts-ignore
    expect(results['best-practices'] >= 0).toBeTruthy();
  });
});

describe('I should be able to get metrics for Authenticated App if targetUrl and loginUrl are different', () => {
  let results = {};
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
    // @ts-ignore
    expect(results.seo >= 0).toBeTruthy();
  });
  it('it should return Best Practises', () => {
    // @ts-ignore
    expect(results['best-practices'] >= 0).toBeTruthy();
  });
});

describe('It should default to Login if both Authorization and Login are passed in the config', () => {
  let resultsReporter: any;
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
    resultsConf = configurationSettings(options);
    resultsReporter = await lighthouseReport(options);
  });
  it('it should NOT return extra headers', () => {
    expect(resultsConf.extraHeaders).toBeUndefined();
  });
  it('it should return seo', () => {
    expect(resultsReporter.seo >= 0).toBeTruthy();
  });
  it('it should return Best Practises', () => {
    expect(resultsReporter['best-practices'] >= 0).toBeTruthy();
  });
  it('it should return Performance', () => {
    expect(resultsReporter.performance >= 0).toBeTruthy();
  });
  it('it should return Accessibility', () => {
    expect(resultsReporter.accessibility >= 0).toBeTruthy();
  });
  it('it should return PWA', () => {
    expect(resultsReporter.pwa >= 0).toBeTruthy();
  });
});

describe('It should be using extraHeaders if passed in the config', () => {
  let resultsReporter: any;
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
    resultsConf = configurationSettings(options);
    resultsReporter = await lighthouseReport(options);
  });
  it('it should NOT return extra headers', () => {
    expect(resultsConf.extraHeaders).toBeTruthy();
  });
  it('it should return seo', () => {
    expect(resultsReporter.seo >= 0).toBeTruthy();
  });
  it('it should return Best Practises', () => {
    expect(resultsReporter['best-practices'] >= 0).toBeTruthy();
  });
  it('it should return Performance', () => {
    expect(resultsReporter.performance >= 0).toBeTruthy();
  });
  it('it should return Accessibility', () => {
    expect(resultsReporter.accessibility >= 0).toBeTruthy();
  });
  it('it should return PWA', () => {
    expect(resultsReporter.pwa >= 0).toBeTruthy();
  });
});

describe('I should be able to get audits metrics different than defaul', () => {
  let results = {};
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
    // @ts-ignore
    expect(results['first-meaningful-paint'] >= 0).toBeTruthy();
  });
  it('it should return first-contentful-paint', () => {
    // @ts-ignore
    expect(results['first-contentful-paint'] >= 0).toBeTruthy();
  });
  it('it should return largest-contentful-paint', () => {
    // @ts-ignore
    expect(results['largest-contentful-paint'] >= 0).toBeTruthy();
  });
  it('it should return cumulative-layout-shift', () => {
    // @ts-ignore
    expect(results['cumulative-layout-shift'] >= 0).toBeTruthy();
  });
  it('it should return max-potential-fid', () => {
    // @ts-ignore
    expect(results['max-potential-fid'] >= 0).toBeTruthy();
  });
  it('it should return total-blocking-time', () => {
    // @ts-ignore
    expect(results['total-blocking-time'] >= 0).toBeTruthy();
  });
  it('it should return interactive', () => {
    // @ts-ignore
    expect(results.interactive >= 0).toBeTruthy();
  });
  it('it should return speed-index', () => {
    // @ts-ignore
    expect(results['speed-index'] >= 0).toBeTruthy();
  });
  it('it should return redirects', () => {
    // @ts-ignore
    expect(results.redirects >= 0).toBeTruthy();
  });
  it('it should return viewport', () => {
    // @ts-ignore
    expect(results.viewport >= 0).toBeTruthy();
  });
});

describe('I should be able to get the default audits metrics', () => {
  let results = {};
  beforeAll(async () => {
    const options = {
      targetUrl: 'https://google.com',
    };
    results = await lighthouseReport(options);
  });
  it('it should return interactive', () => {
    // @ts-ignore
    expect(results.interactive >= 0).toBeTruthy();
  });
  it('it should return first-contentful-paint', () => {
    // @ts-ignore
    expect(results['first-contentful-paint'] >= 0).toBeTruthy();
  });
});
