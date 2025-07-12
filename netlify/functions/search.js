const fetch = require('node-fetch');

exports.handler = async ({ body }) => {
  const { title, location, radius, days_old = 1 } = JSON.parse(body);

  // build the base URL
  let url = `https://api.adzuna.com/v1/api/jobs/us/search/1`
    + `?app_id=${process.env.ADZUNA_APP_ID}`
    + `&app_key=${process.env.ADZUNA_APP_KEY}`
    + `&what=${encodeURIComponent(title)}`
    + `&where=${encodeURIComponent(location)}`
    + `&max_days_old=${days_old}`;      // ← dynamic window

  // if radius was supplied, convert to km and append
  if (radius) {
    const km = (radius * 1.609).toFixed(1);
    url += `&distance=${km}`;
  }

  const response = await fetch(url);
  const data     = await response.json();
  const results  = data.results || [];

  // map to the fields you already render
  const jobs = results.map(r => ({
    title:         r.title,
    company:       r.company.display_name,
    description:   r.description,
    salary_min:    r.salary_min,
    salary_max:    r.salary_max,
    salary_pred:   r.salary_is_predicted,
    contract_type: r.contract_type || '—',
    contract_time: r.contract_time || '—',
    date_posted:   r.created,
    url:           r.redirect_url
  }));

  return {
    statusCode: 200,
    body:       JSON.stringify(jobs)
  };
};

