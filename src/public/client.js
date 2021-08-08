let store = Immutable.Map({
    rovers: [],
    currentRover:'',
    roverPhotos:[],
})

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (state, newState) => {
    store = state.merge(newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    const rovers = state.get('rovers')
    const roverPhotos= state.get('roverPhotos')
    const currentRover= rovers.find(rover => rover.name.toLowerCase() === state.get('currentRover')) || ''

    return `
        <header>${RoversList(rovers)}</header>
        <main>
            <section class="card-list">
                ${RoverCard(currentRover)}
            </section>
            <section class="card-list">                
                ${PhotosList(roverPhotos)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

const RoversList = (rovers) => {
    if (rovers.length === 0 ) {
        getRovers(store)
        return(`Loading...`)
    }
    return rovers.map(RoverTab).join('')
}

const RoverTab = (rover) =>{
    const {name} = rover
    
    return(`
    <div class="rover-tab" onclick="onHandlerRover('${name}')">
        <h3>${name}</h3>
    </div>
    `)
}
const RoverCard = (rover) =>{
    if(!rover)return(``)
    const {name, landing_date, launch_date, status, max_date} = rover
    
    return(`
    <div class="card" onclick="onHandlerRover('${name}')">
        <h3>${name}</h3>
        <p>Launch date:</p>
        <p> ${launch_date}</p>
        <p>Landing date:</p>
        <p> ${landing_date}</p>
        <p>Last date:</p>
        <p> ${max_date}</p>
        <p class="${status}">${status}</p>
    </div>
    `)
}

const PhotosList = (roverPhotos) => {
    if (roverPhotos.length === 0 ) {
        return(``)
    }
    return roverPhotos.map(Photo).join('')
}

const Photo = (photo) =>{
    const {cam_name, date, img} = photo
    
    return(`
    <div class="card-photo">
        <img src="${img}" class="photo" />
        <p>Cam:</p>
        <p> ${cam_name}</p>
        <p>Date:</p>
        <p> ${date}</p>
    </div>
    `)
}

// ------------------------------------------------------  EVENT HANDLERS

const onHandlerRover = (rover) => {
    const roverName =  rover.toLowerCase()
    getRoverPhotos(store,roverName)
}



// ------------------------------------------------------  API CALLS

const getRovers = (state) => {
    fetch(`http://localhost:3000/api/rovers`)
        .then(res => res.json())
        .then(res => res.data)
        .then(rovers => updateStore(state, { rovers }))
}

const getRoverPhotos = (state,rover) => {
    fetch(`http://localhost:3000/api/rovers/${rover}`)
        .then(res => res.json())
        .then(res => res.data)
        .then(roverPhotos => updateStore(state, { roverPhotos, currentRover:rover }))
}