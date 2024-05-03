# lighthouse-aggregate-report
A Google Lighthouse aggregate Test Reporter

![PDF CI](https://github.com/fasatrix/lighthouse-aggregate-report/actions/workflows/lighthouse.yaml/badge.svg)

### Installation
`npm install lighthouse-aggregate-report`


### Usage
More examples can be found inspecting the [Tests](https://github.com/fasatrix/lighthouse-aggregate-report/blob/main/src/__tests__/test.ts)

1) Default Lighthouse report (performance, accessibility, best-practices, seo):
      ```javascript
       import { lighthouseReport } from 'lighthouse-aggregate-report';
       const options = {
            url: 'https://google.com',
       };
       const results = await lighthouseReport(options);
       console.log(results)
       Output:  { performance: 50, 'accessibility': 83, best-practices: 90, seo:100}
       Assertion: expect(results.performance >= 80).toBeTruthy();
     ```
2)  Only selected metrics (e.g.,  'accessibility'):
      ```javascript
       import { lighthouseReport, Categories } from 'lighthouse-aggregate-report';
       const options = {
            url: 'https://google.com',
            lighthouse: { 
            onlyCategories: [
                Categories.accessibility,
            ] 
          },
       };
       const results = await lighthouseReport(options);
       console.log(results)
       Output:  { 'accessibility': 83 }
       Assertion: expect(results.accessibility).to.eq(myThreshold)
    
     ```
3)  Selected Audit metrics:
      ```javascript
       import { lighthouseReport, Audits } from 'lighthouse-aggregate-report';
       const options = {
            targetUrl: 'https://google.com',
            lighthouse: {
              onlyAudits: [
                  Audits.firstContentfulPaint,
                  Audits.interactive
              ],
           },
       };
       const results = await lighthouseReport(options);
       console.log(results)
       Output: {  performance: 97,  accessibility: 80, 'best-practices': 100,  seo: 85, interactive: 100,  'first-contentful-paint': 99 }
       Assertion: expect(results.interactive).to.eq(myThreshold)
    
     ```    

4)  Full head (will open the browser) to troubleshoot the Login (set `headed=true` in the `Login` parameter):
      ```javascript
       import { lighthouseReport } from 'lighthouse-aggregate-report';
       const options = {
            Login: {
                headed: true
            },
       }; 
     ``` 
5)  Mobile Report (set `isMobile=true`):
      ```javascript
       import { lighthouseReport } from 'lighthouse-aggregate-report';
        const options = {
             isMobile: true,
             targetUrl: 'https://google.com',
        };

     ```       
6)  Generate HTML Report (set `htmlReport=true`):
      ```javascript
       import { lighthouseReport } from 'lighthouse-aggregate-report';
        const options = {
             htmlReport: true,
             targetUrl: 'https://google.com',
        };
     ```        

7)  Debug errors (set `debug=true`):
      ```javascript
       import { lighthouseReport } from 'lighthouse-aggregate-report';
       const options = {
            targetUrl: 'https://notavalidurl.com/',
            lighthouse: {
               debug: true,
            },
       };
      results = await lighthouseReport(options);
      console.log(results.error)
     ```     


## Contribution
Fork, add your changes and create a pull request 

       

