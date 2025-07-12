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

  const jobs = results.map(r => ({
    title:         r.title,
    company:       r.company.display_name,
    description:   r.description,        // short snippet
    salary_min:    r.salary_min,         // number or null
    salary_max:    r.salary_max,         // number or null
    salary_pred:   r.salary_is_predicted, // 0 or 1
    date_posted:   r.created,            // ISO timestamp
    url:           r.redirect_url
  }));

  return {
    statusCode: 200,
    body:       JSON.stringify(jobs)
  };
};

