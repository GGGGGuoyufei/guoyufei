import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        MenuList:[],
        SelectedRole:null,
        selectionHostList:[],
        HostShow:false,
    },
    mutations: {
        MenuTree(state,val){
            state.MenuList = val; 
        },
        CheckedHost(state,val){
            state.selectionHostList = val;
        },
        HostShowOpen(state){
            state.HostShow = true;
        },
        HostShowClose(state){
            state.HostShow = false;
        },
    },
    actions: {},
    modules: {}
})