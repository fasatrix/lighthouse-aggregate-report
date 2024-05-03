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
  'best-practices'?: number;
  seo?: number;
};

export enum Categories {
  performance = 'performance',
  accessibility = 'accessibility',
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

export interface IOptions {
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
  /**
   * Description: If set to true an html report will be created under /reports
   *
   * @default false
   */
  htmlReport?: boolean;
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
     * @default 'performance', 'accessibility', 'best-practices', 'seo'
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
