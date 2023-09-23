const App = {
    // All selected HTML elements
    $: {
        menu: document.querySelector('[data-id="menu"]'),
        menuItems: document.querySelector('[data-id="menu-items"]'),
        resetBtn: document.querySelector('[data-id="reset-btn"]'),
        newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
        squares: document.querySelectorAll('[data-id="square"]'),
        modal: document.querySelector('[data-id="modal"]'),
        modalText: document.querySelector('[data-id="modal-text"]'),
        modalBtn: document.querySelector('[data-id="modal-btn"]'),
        turn: document.querySelector('[data-id="turn"]'),
    },

    // State to track moves of the game
    state: {
        moves: [],
    },

    getGameStatus(moves) {
        const p1Moves = moves.filter(move => move.playerId === 1).map(move => +move.squareId);
        const p2Moves = moves.filter(move => move.playerId === 2).map(move => +move.squareId);

        const winningPatterns = [
            [1, 2, 3],
            [1, 5, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 5, 7],
            [3, 6, 9],
            [4, 5, 6],
            [7, 8, 9],
        ];

        let winner = null;

        winningPatterns.forEach(pattern => {
            const p1Wins = pattern.every(value => p1Moves.includes(value))
            const p2Wins = pattern.every(value => p2Moves.includes(value))

            if (p1Wins) winner = 1;
            if (p2Wins) winner = 2;
        });

        return {
            status: moves.length === 9 || winner != null ? 'complete' : 'in-progress', // in-progress | complete
            winner // 1 | 2 | null
        }
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

        App.$.modalBtn.addEventListener('click', e => {
            // Reset the state of the app
            App.state.moves = [];
            App.$.squares.forEach(square => square.replaceChildren());
            App.$.modal.classList.add('hidden');
        })

        App.$.squares.forEach(square => {
            square.addEventListener('click', e => {
                // Check if there is already a play. If so, return early
                const hasMove = (squareId) => {
                    const existingMove = App.state.moves.find((move) => move.squareId === squareId);
                    return existingMove !== undefined;
                };

                if (hasMove(+square.id)) {
                    return;
                }

                // Determine which player icon to add to the square
                const lastMove = App.state.moves.at(-1);
                const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
                const currentPlayer = App.state.moves.length === 0 ? 1 : getOppositePlayer(lastMove.playerId);
                const nextPlayer = getOppositePlayer(currentPlayer);

                const squareIcon = document.createElement('i');
                const turnIcon = document.createElement('i');
                const turnLabel = document.createElement('p');
                turnLabel.textContent = `Player ${nextPlayer}, you're up!`

                if (currentPlayer === 1) {
                    squareIcon.classList.add('fa-solid', 'fa-x', 'turquoise');
                    turnIcon.classList.add('fa-solid', 'fa-o', 'yellow');
                    turnLabel.classList = 'yellow';
                } else {
                    squareIcon.classList.add('fa-solid', 'fa-o', 'yellow');
                    turnIcon.classList.add('fa-solid', 'fa-x', 'turquoise');
                    turnLabel.classList = 'turquoise';
                }

                App.$.turn.replaceChildren(turnIcon, turnLabel);

                App.state.moves.push({
                    squareId: +square.id,
                    playerId: currentPlayer,
                });

                square.replaceChildren(squareIcon);

                // Check if there is a winner or a tie game
                const game = App.getGameStatus(App.state.moves);
                
                if (game.status === 'complete') {
                    App.$.modal.classList.remove('hidden');

                    let message = '';
                    if (game.winner) {
                        message = `Player ${game.winner} wins!`;
                    } else {
                        message = 'Tie game!';
                    }

                    App.$.modalText.textContent = message;
                }
            })
        })
    }
}

// Calls the init method when the page loads completely
window.addEventListener('load', App.init);