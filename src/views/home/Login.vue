<template>
    <li>
       <!--  <div class="form">
            <h3 class="title">What's your name?</h3>
            <input class="usernameInput" v-model="usernameInput" @keydown.enter="handleEnterUsername" type="text" maxlength="14"/>
        </div> -->

          <g-signin-button
    :params="googleSignInParams"
    @success="onSignInSuccess"
    @error="onSignInError">
    Sign in with Google
  </g-signin-button>
    </li>


</template>

<script>
import Vue from 'vue'
import GSignInButton from 'vue-google-signin-button'
Vue.use(GSignInButton)
    export default
    {
//        name: 'login-page',
        props: ['socket'],
        data(){
            return {
                usernameInput:'',
                 googleSignInParams: {
                    client_id: '224315945436-ot3j6qq3l3r4k81jbsacfsf6godecof3.apps.googleusercontent.com'
                 }
            }
        },
        methods:{
            handleEnterUsername(username){
                // let username= this.usernameInput.trim()
                if (username) {
                  
                    this.$emit('loginSuccess',username);
                }
            },
             onSignInSuccess (googleUser) {
      // `googleUser` is the GoogleUser object that represents the just-signed-in user. 
      // See https://developers.google.com/identity/sign-in/web/reference#users 
            // const profile = googleUser.getBasicProfile() // etc etc 
            // console.log(googleUser.getAuthResponse());
            // console.log(profile);
            let self=this;
            $.ajax({
                  type: "POST",
                  url: 'https://api.ezzily.com/api/auth/google',
                  data: JSON.stringify({"accessToken":googleUser.getAuthResponse().id_token}),
                  success: function (data) {
                      // body...
                      console.log(data);
                      self.handleEnterUsername(data.token)
                  },
                 contentType: 'application/json',
                });

             },
            onSignInError (error) {
              // `error` contains any error occurred. 
              console.log('OH NOES', error)
            }
        }
    }
</script>

<style>
.g-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #3c82f7;
  color: #fff;
  box-shadow: 0 3px 0 #0f69ff;
}
</style> 