import { fetchJobs } from './fetchJobs';
import { renderJobsHTML } from './renderJobs';

const form       = document.getElementById('profile-form') as HTMLFormElement;
const resultsDiv = document.getElementById('results')!;

form.addEventListener('submit', async e => {
  e.preventDefault();
  const { title, location, radius = '0', days_old = '1' } =
    Object.fromEntries(new FormData(form).entries()) as Record<string,string>;

  resultsDiv.innerHTML = '<p>Loading jobs…</p>';
  try {
    const jobs = await fetchJobs({ title, location, radius: Number(radius), days_old: Number(days_old) });
    resultsDiv.innerHTML = renderJobsHTML(jobs);
  } catch(err) {
    resultsDiv.innerHTML = `<p style="color:red">Error: ${(err as Error).message}</p>`;
  }
});
