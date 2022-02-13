const API_KEY = "7x5gAYk5Sf13uJ2stYjOr9SOPf3KWCfC4JifLbqt";

let state = {
  date: new Date(),
  data: {},
  error: null,
};

const DOMelements = {
  dateInput: document.getElementById("date"),
  main: document.querySelector(".main"),
};

const fetchData = async (date) => {
  try {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

async function setUp() {
  const date = DOMelements.dateInput.value;
  DOMelements.main.innerHTML = '<div class="loading">Loading...</div>';

  try {
    const data = await fetchData(date);
    setState({ date, data, error: null });
  } catch (error) {
    setState({ error: error.message, date, data: {} });
  }
}

function setState(newState) {
  state = { ...state, ...newState };
  renderDOM(state);
}

function renderDOM(state) {
  DOMelements.main.innerHTML = createMainPage(state);
}

function createMainPage(state) {
  const { data, error } = state;
  let isVideo = false;
  if (data.media_type === "video") isVideo = true;
  return `
		<section class="content">
			${(() => {
        if (state.error) return `<h2 class="error">Error : ${error}</h2>`;
        return `<h2>${data.title}</h2>
								${
                  isVideo
                    ? `<iframe src="${data.url}"></iframe>`
                    : `<img src="${data.url}" alt="nasa-image" />`
                }
								<p>${data.explanation}</p>`;
      })()}
		</section>
	`;
}

DOMelements.dateInput.valueAsDate = new Date();
DOMelements.dateInput.onchange = setUp;
setUp();
