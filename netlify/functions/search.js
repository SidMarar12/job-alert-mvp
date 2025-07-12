// netlify/functions/search.js
const fetch = require('node-fetch');

exports.handler = async ({ body }) => {
  const { title, location, radius, days_old = 1 } = JSON.parse(body);

  // build the base URL
  let url = `https://api.adzuna.com/v1/api/jobs/us/search/1`
    + `?app_id=${process.env.ADZUNA_APP_ID}`
    + `&app_key=${process.env.ADZUNA_APP_KEY}`
    + `&what=${encodeURIComponent(title)}`
    + `&where=${encodeURIComponent(location)}`
    + `&max_days_old=${days_old}`;

  // only include distance if the user entered a positive radius
  const miles = Number(radius) || 0;
  if (miles > 0) {
    const km = (miles * 1.609).toFixed(1);
    url += `&distance=${km}`;
  }

  // fetch from Adzuna
  const response = await fetch(url);
  const data     = await response.json();
  const results  = data.results || [];

  // map to the fields you render in app.js
  const jobs = results.map(r => ({
    title:         r.title,
    company:       r.company?.display_name || '—',
    location:      r.location?.display_name   || '—',
    description:   r.description               || '',
    salary_min:    r.salary_min                || 0,
    salary_max:    r.salary_max                || 0,
    salary_pred:   r.salary_is_predicted       || false,
    contract_type: r.contract_type             || '—',
    contract_time: r.contract_time             || '—',
    date_posted:   r.created                   || '',
    url:           r.redirect_url              || ''
  }));

  return {
    statusCode: 200,
    body:       JSON.stringify(jobs)
  };
};

