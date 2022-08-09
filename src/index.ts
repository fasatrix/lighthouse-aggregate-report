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

export interface IReport {
  performance?: number;
  accessibility?: number;
  pwa?: number;
  'best-practices'?: number;
  seo?: number;
}

interface IOptions {
  /**
   * Description: The URL to be analysed
   * @required
   */
  url: string;
  /**
   * Description: The login details if authentication is required
   */
  login?: {
    /**
     * Description: The username required for authentication
     * @required if login is needed
     */
    username: string;
    /**
     * Description: The password required for authentication
     * @required if login is needed
     */
    password: string;
    /**
     * Description: The username input box selector (accepts all types: CSS, XPATH, or Text)
     * @required if login is needed
     */
    usernameSelector: string;
    /**
     * Description: The password input box selector (accepts all types: CSS, XPATH, or Text)
     * @required if login is needed
     */
    passwordSelector: string;
    /**
     * Description: The submit button selector (accepts all types: CSS, XPATH, or Text) required to submit the Login details
     * @required if login is needed
     */
    buttonSelector: string;
  };
  lighthouse?: {
    /**
     * Description: The desired Lighthouse metrics to be generated
     * @default 'performance', 'accessibility', 'pwa', 'best-practices', 'seo'
     * @valid all in Categories enum
     */
    onlyCategories?: Categories[];
    /**
     * Description: Port to run the chromium listener
     * @default 8041
     */
    port?: number;
  };
}
