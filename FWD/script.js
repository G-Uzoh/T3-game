const App = {
    // All selected HTML elements
    $: {
        menu: document.querySelector('[data-id="menu"]'),
        menuItems: document.querySelector('[data-id="menu-items"]'),
        resetBtn: document.querySelector('[data-id="reset-btn"]'),
        newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
        squares: document.querySelectorAll('[data-id="square"]'),
    },

    // Initializes the app
    init() {
        App.registerEventListeners()
    },

    // A separate space to store event listeners
    registerEventListeners() {
        App.$.menu.addEventListener('click', (e) => {
            App.$.menuItems.classList.toggle('hidden');
        });
        
        App.$.resetBtn.addEventListener('click', e => console.log('Reset the game!'));

        App.$.newRoundBtn.addEventListener('click', e => console.log('Add a new round!'));

        App.$.squares.forEach(square => {
            square.addEventListener('click', e => {
                console.log(`Square with id ${e.target.id} was clicked.`);
            })
        })
    }
}

// Calls the init method when the page loads completely
window.addEventListener('load', App.init);