// app.js
const form       = document.getElementById('profile-form');
const resultsDiv = document.getElementById('results');

form.addEventListener('submit', async e => {
  e.preventDefault();

  // pull ALL named inputs out of the form
  const { title, location, radius = 0, days_old = 1 } =
    Object.fromEntries(new FormData(form).entries());

  resultsDiv.innerHTML = `<p>Loading jobs…</p>`;

  try {
    const res = await fetch('/.netlify/functions/search', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ title, location, radius, days_old })
    });
    if (!res.ok) throw new Error(`Function error: ${res.status}`);

    const jobs = await res.json();
    if (jobs.length === 0) {
      resultsDiv.innerHTML = `<p>No jobs found.</p>`;
      return;
    }

    // build table rows, truncating description to 100 chars
    const rows = jobs.map(j => {
      const desc = j.description
        ? (j.description.slice(0, 100).replace(/\s+\S*$/, '…'))
        : '—';
      return `
        <tr>
          <td>
            <a href="${j.url}" target="_blank">${j.title}</a><br>
            <small>${j.company}</small>
          </td>
          <td>${j.location || '—'}</td>
          <td>${j.contract_type} / ${j.contract_time}</td>
          <td>${j.date_posted.slice(0,10)}</td>
          <td>${desc}</td>
          <td>$${j.salary_min?.toLocaleString()} – $${j.salary_max?.toLocaleString()}</td>
        </tr>
      `;
    }).join('');

    resultsDiv.innerHTML = `
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
  } catch(err) {
    resultsDiv.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
});

