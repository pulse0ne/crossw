<template>
    <div class="cw-cell" v-bind:class="{ filled: cellData.num < 0, selected: selected == 2, 'in-row': selected == 1 }" @click="cellClicked">
        <span>{{ value }}</span>
        <span class="cw-cell-number" v-if="cellData.num > 0">{{ cellData.num }}</span>
    </div>
</template>

<script type="text/ecmascript-6">
    import { debounce } from '../utils';

    export default {
        mounted: function () {
            const resizeCell = () => {
                this.$el.style.height = `${this.$el.offsetWidth}px`;
                this.$el.style.fontSize = `${this.$el.offsetWidth * 0.65}px`;
            };
            this.resizeListener = debounce(resizeCell, 200);
            this.$nextTick(() => {
                resizeCell();
                window.addEventListener('resize', this.resizeListener, { passive: true });
            });
        },
        beforeDestroy: function () {
            window.removeEventListener('resize', this.resizeListener, { passive: true });
        },
        props: {
            cellData: Object,
            cellIndex: Number,
            onCellClicked: Function,
            selected: Number,
            value: String
        },
        methods: {
            cellClicked: function () {
                if (this.cellData.num >= 0) {
                    this.onCellClicked();
                }
            }
        }
    };
</script>

<style scoped>
    .cw-cell {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        border-top: 1px solid black;
        border-left: 1px solid black;
        width: 100%;
        height: 100%;
        user-select: none;
    }

    .cw-cell.filled {
        background: black;
    }

    .cw-cell.selected {
        background: gold;
    }

    .cw-cell.in-row {
        background: #bde9f7;
    }

    .cw-cell-number {
        position: absolute;
        top: 1px;
        left: 1px;
        font-size: 0.5em;
    }
</style>
