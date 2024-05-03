const lighthouse = require('lighthouse');
import { BrowserContext, chromium } from 'playwright';
import { mobileConfig, desktopConfig } from './helpers/helpers';
import { Audits, Categories, IOptions, IReport } from './helpers/types';
import { generateHtmlReport } from './helpers/report';

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
  const onlyCategories = [Categories.performance, Categories.accessibility, Categories.bestPractises, Categories.seo];

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

  // generate HTML report if htmlReport is set to rue
  if (options.htmlReport) generateHtmlReport(runnerResult, options);

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
