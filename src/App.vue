<template>
    <div id="app">
        <Board
            :board-data="data"
            :on-cell-clicked="onCellClicked"
            :selected-cells="selectedCells"
            :input-data="inputData" />
        <ClueArea></ClueArea>
        <div class="v-spacer"></div>
        <Keyboard :key-pressed="onCellInput" />
    </div>
</template>

<script type="text/ecmascript-6">
    import Keyboard from './components/Keyboard';
    import ClueArea from './components/ClueArea';
    import Toolbar from './components/Toolbar';
    import Board from './components/Board';
    import testData from './TEST-DATA.js';

    export default {
        name: 'app',
        components: {
            Keyboard: Keyboard,
            ClueArea: ClueArea,
            Toolbar: Toolbar,
            Board: Board
        },
        data: function () {
            return {
                data: testData,
                inputData: testData.squares.map(() => ''),
                selectedCells: testData.squares.map(() => 0),
                selectedDirection: 0
            };
        },
        mounted: function () {
            const self = this;
            self.$nextTick(() => self.selectCell(0));
        },
        methods: {
            selectCell: function (ix) {
                // TODO: clean this monstrosity up
                if (this.selectedCells[ix] === 2) {
                    this.selectedDirection = this.selectedDirection === 1 ? 0 : 1;
                }
                const s = this.selectedCells.slice().map(() => 0);
                s[ix] = 2;
                let start = ix;
                if (this.selectedDirection === 0) { // across
                    while (start >= 0 && this.data.squares[start].num > -1) {
                        if (s[start] !== 2) {
                            s[start] = 1;
                        }
                        if (start % this.data.width === 0) {
                            break;
                        }
                        start--;
                    }
                } else { // down
                    while (start >= 0 && this.data.squares[start].num > -1) {
                        if (s[start] !== 2) {
                            s[start] = 1;
                        }
                        start = start - this.data.width;
                    }
                }
                start = ix;
                if (this.selectedDirection === 0) { // across
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
                const step = this.selectedDirection === 0 ? 1 : this.data.width;
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
        display: flex;
        flex-direction: column;
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
