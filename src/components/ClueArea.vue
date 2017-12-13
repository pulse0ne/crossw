<template>
    <div ref="clueArea" class="clue-area">
        <div class="clue-text" v-if="!menuOpen">{{ clue }}</div>
        <div class="clue-menu" v-if="menuOpen">
            <div class="menu-entry" @click="openSelectView()">
                <i class="fa fa-folder-open"></i>
            </div>
            <div class="menu-entry">
                <i class="fa fa-list"></i>
            </div>
            <div class="menu-entry">
                <i class="fa fa-life-ring"></i>
            </div>
            <div class="menu-entry">
                <i class="fa fa-info"></i>
            </div>
        </div>
        <div class="menu-button" @click="menuOpen = !menuOpen">
            <i class="fa" v-bind:class="{'fa-bars': !menuOpen, 'fa-close': menuOpen}"></i>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data: function () {
            return {
                menuOpen: false
            };
        },
        props: {
            test: Function,
            openSelectView: Function,
            clue: String
        }
    };
</script>

<style scoped>
    .clue-area {
        background: #bde9f7;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 12px;
    }

    .clue-text {
        flex: 1;
        justify-content: center;
        word-wrap: break-word;
    }

    .clue-menu {
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }

    .menu-entry {
        margin-right: 48px;
        font-size: 16px;
    }

    .menu-button {
        border-left: 1px solid #89b1bf;
        color: black;
        padding-left: 12px;
        font-size: 16px;
    }
</style>
