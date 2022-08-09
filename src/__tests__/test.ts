import { lighthouseReport, Categories } from '../index';

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
        username: 'heretohavefun400@gmail.com',
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
        username: 'heretohavefun400@gmail.com',
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
