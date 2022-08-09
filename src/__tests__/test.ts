import { lighthouseReport, Categories } from '../index';

describe('I should be able to get Partial metrics', () => {
  let results = {};
  beforeAll(async () => {
    const options = {
      url: 'https://google.com',
      lighthouse: { onlyCategories: [Categories.bestPractises, Categories.seo] },
    };
    results = await lighthouseReport(options);
  });
  it('it should return seo', async () => {
    // @ts-ignore
    expect(results.seo >= 0).toBeTruthy();
  });
  it('it should return Best Practises', async () => {
    // @ts-ignore
    expect(results['best-practices'] >= 0).toBeTruthy();
  });
});

describe('I should be able to get default metrics', () => {
  let results = {};
  beforeAll(async () => {
    const options = {
      url: 'https://google.com',
    };
    results = await lighthouseReport(options);
  });
  it('it should return Seo', async () => {
    // @ts-ignore
    expect(results.seo >= 0).toBeTruthy();
  });
  it('it should return Best Practises', async () => {
    // @ts-ignore
    expect(results['best-practices'] >= 0).toBeTruthy();
  });
  it('it should return Performance', async () => {
    // @ts-ignore
    expect(results.performance >= 0).toBeTruthy();
  });
  it('it should return Accessibility', async () => {
    // @ts-ignore
    expect(results.accessibility >= 0).toBeTruthy();
  });
  it('it should return PWA', async () => {
    // @ts-ignore
    expect(results.pwa >= 0).toBeTruthy();
  });
});

describe('I should be able to get Partial metrics for Authenticated App', () => {
  let results = {};
  beforeAll(async () => {
    const options = {
      url: 'http://automationpractice.multiformis.com/index.php?controller=authentication&back=my-account',
      lighthouse: { onlyCategories: [Categories.bestPractises, Categories.seo] },
      login: {
        username: 'heretohavefun400@gmail.com',
        password: '123456789',
        usernameSelector: '#email',
        passwordSelector: '#passwd',
        buttonSelector: '#SubmitLogin > span > i',
      },
    };
    results = await lighthouseReport(options);
  });
  it('it should return seo', async () => {
    // @ts-ignore
    expect(results.seo >= 0).toBeTruthy();
  });
  it('it should return Best Practises', async () => {
    // @ts-ignore
    expect(results['best-practices'] >= 0).toBeTruthy();
  });
});
