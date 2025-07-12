document.getElementById('profile-form').onsubmit = async e => {
  e.preventDefault();

  // grab everything from the form
  const formData = Object.fromEntries(new FormData(e.target));

  // coerce types
  const payload = {
    email:    formData.email,
    title:    formData.title,
    location: formData.location,
    // only send radius if the user entered one
    radius:   formData.radius ? parseFloat(formData.radius) : undefined,
    // days_old will always be one of [1,2,7]
    days_old: parseInt(formData.days_old, 10)
  };

  // call our Netlify function
  const res = await fetch('/.netlify/functions/search', {
    method: 'POST',
    body:   JSON.stringify(payload)
  });
  const jobs = await res.json();

  // ... your existing rendering logic goes here ...
};

