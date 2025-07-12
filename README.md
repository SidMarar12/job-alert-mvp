# Job Alert MVP

This project is a minimal viable product that provides users with real-time job alerts for positions posted in the last 24 hours. It features a static frontend and Netlify serverless functions powered by the Adzuna API.

## Overview

Users submit their email address, desired job title, and location. The application then retrieves relevant job postings from Adzuna, filters for those posted within the last 24 hours, and displays them directly in the browser.

## Features

* Static HTML form interface (`index.html`)
* Client-side logic in `app.js` for form submission and result rendering
* Serverless function (`netlify/functions/search.js`) to query Adzuna with `max_days_old=1`
* Environment variable support for Adzuna credentials (`ADZUNA_APP_ID`, `ADZUNA_APP_KEY`)
* Local development using the Netlify CLI (`netlify dev`)
* Automatic deployment through Netlify’s GitHub integration

## Current Status

* Form interface and frontend logic complete
* Serverless search function implemented and tested
* Environment variables configured for API credentials
* Local development workflow verified
* Continuous deployment configured on Netlify

## Prerequisites

* Node.js (version 14 or later)
* npm package manager
* Netlify CLI (`npm install -g netlify-cli`)
* Adzuna developer account for API credentials

## Local Setup and Development

1. Clone the repository:

   ```bash
   git clone git@github.com:SidMarar12/job-alert-mvp.git
   cd job-alert-mvp
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Set environment variables:

   ```bash
   netlify env:set ADZUNA_APP_ID <your_app_id>
   netlify env:set ADZUNA_APP_KEY <your_app_key>
   ```
4. Start the local development server:

   ```bash
   netlify dev
   ```
5. Open a browser at `http://localhost:8888` and verify functionality.

## Deployment

The project is linked to Netlify via the Netlify CLI. Pushing to the `main` branch on GitHub triggers an automatic build and deploy to the public URL:

```
https://job-alert-mvp.netlify.app/
```

You may assign a custom domain through the Netlify dashboard if desired.

## Next Steps

1. Implement scheduled email alerts at 8 AM PST using a cron-style serverless function.
2. Integrate an email delivery service (e.g., SendGrid, Mailgun) for notifications.
3. Store user profiles and preferences in a database for recurring alerts.
4. Enhance the user interface with improved styling, pagination, and error handling.
5. Add user authentication and preference management.

---

*This document reflects the current state of the project and serves as a guide for future development.*

