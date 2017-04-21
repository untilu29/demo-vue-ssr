<template>
    <li>
        <div class="form">
            <h3 class="title">What's your name?</h3>
            <input class="usernameInput" v-model="usernameInput" @keydown.enter="handleEnterUsername" type="text" maxlength="14"/>
        </div>
    </li>
</template>

<script>
    export default
    {
//        name: 'login-page',
        props: ['socket'],
        data(){
            return {
                usernameInput:''
            }
        },
        methods:{
            handleEnterUsername(){
                let username= this.usernameInput.trim()
                if (username) {
                    console.log(this.socket)
                    this.socket.emit('add_user', username);
                    this.$emit('loginSuccess',username);
                }
            }
        }
    }
</script>