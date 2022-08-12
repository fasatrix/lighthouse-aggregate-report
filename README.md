# lighthouse-aggregate-report
A Google Lighthouse aggregate Test Reporter

![PDF CI](https://github.com/fasatrix/lighthouse-aggregate-report/actions/workflows/lighthouse.yaml/badge.svg)

### Installation
`npm install lighthouse-aggregate-report`


### Usage
1) Default Lighthouse report (performance, accessibility, pwa, best-practices, seo):
      ```javascript
       import { lighthouseReport } from 'lighthouse-aggregate-report';
       const options = {
          url: 'https://google.com',
       };
       const results = await lighthouseReport(options);
       console.log(results)
       Output:  { performance: 50, 'accessibility': 83, pwa: 88, best-practices: 90, seo:100}
       Assertion: expect(results.performance >= 80).toBeTruthy();
     ```
2)  Only selected metrics (e.g.,  'accessibility', 'pwa'):
      ```javascript
       import { lighthouseReport, Categories } from 'lighthouse-aggregate-report';
       const options = {
          url: 'https://google.com',
          lighthouse: { 
            onlyCategories: [
              Categories.accessibility,
              Categories.pwa
            ] 
          },
       };
       const results = await lighthouseReport(options);
       console.log(results)
       Output:  { 'accessibility': 83, pwa: 88 }
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
       Output: {  performance: 97,  accessibility: 80,   pwa: 50, 'best-practices': 100,  seo: 85, interactive: 100,  'first-contentful-paint': 99 }
       Assertion: expect(results.interactive).to.eq(myThreshold)
    
     ```    

4)  Full head for troubleshooting:
      ```javascript
       import { lighthouseReport } from 'lighthouse-aggregate-report';
       const options = {
         Login: {
             headed: true
         },
       };
       const results = await lighthouseReport(options);
       console.log(results)
       Output:  { 'accessibility': 83, pwa: 88 }
       Assertion: expect(results.accessibility).to.eq(myThreshold)
    
     ```    

## Contribution
Fork, add your changes and create a pull request 

       

