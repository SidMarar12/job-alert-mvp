// netlify/functions/search.js
const fetch = require('node-fetch');

exports.handler = async ({ body }) => {
  // accept an optional `page` and hard-code 50 per page
  const { title, location, radius, days_old = 1, page = 1 } = JSON.parse(body);

  // build the base URL (page number goes in the path)
  let url = `https://api.adzuna.com/v1/api/jobs/us/search/${page}`
    + `?app_id=${process.env.ADZUNA_APP_ID}`
    + `&app_key=${process.env.ADZUNA_APP_KEY}`
    + `&what=${encodeURIComponent(title)}`
    + `&where=${encodeURIComponent(location)}`
    + `&max_days_old=${days_old}`
    + `&results_per_page=50`;

  // only include distance if the user entered a positive radius
  const miles = Number(radius) || 0;
  if (miles > 0) {
    const km = (miles * 1.609).toFixed(1);
    url += `&distance=${km}`;
  }

  const response = await fetch(url);
  const data     = await response.json();
  const results  = data.results || [];

  // map down to just the fields you render
  const jobs = results.map(r => ({
    title:         r.title,
    company:       r.company.display_name,
    description:   r.description,
    salary_min:    r.salary_min,
    salary_max:    r.salary_max,
    salary_pred:   r.salary_is_predicted,
    contract_type: r.contract_type || '—',
    contract_time: r.contract_time || '—',
    location:      r.location?.display_name || '—',
    date_posted:   r.created,
    url:           r.redirect_url
  }));

  return {
    statusCode: 200,
    body:       JSON.stringify(jobs)
  };
};

