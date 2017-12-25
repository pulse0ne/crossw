<template>
    <div id="app">
        <div v-if="view === 'board'" class="view">
            <Board
                :board-data="data"
                :on-cell-clicked="onCellClicked"
                :selected-cells="selectedCells"
                :input-data="inputData"
                :check-answers="checkAnswers" />

            <ClueArea
                :clue="clue"
                :openSelectView="changeViewToSelect"
                :openListView="changeViewToList"
                :openInfoView="changeViewToInfo"
                :openPuzzleMenu="openPuzzleMenu" />

            <div class="v-spacer"></div>

            <Keyboard :key-pressed="onCellInput" />
        </div>
        <div v-if="view === 'select'" class="view">
            <SelectView
                :puzzle-files="puzzles"
                :on-puzzle-chosen="onPuzzleChosen"
                :completed="completedPuzzles"
                :inProgress="inProgress()"
                :lastPuzzle="lastPuzzle.puzzle" />
        </div>
        <div v-if="view === 'info'" class="view">
            <h2>{{ data.title }}</h2>
            <h4 class="info-notes">{{ data.notes || 'No notes' }}</h4>
            <span>Made for Ally, with love, by Tyler</span>
            <div class="puzzle-menu-button" @click="changeViewToBoard()">
                Close
            </div>
        </div>

        <modal name="puzzle-menu" width="90%" height="auto" class="puzzle-menu">
            <div class="puzzle-menu-button" @click="clearBoard()">
                Clear board
            </div>
            <div class="puzzle-menu-button" @click="toggleCheckAnswers()">
                Check answers:{{ checkAnswers ? ' on' : ' off' }}
            </div>
            <div class="puzzle-menu-button" @click="closePuzzleMenu()" style="color: red;">
                Close
            </div>
        </modal>

        <modal name="winner" width="90%" height="auto" class="puzzle-menu">
            <h2 style="text-align: center">{{ getWinMsg() }}</h2>
            <div class="puzzle-menu-button" @click="closeWinnerDialog()">Close</div>
        </modal>

        <div v-if="loading" class="loading-overlay">
            <div class="loading-content">
                <i class="fa fa-fw fa-spinner fa-pulse fa-3x"></i>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Keyboard from './components/Keyboard';
    import ClueArea from './components/ClueArea';
    import Toolbar from './components/Toolbar';
    import Board from './components/Board';
    import SelectView from './components/SelectView';
    import storage from './storage';
    import axios from 'axios';

    const initialView = storage.last.puzzle ? 'board' : 'select';
    const savedInput = storage.last.puzzle ? storage.saves[storage.last.puzzle] : null;
    const completedPuzzles = storage.completed;
    const winMsg = ['Great job!', 'You rock!', 'You\'re the best!', 'Killing it!', 'Brains AND beauty!', 'Winner!', 'Awesome!'];

    export default {
        name: 'app',
        components: {
            SelectView: SelectView,
            Keyboard: Keyboard,
            ClueArea: ClueArea,
            Toolbar: Toolbar,
            Board: Board
        },
        data: function () {
            return {
                currentFile: '',
                view: initialView,
                data: {},
                inputData: savedInput,
                selectedCells: [],
                selectedDirection: 'across',
                clue: '',
                puzzles: [],
                completed: completedPuzzles,
                saves: storage.saves,
                lastPuzzle: storage.last,
                loading: false,
                checkAnswers: false
            };
        },
        mounted: function () {
            const self = this;
            self.loading = true;
            axios.get('/list').then(res => {
                self.puzzles = res.data.files;
                if (storage.last.puzzle) {
                    const last = storage.last.puzzle;
                    axios.post('/puzzle', { filename: storage.last.puzzle })
                        .then(res => {
                            self.selectPuzzle(res.data.puzzle, last);
                            self.loading = false;
                        })
                        .catch(() => self.loading = false);
                } else {
                    self.loading = false;
                }
            }).catch(() => self.loading = false);
        },
        computed: {
            completedPuzzles: function () {
                const self = this;
                return Object.keys(self.completed).filter(k => self.completed[k]);
            }
        },
        methods: {
            inProgress: function () {
                return Object.keys(this.saves);
            },
            selectCell: function (ix) {
                if (this.selectedCells[ix] === 2) {
                    this.selectedDirection = this.selectedDirection === 'down' ? 'across' : 'down';
                }
                const s = this.selectedCells.slice().map(() => 0);
                s[ix] = 2;
                let start = ix;
                if (this.selectedDirection === 'across') { // across
                    while (start >= 0 && this.data.squares[start].num > -1) {
                        if (s[start] !== 2) s[start] = 1;
                        if (start % this.data.width === 0 || this.data.squares[start - 1].num < 0) break;
                        start--;
                    }
                } else { // down
                    while (start >= 0 && this.data.squares[start].num > -1) {
                        if (s[start] !== 2) s[start] = 1;
                        if (start - this.data.width < 0 || this.data.squares[start - this.data.width].num < 0) break;
                        start = start - this.data.width;
                    }
                }
                const foundClue = this.data.clues[this.selectedDirection].find(i => i.num === this.data.squares[start].num);
                this.clue = (foundClue || {}).clue;
                start = ix;
                if (this.selectedDirection === 'across') { // across
                    while (this.data.squares[start].num > -1) {
                        if (s[start] !== 2) {
                            s[start] = 1;
                        }
                        start++;
                        if (start % this.data.width === 0) break;
                    }
                } else { // down
                    const total = this.data.width * this.data.height;
                    while (start < total && this.data.squares[start].num > -1) {
                        if (s[start] !== 2) s[start] = 1;
                        start = start + this.data.width;
                    }
                }
                this.selectedCells = s;
            },
            onCellClicked: function (row, col) {
                const ix = row * this.data.width + col;
                this.selectCell(ix);
            },
            onCellInput: function (input) {
                const ix = this.selectedCells.findIndex(i => i === 2);
                const data = this.inputData.slice();
                const total = this.data.width * this.data.height;
                const step = this.selectedDirection === 'across' ? 1 : this.data.width;
                const test = (selected) => input === '<' ? selected >= 0 : selected < total;
                data[ix] = input === '<' ? '' : input;
                let selected = ix + (input === '<' ? -1 : 1) * step;
                while (test(selected) && this.data.squares[selected].num < 0) {
                    selected = selected + (input === '<' ? -1 : 1) * step;
                }
                if (test(selected)) this.selectCell(selected);
                this.inputData = data;
                // check if puzzle is complete
                const isComplete = this.data.squares.every((s, i) => {
                    if (s.num < 0) return true;
                    return s.solution === this.inputData[i];
                }, this);
                if (isComplete) {
                    this.$modal.show('winner');
                    this.completed[this.currentFile] = true;
                } else if (this.completed[this.currentFile]) {
                    this.completed[this.currentFile] = false;
                }
                const self = this;
                self.$nextTick(() => storage.saves[self.currentFile] = data);
            },
            onPuzzleChosen: function (file) {
                const self = this;
                self.loading = true;
                axios.post('/puzzle', { filename: file })
                    .then(res => {
                        self.selectPuzzle(res.data.puzzle, file);
                        self.loading = false;
                    })
                    .catch(() => self.loading = false);
            },
            selectPuzzle: function (puzzle, filename) {
                const self = this;
                self.currentFile = filename;
                self.data = puzzle;
                self.view = 'board';
                storage.last.puzzle = filename;
                if (!self.saves[filename]) {
                    const d = self.data.squares.map(() => '');
                    self.saves[filename] = d;
                }
                self.inputData = self.saves[filename];
                self.selectedCells = self.data.squares.map(() => 0);
                self.$nextTick(() => self.selectCell(0));
            },
            clearBoard: function () {
                const d = this.data.squares.map(() => '');
                this.saves[this.currentFile] = d;
                this.inputData = this.saves[this.currentFile];
                this.completed[this.currentFile] = false;
            },
            changeViewToBoard: function () {
                this.view = 'board';
            },
            changeViewToSelect: function () {
                this.view = 'select';
            },
            changeViewToList: function () {
                this.view = 'list';
            },
            changeViewToInfo: function () {
                this.view = 'info';
            },
            openPuzzleMenu: function () {
                this.$modal.show('puzzle-menu');
            },
            closePuzzleMenu: function () {
                this.$modal.hide('puzzle-menu');
            },
            closeWinnerDialog: function () {
                this.$modal.hide('winner');
            },
            getWinMsg: function () {
                return winMsg[Math.floor(Math.random() * winMsg.length)];
            },
            toggleCheckAnswers: function () {
                this.checkAnswers = !this.checkAnswers;
            }
        }
    };
