<template>
    <div class="keyboard">
        <div class="keyboard-row">
            <div v-for="k in topRow" :key="k" class="keyboard-button" @click="press(k)">
                {{ k }}
            </div>
        </div>
        <div class="keyboard-row">
            <div v-for="k in midRow" :key="k" class="keyboard-button" @click="press(k)">
                {{ k }}
            </div>
        </div>
        <div class="keyboard-row">
            <div class="special"></div>
            <div v-for="k in bottomRow" :key="k" class="keyboard-button" @click="press(k)">
                {{ k }}
            </div>
            <div class="keyboard-button special" @click="press('<')">&#x232b</div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data: function () {
            return {
                topRow: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                midRow: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
                bottomRow: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
            };
        },
        props: {
            keyPressed: Function
        },
        methods: {
            press: function (key) {
                this.keyPressed(key);
            }
        }
    };
</script>

<style scoped>
    .keyboard {
        background: #dddddd;
        padding: 5px;
    }

    .keyboard-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        padding: 2px 0;
    }

    .keyboard-button {
        background-color: white;
        border-radius: 0.5em;
        padding: 5px 10px;
        margin: 0 5px;
        box-shadow: 0 1px 1px black;
    }

    .keyboard-button.special {
        background-color: #acacac;
    }
</style>
