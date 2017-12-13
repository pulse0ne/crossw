<template>
    <div id="app">
        <div v-if="view === 'board'" class="view">
            <Board
                :board-data="data"
                :on-cell-clicked="onCellClicked"
                :selected-cells="selectedCells"
                :input-data="inputData" />
            <ClueArea :clue="clue" :test="test" :openSelectView="changeViewToSelect" />
            <div class="v-spacer"></div>
            <Keyboard :key-pressed="onCellInput" />
        </div>
        <div v-if="view === 'select'" class="view">
            <SelectView :puzzle-files="puzzles" :on-puzzle-chosen="onPuzzleChosen" />
        </div>

        <modal name="test" width="90%" height="auto">Something</modal>
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
                view: initialView,
                data: {},
                inputData: savedInput,
                selectedCells: [],
                selectedDirection: 'across',
                clue: '',
                puzzles: []
            };
        },
        mounted: function () {
            const self = this;

            axios.get('/list').then(res => self.puzzles = res.data.files);
            if (storage.last.puzzle) {
                const last = storage.last.puzzle;
                axios.post('/puzzle', { filename: storage.last.puzzle }).then(res => self.selectPuzzle(res.data.puzzle, last));
            }
        },
        methods: {
            test: function () {
                this.$modal.show('test');
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
                        if (s[start] !== 2) {
                            s[start] = 1;
                        }
                        if (start % this.data.width === 0 || this.data.squares[start - 1].num < 0) {
                            break;
                        }
                        start--;
                    }
                } else { // down
                    while (start >= 0 && this.data.squares[start].num > -1) {
                        if (s[start] !== 2) {
                            s[start] = 1;
                        }
                        if (start - this.data.width < 0 || this.data.squares[start - this.data.width].num < 0) {
                            break;
                        }
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
                        if (start % this.data.width === 0) {
                            break;
                        }
                    }
                } else { // down
                    const total = this.data.width * this.data.height;
                    while (start < total && this.data.squares[start].num > -1) {
                        if (s[start] !== 2) {
                            s[start] = 1;
                        }
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
                if (test(selected)) {
                    this.selectCell(selected);
                }
                this.inputData = data;
            },
            onPuzzleChosen: function (file) {
                const self = this;
                axios.post('/puzzle', { filename: file }).then(res => self.selectPuzzle(res.data.puzzle, file));
            },
            selectPuzzle: function (puzzle, filename) {
                const self = this;
                self.data = puzzle;
                self.view = 'board';
                storage.last.puzzle = filename;
                // TODO: load saved input data
                self.inputData = self.data.squares.map(() => '');
                self.selectedCells = self.data.squares.map(() => 0);
                self.$nextTick(() => self.selectCell(0));
            },
            changeViewToSelect: function () {
                this.view = 'select';
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

    html, body {
        margin: 0;
        box-sizing: border-box;
        height: 100%;
    }

    .v-spacer {
        flex: 1;
    }
</style>