</script>

<style>
    @font-face {
        font-family: 'Quicksand Light';
        font-weight: 300;
        src: url('assets/fonts/Quicksand-Light.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Quicksand Regular';
        font-weight: 400;
        src: url('assets/fonts/Quicksand-Regular.ttf') format('truetype');
    }

    @font-face {
        font-family: 'Quicksand Medium';
        font-weight: 500;
        src: url('assets/fonts/Quicksand-Medium.ttf') format('truetype');
    }

    html, body {
        margin: 0;
        box-sizing: border-box;
        height: 100%;
    }

    #app {
        font-family: 'Quicksand Regular', Helvetica, Arial, sans-serif;
        font-size: 12px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        height: 100%;
    }

    .view {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .v-spacer {
        flex: 1;
    }

    .puzzle-menu {
        display: flex;
        flex-direction: column;
    }

    .puzzle-menu-button {
        width: 100%;
        padding: 15px 0;
        text-transform: uppercase;
        text-align: center;
        font-family: 'Quicksand Medium', 'Helvetica', sans-serif;
        color: dodgerblue;
    }

    .puzzle-menu-button:not(:first-child) {
        border-top: 1px solid rgba(0, 0, 0, 0.2);
    }

    .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 100;
    }

    .loading-content {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        background: transparent;
        z-index: 101;
    }

    .info-notes {
        flex: 1;
    }

</style>
