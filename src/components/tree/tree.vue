<template>
    <div class="halo-tree">
        <div class="input" v-if="options.showSearch">
            <input type="text" v-model="search">
            <span class="icon search"></span>
        </div>
        <div class="root">

             <i
                 class="icon iconfont"
                 :class="[itemsShow ? treeNodeOptions.iconClass.open : treeNodeOptions.iconClass.close ]"
                 :style="treeNodeOptions.iconStyle"
                 @click="rootIconClick"
             >

            </i>
            {{ treeNodeOptions.rootName }}
        </div>

        <tree-node
                :treeData='store.root'
                :options="treeNodeOptions"
                @handlecheckedChange="handlecheckedChange"
                v-show="itemsShow"
        >
        </tree-node>
    </div>
</template>
<script>
    import TreeNode from './tree-node.vue'
    import TreeStore from './tree-store'

    const DEFAULTICONCLASS = {
        open: 'icon-jian-fangkuang',
        close: 'icon-jia-fangkuang',
        add: 'icon-add'
    }
    const DEFAULTICONCOLOR = '#000'

    export default {
        name: 'tree',
        props: {
            treeData: [Array],
            options: [Object]
        },
        data () {
            return {
                itemsShow: true,

                treeNodeOptions: {},
                store: {
                    root: [],
                    last: null
                }
            }
        },
        created () {
            this.isTree = true

            this.checkOptions() // check options

            this.treeNodeOptions = Object.assign({}, {
                rootName: '根节点',

                labelKey: 'label',      // 默认的标题字段
                iconClass: DEFAULTICONCLASS,
                iconStyle: { color: DEFAULTICONCOLOR },

                lazy: false,            // 异步加载
                load: () => {},

                dynamicAdd: false,      // 动态添加
                dynamicAddFilter () { return true },
                dynamicAddNode () {},
                dynamicSaveNode () {},
                leafIcon () { return '' },          // not required

                warning: false,
                warningConfig: {
                    title: () => '',
                    iconClass: () => '',
                    style: () => ''
                }
                }, this.options)

            this.dealTreeData()

        },

        watch: {
            treeData: {
                handler: function (data, oldData) {
                    this.dealTreeData()
                },
                deep: true
            }
        },
        methods: {
            /**
             * generate key 0-1-2-3
             * this is very important function for now module
             * @param treeData
             * @param parentKey
             * @returns {Array}
             */
            generateKey (treeData = [], parentKey) {
                treeData = treeData.map((item, i) => {
                    item.key = parentKey + '-' + i.toString();

                    if (item.hasOwnProperty('children') && item.children.length > 0) {
                        this.generateKey(item.children, item.key)
                    }

                    return item;
                })
                return treeData;
            },
            rootIconClick () {
                this.itemsShow = !this.itemsShow
            },
            handlecheckedChange (node) {
                if (!this.options.showCheckbox) {
                    return
                }
                if (this.options.halfCheckedStatus) {
                    this.store.changeCheckHalfStatus(node)
                } else {
                    this.store.changeCheckStatus(node)
                }
                this.$emit('handlecheckedChange', node)
            },
            getSelectedNodes () {
                const allnodes = this.store.datas
                let selectedNodes = []
                for (let [, node] of allnodes) {
                    if (node.checked) {
                        selectedNodes.push(node)
                    }
                }
                return selectedNodes
            },
            getSelectedNodeIds () {
                const allnodes = this.store.datas
                let selectedNodeIds = []
                for (let [, node] of allnodes) {
                    if (node.checked) {
                        selectedNodeIds.push(node.id)
                    }
                }
                return selectedNodeIds
            },
            /**
             * 初始化时检查 参数
             */
            checkOptions () {
                if ('lazy' in this.options ) {
                    if (typeof this.options.load !== 'function') {
                        console.error('load must be Function')
                    }
                }

                if ('dynamicAdd' in this.options ) {
                    if ('dynamicAddFilter' in this.options) {
                        if (typeof this.options.dynamicAddFilter !== 'function') {
                            console.error('dynamicFilter must be Function')
                        }
                    }

                    if ('dynamicAddNode' in this.options) {
                        if (typeof this.options.dynamicAddNode !== 'function') {
                            console.error('dynamicAddNode must be Function')
                        }
                    } else {
                        console.warning('seem\'s u config dynamicAdd, but dynamicAddNode Function missing')
                    }

                    if ('dynamicSaveNode' in this.options) {
                        if (typeof this.options.dynamicSaveNode !== 'function') {
                            console.error('dynamicSaveNode must be Function')
                        }
                    } else {
                        console.warning('seem\'s u config dynamicAdd, but dynamicSaveNode Function missing')
                    }
                }
                if ('leafIcon' in this.options) {
                    if (typeof this.options.leafIcon !== 'function') {
                        console.error('leafIcon must be Function')
                    }
                }

                if ('warning' in this.options && this.options.warning ) {
                    if ('warningConfig' in this.options) {
                        if ('title' in this.options.warningConfig) {
                            if (typeof this.options.warningConfig.title !== 'function') {
                                console.error('Warning: warningConfig property title must be Function')
                            }
                        }
                        if ('iconClass' in this.options.warningConfig) {
                            if (typeof this.options.warningConfig.iconClass !== 'function') {
                                console.error('Warning: warningConfig property iconClass must be Function')
                            }
                        }
                        if ('style' in this.options.warningConfig) {
                            if (typeof this.options.warningConfig.style !== 'function') {
                                console.error('Warning: warningConfig property style must be Function')
                            }
                        }
                    }
                }
            },
            /**
             * del tree data
             * when created, update, dynamic add node
             */
            dealTreeData () {
                this.store = new TreeStore({
                    root: (this.generateKey(this.treeData, '0') || []).slice(0),
                    options: Object.assign({}, this.treeNodeOptions),
                    last: this.store.last
                })
            }

        },
        components: {TreeNode}
    }

</script>
<style lang="scss" >
    @import './assets/iconfont/iconfont.css';

    .halo-tree * {
        font-size: 13px;
        font-family: Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', '微软雅黑', Arial, sans-serif;
    }
    .halo-tree .root {
        position: relative;
        left: -19px;
        cursor: default;
        user-select: none;
        font-size: 14px;
        i {
            font-size: 14px;
            cursor: pointer;
        }
    }
    .halo-tree .input {
        width: 100%;
        position: relative;
    }

    .halo-tree .input span {
        position: absolute;
        top: 7px;
        right: 5px;
    }

    .halo-tree .input input {
        display: inline-block;
        box-sizing: border-box;
        width: 100%;
        border-radius: 5px;
        height: 25px;
        margin-top: 2px;
    }

    .halo-tree .input input:focus {
        border: none;
    }

    .halo-tree .icon {
    }

    .halo-tree .search {
        width: 14px;
        height: 14px;
        background-image: url("assets/search.png");
    }
</style>

