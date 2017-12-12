<template>
    <div class="cw-row">
        <cell
            v-for="(cell, i) in rowData"
            key="i"
            :cell-data="rowData[i]"
            :cell-index="i"
            :on-cell-clicked="clickHandlers[i]"
            :selected="selectedCells[i]"
            :value="inputData[i]" />
    </div>
</template>

<script type="text/ecmascript-6">
    import Cell from './Cell';

    export default {
        components: {
            Cell: Cell
        },
        props: {
            rowData: Array,
            rowIndex: Number,
            onCellClicked: Function,
            selectedCells: Array,
            inputData: Array
        },
        computed: {
            clickHandlers: function () {
                const self = this;
                return self.rowData.map(function (h, i) {
                    return self.onCellClicked.bind(self, self.rowIndex, i);
                });
            }
        }
    };
</script>

<style scoped>
    .cw-row {
        display: flex;
        flex-direction: row;
    }
</style>
