const fetch = require('node-fetch');

exports.handler = async ({ body }) => {
  const { title, location } = JSON.parse(body);
  const resp = await fetch(
    `https://api.adzuna.com/v1/api/jobs/us/search/1`
    + `?app_id=${process.env.ADZUNA_APP_ID}`
    + `&app_key=${process.env.ADZUNA_APP_KEY}`
    + `&what=${encodeURIComponent(title)}`
    + `&where=${encodeURIComponent(location)}`
    + `&max_days_old=1`
  );
  const { results } = await resp.json();

  // Keep only Permanent + Full-time
  const filtered = results.filter(r =>
    r.contract_type === 'permanent' &&
    r.contract_time === 'full_time'
  );

  const jobs = filtered.map(r => ({
    title:         r.title,
    company:       r.company.display_name,
    description:   r.description,
    salary_min:    r.salary_min,
    salary_max:    r.salary_max,
    salary_pred:   r.salary_is_predicted,
    contract_type: r.contract_type,   // new
    contract_time: r.contract_time,   // new
    date_posted:   r.created,
    url:           r.redirect_url
  }));

  return {
    statusCode: 200,
    body:       JSON.stringify(jobs)
  };
};

