<template>
    <div>
        <ul class="pages">
            <li :is="currentView" :socket="socket" :token="token" @loginSuccess="handleLoginSuccess" />
        </ul>

    </div>
</template>

<script>
    import LoginPage from './Login.vue'
    import ChatBox from './ChatBox.vue'
    export default
    {
        components: {
            LoginPage,
            ChatBox
        },

        data(){
            return{
                token:null,
                socket: null,
                currentView: LoginPage
            }
        },

        methods: {
            handleLoginSuccess(value){
            	this.socket=io.connect('http://localhost:3000?token=' + value);
                this.socket.emit('add_user', value);
                this.token=value;
                this.currentView=ChatBox;
            }
        },

        beforeMount() {
        }
    }
</script>

<style type="text/css">
    /* Rounded avatars */
.avatar {
    /*float: left;*/
    max-width: 50px;
    margin-top: 0.5em;
    margin-right: 0.5em;
    position: relative;

    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;

    -webkit-box-shadow: 0 0 0 3px #fff, 0 0 0 4px #999, 0 2px 5px 4px rgba(0,0,0,.2);
    -moz-box-shadow: 0 0 0 3px #fff, 0 0 0 4px #999, 0 2px 5px 4px rgba(0,0,0,.2);
    box-shadow: 0 0 0 3px #fff, 0 0 0 4px #999, 0 2px 5px 4px rgba(0,0,0,.2);
}
</style>