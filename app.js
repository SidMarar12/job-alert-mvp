document.getElementById('profile-form').onsubmit = async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const res  = await fetch('/.netlify/functions/search', {
    method: 'POST',
    body:   JSON.stringify(data)
  });
  const jobs = await res.json();

  const rows = jobs.map(j => {
    // salary formatting
    let salary = 'N/A';
    if (j.salary_min != null && j.salary_max != null) {
      salary = `$${j.salary_min.toLocaleString()}–$${j.salary_max.toLocaleString()}`;
      if (j.salary_pred) salary += ' (est.)';
    }
    // date formatting
    const date = new Date(j.date_posted).toLocaleDateString();

    // humanize contract
    const contract = `${j.contract_type.replace('_',' ')} / ${j.contract_time.replace('_',' ')}`;

    return `
      <tr>
        <td>
          <a href="${j.url}" target="_blank">${j.title}</a><br>
          <small>${j.company}</small>
        </td>
        <td>${j.description}</td>
        <td>${salary}</td>
        <td>${contract}</td>               <!-- new column -->
        <td>${date}</td>
      </tr>
    `;
  }).join('');

  document.getElementById('results').innerHTML = `
    <table border="1" cellpadding="6">
      <thead>
        <tr>
          <th>Job Title & Company</th>
          <th>Description</th>
          <th>Salary Range</th>
          <th>Contract</th>               <!-- new header -->
          <th>Date Posted</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
};

