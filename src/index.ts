const lighthouse = require('lighthouse');
import { BrowserContext, chromium } from 'playwright';

const port = 8041;

const login = async (options: IOptions, browser: BrowserContext) => {
  const page = await browser.newPage();
  await page.goto(options.url);
  await page.waitForSelector(options.login!.usernameSelector, { state: 'visible' });
  const usernameInput = await page.$(options.login!.usernameSelector);
  await usernameInput?.type(options.login!.username);

  const passwordInput = await page.$(options.login!.passwordSelector);
  await passwordInput?.type(options.login!.password);
  await Promise.all([page.click(options.login!.buttonSelector), page.waitForNavigation()]);
};

export const lighthouseReport = async (options: IOptions): Promise<IReport> => {
  const userDataDir = './';
  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: true,
    args: [`--remote-debugging-port=${port}`],
    slowMo: 50,
  });
  await browser.clearPermissions();
  await browser.clearCookies();

  if (options.login) {
    await login(options, browser);
  }
  const onlyCategories = ['performance', 'accessibility', 'pwa', 'best-practices', 'seo'];

  const defaultOptions = {
    output: 'html',
    onlyCategories,
    onlyAudits: ['viewport'],
    disableStorageReset: true,
    screenEmulation: { disabled: true },
    port,
  };

  let tempOptions;
  let finalOptions;
  if (options.lighthouse?.onlyCategories?.length === 0) {
    tempOptions = { ...defaultOptions, ...options.lighthouse };
    tempOptions.onlyCategories = onlyCategories;
    finalOptions = tempOptions;
  } else finalOptions = { ...defaultOptions, ...options.lighthouse };

  const runnerResult = await lighthouse(options.url, finalOptions);

  await browser.close();

  const report = {
    performance: runnerResult.lhr.categories.performance ? runnerResult.lhr.categories.performance.score * 100 : 0,
    accessibility: runnerResult.lhr.categories.accessibility
      ? runnerResult.lhr.categories.accessibility.score * 100
      : 0,
    pwa: runnerResult.lhr.categories.pwa ? runnerResult.lhr.categories.pwa.score * 100 : 0,
    'best-practices': runnerResult.lhr.categories['best-practices']
      ? runnerResult.lhr.categories['best-practices'].score * 100
      : 0,
    seo: runnerResult.lhr.categories.seo ? runnerResult.lhr.categories.seo.score * 100 : 0,
  };

  for (const [key] of Object.entries(report)) {
    if (!finalOptions.onlyCategories.includes(key) && finalOptions.onlyCategories.length > 0) {
      // @ts-ignore
      delete report[key];
    }
  }
  return report;
};

export enum Categories {
  performance = 'performance',
  accessibility = 'accessibility',
  pwa = 'pwa',
  bestPractises = 'best-practices',
  seo = 'seo',
}

interface IReport {
  performance?: number;
  accessibility?: number;
  pwa?: number;
  'best-practices'?: number;
  seo?: number;
}

interface IOptions {
  url: string;
  login?: {
    username: string;
    password: string;
    usernameSelector: string;
    passwordSelector: string;
    buttonSelector: string;
  };
  lighthouse?: {
    output?: string;
    onlyCategories?: Categories[];
    onlyAudits?: string[];
    disableStorageReset?: boolean;
    screenEmulation?: { disabled: boolean };
    port?: number;
  };
}
