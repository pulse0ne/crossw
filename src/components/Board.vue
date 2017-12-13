<template>
    <div class="cw-board">
        <row
            v-for="(row, i) in splitRows"
            :key="i"
            :row-data="row"
            :row-index="i"
            :on-cell-clicked="cellClicked"
            :selected-cells="splitSelectedCells()[i]"
            :input-data="splitInputDataRows()[i]" />
    </div>
</template>

<script type="text/ecmascript-6">
    import Row from './Row';
    import { range } from '../utils';

    const rowSplitter = (arr, width, height) => {
        return range(height).map(r => {
            const c = r * width;
            return arr.slice(c, c + width);
        });
    };

    export default {
        components: {
            Row: Row
        },
        props: {
            boardData: Object,
            onCellClicked: Function,
            selectedCells: Array,
            inputData: Array
        },
        computed: {
            splitRows: function () {
                return rowSplitter(this.boardData.squares, this.boardData.width, this.boardData.height);
            }
        },
        methods: {
            cellClicked: function (row, col) {
                return this.onCellClicked(row, col);
            },
            splitSelectedCells: function () {
                return rowSplitter(this.selectedCells, this.boardData.width, this.boardData.height);
            },
            splitInputDataRows: function () {
                return rowSplitter(this.inputData, this.boardData.width, this.boardData.height);
            }
        }
    };
</script>

<style scoped>
    .cw-board {
        border: 1px solid black;
        border-right-width: 2px;
        border-bottom-width: 2px;
        max-width: 800px;
    }
</style>
