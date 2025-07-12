// app.js
const form       = document.getElementById('profile-form');
const resultsDiv = document.getElementById('results');

form.onsubmit = async e => {
  e.preventDefault();
  resultsDiv.innerHTML = '<p>Loading…</p>';

  // 1) pull in all the form values
  const fd = Object.fromEntries(new FormData(form));
  const payload = {
    email:    fd.email,
    title:    fd.title,
    location: fd.location,
    radius:   fd.radius ? parseFloat(fd.radius) : undefined,
    days_old: parseInt(fd.days_old, 10)
  };

  try {
    // 2) hit your Netlify function
    const res  = await fetch('/.netlify/functions/search', {
      method: 'POST',
      body:   JSON.stringify(payload),
    });
    const jobs = await res.json();

    // 3) no results?
    if (!jobs.length) {
      resultsDiv.innerHTML = '<p>No jobs found in that window/radius.</p>';
      return;
    }

    // 4) build a table
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Title &amp; Company</th>
          <th>Description</th>
          <th>Salary</th>
          <th>Contract</th>
          <th>Date Posted</th>
        </tr>
      </thead>
    `;
    const tbody = document.createElement('tbody');

    jobs.forEach(job => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="padding:4px; border:1px solid #ccc">
          <a href="${job.url}" target="_blank">${job.title}</a><br>
          <small>${job.company}</small>
        </td>
        <td style="padding:4px; border:1px solid #ccc">
          ${job.description.replace(/(<([^>]+)>)/gi, '').slice(0,150)}…
        </td>
        <td style="padding:4px; border:1px solid #ccc">
          ${job.salary_min ? `$${job.salary_min}` : '–'} – ${job.salary_max ? `$${job.salary_max}` : '–'}
        </td>
        <td style="padding:4px; border:1px solid #ccc">
          ${job.contract_type || '–'}
        </td>
        <td style="padding:4px; border:1px solid #ccc">
          ${new Date(job.date_posted).toLocaleDateString()}
        </td>
      `;
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    resultsDiv.innerHTML = '';      // clear “Loading…”
    resultsDiv.appendChild(table);
  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML = '<p style="color:red">Error loading jobs. Check console.</p>';
  }
};

