let store = Immutable.Map({
    choosenRover: 'Curiosity',
    roverInfo: Immutable.Map({}),
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
});

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (state, newState) => {
    const store = state.merge(newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}

// create content
const App = (state) => {
    const roverRenderer = Rovers(state);
    const renderNavBar = navBar(state);
    return `
        <header class="text__alignment">
            <h1>Mars Rovers Photos</h1>
            ${renderNavBar}
        </header>
        <main>
            <h2 class="text__alignment">This are the latest photos</h2>
            <section class="rovers__layout">
                ${roverRenderer}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    getRoverImages(store.get('choosenRover'));
    render(root, store);
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const navBar = (store) => {
    return store.get('rovers').map(i => {
        return `<button onclick="getRoverImages('${i}')"> ${i} </button>`
    }).join('')
}

const Rovers = (store) => {
    const test = store.get('roverInfo').get('data').get('photos').toJS();

    return test.map(i => {
        return `
            <article class="rover">
                <img class="rover__image" src=${i.img_src} />
                <p>${i.earth_date}</p>
            </article>
        `
    }).join('')
}

// ------------------------------------------------------  API CALLS

const getRoverImages = (choosenRover) => {
    fetch(`http://localhost:3000/rovers/${choosenRover}`)
        .then(res => res.json())
        .then(roverInfo => updateStore(store, { roverInfo }))
}
