// app.js
document.getElementById('profile-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;
  const email     = form.email.value.trim();
  const title     = form.title.value.trim();
  const location  = form.location.value.trim();
  const radius    = form.radius.value.trim() || '0';
  const days_old  = form.days_old.value;

  // send your new params to the Netlify function
  const res = await fetch('/.netlify/functions/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, title, location, radius, days_old })
  });
  const data = await res.json();

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (!data.results || data.results.length === 0) {
    resultsDiv.textContent = 'No jobs found.';
    return;
  }

  // build table
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Title & Company</th>
      <th>Description</th>
      <th>Salary</th>
      <th>Contract</th>
      <th>Location</th>
      <th>Date Posted</th>
    </tr>`;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  data.results.forEach(job => {
    const tr = document.createElement('tr');
    const desc = job.description && job.description.length > 200
      ? job.description.substr(0, 200) + '…'
      : job.description || '';
    const salary = job.salary_min && job.salary_max
      ? `$${job.salary_min.toLocaleString()} – $${job.salary_max.toLocaleString()}`
      : '—';
    const contract = job.contract_type || '—';
    const loc = job.location?.display_name || '—';
    const date = job.created
      ? new Date(job.created).toLocaleDateString()
      : '—';

    tr.innerHTML = `
      <td>
        <a href="${job.redirect_url}" target="_blank">${job.title}</a><br>
        <small>${job.company.display_name}</small>
      </td>
      <td>${desc}</td>
      <td>${salary}</td>
      <td>${contract}</td>
      <td>${loc}</td>
      <td>${date}</td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  resultsDiv.appendChild(table);
});

