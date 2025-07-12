// app.js
const form       = document.getElementById('profile-form');
const resultsDiv = document.getElementById('results');

form.addEventListener('submit', async e => {
  e.preventDefault();

  // pull ALL named inputs out of the form
  const { title, location, radius = 0, days_old = 1 } =
    Object.fromEntries(new FormData(form).entries());

  // show a quick loading state
  resultsDiv.innerHTML = `<p>Loading jobs…</p>`;

  try {
    const res = await fetch('/.netlify/functions/search', {
      method:  'POST',
      headers: { 'Content-Type':'application/json' },
      body:    JSON.stringify({ title, location, radius, days_old })
    });

    if (!res.ok) throw new Error(`Function error: ${res.status}`);

    const jobs = await res.json();

    if (jobs.length === 0) {
      resultsDiv.innerHTML = `<p>No jobs found.</p>`;
      return;
    }

    // render a simple table of results
    const rows = jobs.map(j => `
      <tr>
        <td><a href="${j.url}" target="_blank">${j.title}</a><br><small>${j.company}</small></td>
        <td>${j.date_posted.slice(0,10)}</td>
        <td>$${j.salary_min?.toLocaleString()} – $${j.salary_max?.toLocaleString()}</td>
      </tr>
    `).join('');

    resultsDiv.innerHTML = `
      <table border="1" cellpadding="6" cellspacing="0" style="width:100%;border-collapse:collapse">
        <thead><tr>
          <th>Title &amp; Company</th>
          <th>Date Posted</th>
          <th>Salary</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  } catch(err) {
    resultsDiv.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
});

