let store = Immutable.Map({
  choosenRover: 'Curiosity',
  roverInfo: Immutable.Map({}),
  rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
});

// add our markup to the page
const root = document.getElementById('root');

const render = async (root, state) => {
  root.innerHTML = App(state);
};

const updateStore = (state, newState) => {
  const store = state.merge(newState);
  render(root, store);
};

// ------------------------------------------------------  COMPONENTS

//guide source template literals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
const NavBar = (store) => store.get('rovers').map(i => (
  `<button class="dashboard__button" onclick="getRoverImages('${i}')"> ${i} </button>`
)).join('')

const Dashboard = (gallery, navBar) => `
  <header class="text__alignment">
    <h1>Mars Rovers Photos</h1>
    <section>
      ${navBar}
    </section>
  </header>
  <main>
    <section class="rovers__layout">
      ${gallery}
    </section>
  </main>
  <footer></footer>
`;

const RoverGallery = (store) => {
  const roverGallery = store.get('roverInfo').get('data').get('latest_photos').toJS();

  if(roverGallery !== undefined) {
    return roverGallery.map(i => {
      return `
        <article class="rover">
          <figure>
            <img class="rover__image" src=${i.img_src} />
            <figcaption class="rover__caption">Photo date: ${i.earth_date}</figcaption>
          </figure>
          <div class="rover__data__container">
            <p><span class="rover__data"> Rover name: </span> ${i.rover.name}</p>
            <p><span class="rover__data"> Rover status: </span> ${i.rover.status}</p>
            <p><span class="rover__data"> Landing date: </span>Landing date: ${i.rover.landing_date}</p>
            <p><span class="rover__data"> Launch date: </span> ${i.rover.launch_date}</p>
          </div>
        </article>
      `
    }).join('')
  }

  return `Hold on, data is coming!!`
};

// ------------------------------------------------------  APP CONTAINER

const App = (state) => {
  const gallery = RoverGallery(state);
  const navBar = NavBar(state);

  return Dashboard(gallery, navBar)
}

// ------------------------------------------------------  API CALLS

const getRoverImages = (choosenRover) => {
  fetch(`http://localhost:3000/rovers/${choosenRover}`)
  .then(res => res.json())
  .then(roverInfo => updateStore(store, { roverInfo }))
};

// ------------------------------------------------------  LOAD LISTENER

window.addEventListener('load', () => {
  getRoverImages(store.get('choosenRover'));
  render(root, store);
});
