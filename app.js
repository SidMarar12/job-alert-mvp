document.getElementById('profile-form').onsubmit = async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const res  = await fetch('/.netlify/functions/search', {
    method: 'POST',
    body:   JSON.stringify(data)
  });
  const jobs = await res.json();
  document.getElementById('results').innerHTML =
    jobs
      .map(j => `<p><a href="${j.url}" target="_blank">${j.title}</a> @ ${j.company}</p>`)
      .join('');
};

