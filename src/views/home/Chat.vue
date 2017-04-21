<template>
    <div>
        <ul class="pages">
            <li :is="currentView" :socket="socket" :username="username" @loginSuccess="handleLoginSuccess" />
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
                token: 'eyJhbGciOiJIUzUxMiJ9.eyJhY2NvdW50SWQiOiJoaWVuQGdtYWlsLmNvbSIsImNsaWVudFR5cGUiOiJ1c2VyIiwidG9rZW5fZXhwaXJhdGlvbl9kYXRlIjoxNDkyNjczMzkxODczLCJ1c2VySUQiOiI1OGY3OGE0OGM5ZTc3YzAwMDE1ODMwMjUiLCJ0b2tlbl9jcmVhdGVfZGF0ZSI6eyJ5ZWFyIjoyMDE3LCJtb250aCI6IkFQUklMIiwibW9udGhWYWx1ZSI6NCwiZGF5T2ZNb250aCI6MjAsImhvdXIiOjYsIm1pbnV0ZSI6NTksInNlY29uZCI6NTEsIm5hbm8iOjg3MzAwMDAwMCwiZGF5T2ZXZWVrIjoiVEhVUlNEQVkiLCJkYXlPZlllYXIiOjExMCwiY2hyb25vbG9neSI6eyJjYWxlbmRhclR5cGUiOiJpc284NjAxIiwiaWQiOiJJU08ifX19.qC7FF6vt_gn27GzjvJBsJD_qqMz5ag6oKVVwjhOizOtCcCtLmu6hJvvgYcygPSIF6pfwXvYRPpl9_UTOtaysBg',
                username:'',
                socket: null,
                currentView: LoginPage
            }
        },

        methods: {
            handleLoginSuccess(value){
                this.currentView=ChatBox;
                this.username=value;
                console.log(this.username)
            }
        },

        beforeMount() {
            this.socket=io.connect('http://localhost:3000?token=' + this.token);
        }
    }
</script>