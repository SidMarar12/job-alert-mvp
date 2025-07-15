import { Job } from './fetchJobs';

export function renderJobsHTML(jobs: Job[]): string {
  if (jobs.length === 0) {
    return `<p>No jobs found.</p>`;
  }

  const rows = jobs.map(j => {
    const desc = j.description
      ? j.description.slice(0, 100).replace(/\s+\S*$/, '…')
      : '—';
    const salary = (j.salary_min != null && j.salary_max != null)
      ? `$${j.salary_min.toLocaleString()} – $${j.salary_max.toLocaleString()}`
      : '—';

    return `
      <tr>
        <td>
          <a href="${j.url}" target="_blank">${j.title}</a><br>
          <small>${j.company}</small>
        </td>
        <td>${j.location}</td>
        <td>${j.contract_type} / ${j.contract_time}</td>
        <td>${j.date_posted.slice(0,10)}</td>
        <td>${desc}</td>
        <td>${salary}</td>
      </tr>
    `;
  }).join('');

  return `
    <table style="width:100%;border-collapse:collapse" border="1" cellpadding="6">
      <thead>
        <tr>
          <th>Title &amp; Company</th>
          <th>Location</th>
          <th>Contract</th>
          <th>Date Posted</th>
          <th>Description</th>
          <th>Salary</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

