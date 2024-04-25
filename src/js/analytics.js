const BASE_URL = 'https://www.analytics.weniv.co.kr';

function sendPageViewData() {
  fetch(`${BASE_URL}/collect/pageview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: window.location.href }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      sessionStorage.setItem('session_id', data.session_id);
      console.log(data);
    })
    .catch((error) => console.error('Error:', error));
}

window.addEventListener('load', sendPageViewData);
