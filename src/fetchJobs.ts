// src/fetchJobs.ts
import fetch from 'node-fetch';

export interface JobSearchParams {
  title: string;
  location: string;
  radius?: number;
  days_old?: number;
  page?: number;
}

export interface Job {
  title: string;
  company: string;
  description: string;
  salary_min: number;
  salary_max: number;
  salary_pred: boolean;
  contract_type: string;
  contract_time: string;
  location: string;
  date_posted: string;
  url: string;
}

export async function fetchJobs({
  title,
  location,
  radius = 0,
  days_old = 1,
  page = 1,
}: JobSearchParams): Promise<Job[]> {
  const appId = process.env.ADZUNA_APP_ID ?? '';
  const appKey = process.env.ADZUNA_APP_KEY ?? '';

  let url =
    `https://api.adzuna.com/v1/api/jobs/us/search/${page}` +
    `?app_id=${appId}` +
    `&app_key=${appKey}` +
    `&what=${encodeURIComponent(title)}` +
    `&where=${encodeURIComponent(location)}` +
    `&max_days_old=${days_old}` +
    `&results_per_page=50`;

  const miles = radius || 0;
  if (miles > 0) {
    const km = (miles * 1.609).toFixed(1);
    url += `&distance=${km}`;
  }

  const resp = await fetch(url);
  const data: any = await resp.json();
  const results: any[] = data.results || [];

  return results.map((r: any) => ({
    title:          r.title,
    company:        r.company.display_name,
    description:    r.description,
    salary_min:     r.salary_min,
    salary_max:     r.salary_max,
    salary_pred:    r.salary_is_predicted,
    contract_type:  r.contract_type || '—',
    contract_time:  r.contract_time || '—',
    location:       r.location?.display_name || '—',
    date_posted:    r.created,
    url:            r.redirect_url,
  }));
}

