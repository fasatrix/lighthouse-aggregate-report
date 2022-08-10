import { lighthouseReport, configurationSettings, Categories } from '../index';

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
