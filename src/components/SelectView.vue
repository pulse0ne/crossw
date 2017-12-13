<template>
    <div class="select-view">
        <label class="year-label">
            <select v-model="yearSelection" title="Select Year" class="fancy-dropdown">
                <option v-for="y in yearOptions" v-bind:value="y">{{y}}</option>
            </select>
            <i class="fa fa-angle-down"></i>
        </label>
        <div class="scroll-wrapper">
            <div v-for="m in yearData.months">
                <h4>{{ m.month }}</h4>
                <div class="day-container">
                    <div v-for="d in m.days" class="day-wrapper" @click="selectPuzzle(d.file)">
                        <span class="day" v-bind:class="{ 'complete': d.complete, 'in-progress': d.inProgress }">
                            {{ d.day }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    const re = /^(\d{4})-(\d{2})-(\d{2}).+$/;
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    export default {
        data: function () {
            return {
                yearSelection: '2017',
                completed: ['2017-03-29.json'],
                inProgress: ['2017-08-03.json']
            };
        },
        props: {
            onPuzzleChosen: Function,
            puzzleFiles: Array/*,
            completed: Array*/
        },
        computed: {
            puzzles: function () {
                const self = this;
                const p = this.puzzleFiles.reduce((a, i) => {
                    const [y, m, d] = re.exec(i).slice(1);
                    const monthIx = parseInt(m, 10) - 1;
                    let year = a[y];
                    if (!year) {
                        year = { months: [] };
                        a[y] = year;
                    }
                    let month = year.months.find(j => j.month === months[monthIx]);
                    if (!month) {
                        month = { month: months[monthIx], days: [] };
                        year.months.push(month);
                    }
                    const c = self.completed.includes(i);
                    month.days.push({
                        day: d,
                        file: i,
                        complete: c,
                        inProgress: !c && self.inProgress.includes(i)
                    });
                    return a;
                }, {});
                Object.keys(p).forEach(k => {
                    p[k].months.sort((a, b) => months.indexOf(b.month) - months.indexOf(a.month));
                });
                return p;
            },
            yearOptions: function () {
                const y = Object.keys(this.puzzles);
                y.sort((a, b) => b - a);
                return y;
            },
            yearData: function () {
                return this.puzzles[this.yearSelection] || [];
            }
        },
        methods: {
            selectPuzzle: function (file) {
                this.onPuzzleChosen(file);
            }
        }
    };
</script>

<style scoped>
    .select-view {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
        padding: 10px;
        text-align: left;
        height: 100%;
        overflow: hidden;
    }

    .year-label {
        width: 100%;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        padding-bottom: 10px;
        font-size: 24px;
    }

    .fancy-dropdown {
        appearance: none;
        background: none;
        font-family: inherit;
        font-size: 24px;
        border: none;
    }

    .scroll-wrapper {
        flex: 1;
        overflow-y: scroll;
    }

    .day-container {
        display: flex;
        flex-direction: row;
        flex-flow: wrap;
    }

    .day-wrapper {
        margin-bottom: 12px;
        width: 32px;
    }

    .day {
        border-radius: 50%;
    }

    .complete {
        background-color: #8ce98f;
    }

    .in-progress {
        background-color: #e7e99e;
    }

</style>
