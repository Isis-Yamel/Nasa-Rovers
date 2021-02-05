let store = Immutable.Map({
    choosenRover: 'Curiosity',
    roverInfo: Immutable.Map({}),
    apod: '',
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
    return `
        <header>
            <h1>Mars Rovers Photos</h1>
        </header>
        <main>
        ${roverRenderer}
            <section>
                <h3>Put things on the page!</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>

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
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

const Rovers = (store) => {
    const test = store.get('roverInfo').get('data').get('photos').toJS();

    return test.map(i => {
        return `
            <img src={i.img_src}/>
            <p>${i.earth_date}</p>
        `
    })
}

// ------------------------------------------------------  API CALLS

const getRoverImages = (choosenRover) => {
    fetch(`http://localhost:3000/rovers/${choosenRover}`)
        .then(res => res.json())
        .then(roverInfo => updateStore(store, { roverInfo }))
}
