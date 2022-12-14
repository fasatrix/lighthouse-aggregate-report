const lighthouse = require('lighthouse');
import { BrowserContext, chromium } from 'playwright';
import { mobileConfig, desktopConfig } from './helpers/helpers';

const port = 8041;

const login = async (options: IOptions, browser: BrowserContext) => {
  const page = await browser.newPage();
  await page.goto(options.Login!.loginUrl ?? options.targetUrl);
  await page.waitForSelector(options.Login!.usernameSelector, { state: 'visible' });
  const usernameInput = await page.$(options.Login!.usernameSelector);
  await usernameInput?.type(options.Login!.username);

  const passwordInput = await page.$(options.Login!.passwordSelector);
  await passwordInput?.type(options.Login!.password);
  await Promise.all([page.click(options.Login!.buttonSelector), page.waitForNavigation()]);
};

export const flagsSettings = (flags: IOptions) => {
  const onlyCategories = [
    Categories.performance,
    Categories.accessibility,
    Categories.pwa,
    Categories.bestPractises,
    Categories.seo,
  ];

  const onlyAudits = [Audits.firstContentfulPaint, Audits.interactive, Audits.resourceSummary];

  const defaultFlags = {
    output: 'html',
    onlyCategories,
    onlyAudits,
    port,
  };

  const finalFlags = { ...defaultFlags, ...flags.lighthouse };

  // if both Login and Authorization token is provided, default will be Login
  if (finalFlags.extraHeaders && flags.Login) {
    delete finalFlags.extraHeaders;
  }

  if (finalFlags.onlyCategories.length === 0) {
    finalFlags.onlyCategories = onlyCategories;
  }

  if (finalFlags.onlyAudits.length === 0) {
    finalFlags.onlyAudits = onlyAudits;
  }
  return finalFlags;
};

export const lighthouseReport = async (options: IOptions): Promise<IReport> => {
  const userDataDir = './';
  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: !options.Login?.headed,
    args: [
      `--remote-debugging-port=${port}`,
      '--disable-gpu',
      '--disable-logging',
      '--disable-dev-shm-usage',
      '--no-sandbox',
    ],
    slowMo: 50,
    timeout: 24000000,
    ignoreHTTPSErrors: true,
  });

  await browser.clearPermissions();
  await browser.clearCookies();

  if (options.Login) {
    await login(options, browser);
  }

  const finalFlags = flagsSettings(options);

  const config = options.isMobile ? mobileConfig : desktopConfig;

  const runnerResult = await lighthouse(options.targetUrl, finalFlags, config);

  await browser.close();

  let report: IReport = {};
  if (runnerResult.lhr.runtimeError) {
    report = {
      error: {
        requestedUrl: runnerResult.lhr.requestedUrl ?? runnerResult.lhr.requestedUrl,
        runtimeError: runnerResult.lhr.runtimeError ?? runnerResult.lhr.runtimeError,
        runWarnings: runnerResult.lhr.runWarnings[0] ?? runnerResult.lhr.runWarnings[0],
        userAgent: runnerResult.lhr.userAgent ?? runnerResult.lhr.userAgent,
        environment: runnerResult.lhr.environment ?? runnerResult.lhr.environment,
      },
    };
  } else {
    for (const category of finalFlags.onlyCategories) {
      for (const [key] of Object.entries(runnerResult.lhr.categories)) {
        if (key.includes(category) && runnerResult.lhr.categories[key].score * 100 > 0) {
          report[category] = runnerResult.lhr.categories[key].score * 100;
        }
      }
    }
    for (const audit of finalFlags.onlyAudits) {
      for (const [key] of Object.entries(runnerResult.lhr.audits)) {
        if (key.includes(audit) && runnerResult.lhr.audits[key].score * 100 > 0) {
          report[audit] = runnerResult.lhr.audits[key].score * 100;
        }
        if (
          key === Audits.resourceSummary &&
          runnerResult.lhr.audits[Audits.resourceSummary].details.items.length > 0
        ) {
          const total = runnerResult.lhr.audits['resource-summary'].details.items.filter(
            (item: { resourceType: string }) => item.resourceType === 'total',
          );
          report[Audits.resourceSummary] = {
            requestCount: total[0].requestCount,
            transferSize: total[0].transferSize / 1000,
          };
        }
      }
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

export enum Audits {
  firstContentfulPaint = 'first-contentful-paint',
  firstMeaningfulPaint = 'first-meaningful-paint',
  largestContentfulPaint = 'largest-contentful-paint',
  largestContentfulPaintAllFrames = 'largest-contentful-paint-all-frames',
  cumulativeLayoutShift = 'cumulative-layout-shift',
  maxPotentialFid = 'max-potential-fid',
  totalBlockingTime = 'total-blocking-time',
  interactive = 'interactive',
  speedIndex = 'speed-index',
  redirects = 'redirects',
  viewport = 'viewport',
  resourceSummary = 'resource-summary',
}

export type IReport = {
  error?: {
    requestedUrl?: string;
    runtimeError?: {
      code?: string;
      message?: string;
    };
    runWarnings?: string;
    userAgent?: string;
    environment?: string;
  };
  [key: string]: any;
  performance?: number;
  accessibility?: number;
  pwa?: number;
  'best-practices'?: number;
  seo?: number;
};

interface IOptions {
  /**
   * Description: The URL to be analysed
   *
   * @required
   */
  targetUrl: string;
  /**
   * Description: The flag to set the type of report (mobile or desktop)
   *
   * @default false
   */
  isMobile?: boolean;
  Login?: {
    /**
     * Description: The URL to be used to Login if redirect to Login is not provided by the Target URL
     *
     * @required if login is needed
     */
    loginUrl?: string;
    /**
     * Description: The username required for authentication
     *
     * @required if login is needed
     */
    username: string;
    /**
     * Description: The password required for authentication
     *
     * @required if login is needed
     */
    password: string;
    /**
     * Description: The username input box selector (accepts all types: CSS, XPATH, or Text)
     *
     * @required if login is needed
     */
    usernameSelector: string;
    /**
     * Description: The password input box selector (accepts all types: CSS, XPATH, or Text)
     *
     * @required if login is needed
     */
    passwordSelector: string;
    /**
     * Description: The submit button selector (accepts all types: CSS, XPATH, or Text) required to submit the Login details
     *
     * @required if login is needed
     */
    buttonSelector: string;
    /**
     * Description: If true will open the browser
     *
     */
    headed?: boolean;
  };
  lighthouse?: {
    /**
     * Description: The desired Lighthouse audit metrics to be generated
     *
     * @default 'interactive', 'first-contentful-paint'
     * @valid all in Audits enum
     */
    onlyAudits?: Audits[];
    /**
     * Description: The desired Lighthouse metrics to be generated
     *
     * @default 'performance', 'accessibility', 'pwa', 'best-practices', 'seo'
     * @valid all in Categories enum
     */
    onlyCategories?: Categories[];
    /**
     * Description: The Authorization token to be used as headers if authentication is required (NOTE: This parameter is mutual exclusive with Login)
     *
     * @examples  e.g. "Bearer XAGAJJALLLA", "Basic XYOASJJSLLS="
     */
    extraHeaders?: {
      Authorization?: string;
    };
    /**
     * Description: Port to run the chromium listener
     *
     * @default 8041
     */
    port?: number;
    /**
     * Description: Enable Lighthouse debugging mode
     *
     * @default false
     */
    debug?: boolean;
  };
}
