<template>
    <li>
        <div class="chatArea">
            <ul class="messages"></ul>
        </div>
        <input class="inputMessage" placeholder="Type here..." @input="updateTyping" v-model="inputMessage"/>
    </li>
</template>
<script>
    export default {
        props: ['socket','token'],

        data(){
            return{
                name: '',
                username:'',
                FADE_TIME: 150, // ms
                TYPING_TIMER_LENGTH: 400, // ms
                COLORS: [
                '#e21400', '#91580f', '#f8a700', '#f78b00',
                '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
                '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
            ],
                connected: false,
                typing: false,
                inputMessage:'',
                lastTypingTime:null
            }
        },

        methods:{
            setUsername() {
                // If the this.username is valid
                if (this.token) {
                    this.socket.emit('add_user', this.token);
                }
            },

             // Sends a chat message
            sendMessage() {
                let self=this;
                let message = this.cleanInput(this.inputMessage);
                // if there is a non-empty message and a socket connection
                if (message && this.connected) {
                    this.inputMessage='';
                    console.log('Vo day send Message Chat');

                    // this.addChatMessage({
                    //     name: self.name,
                    //     message: message
                    // });
                    // tell server to execute 'new message' and send along one parameter
                    this.socket.emit('new_message', message);
                }
            },

            addParticipantsMessage(data) {
                this.name=data.name;
                let message = '';
                if (data.numUsers === 1) {
                    message += "there's 1 participant";
                } else {
                    message += "there are " + data.numUsers + " participants";
                }
                this.log(message);
            },

            log(message, options) {
                let $el = $('<li>').addClass('log').text(message);
                this.addMessageElement($el, options);
            },

            addChatMessage(data, options) {
                console.log("Data la:",data);
                // Don't fade the message in if there is an 'X was typing'
                let $typingMessages = this.getTypingMessages(data);
                options = options || {};
                if ($typingMessages.length !== 0) {
                    options.fade = false;
                    $typingMessages.remove();
                }

                let $avatarDiv = $("<img class='avatar'/>").attr("src",data.avatar);

                let $usernameDiv = $('<span class="username"/>')
                    .text(data.name)
                    .css('color', this.getusernameColor(data.name));
                let $messageBodyDiv = $('<span class="messageBody">')
                    .text(data.message);

                let typingClass = data.typing ? 'typing' : '';
                let $messageDiv = $('<li class="message"/>')
                    .data('username', data.username)
                    .addClass(typingClass)
                    .append($avatarDiv,$usernameDiv, $messageBodyDiv);

                    // console.log($messageDiv);

                this.addMessageElement($messageDiv, options);
            },

            // Adds the visual chat typing message
            addChatTyping(data) {
                data.typing = true;
                data.message = 'is typing';
                console.log('Vo day typing chat');
                this.addChatMessage(data);
            },

            // Removes the visual chat typing message
            removeChatTyping(data) {
                this.getTypingMessages(data).fadeOut(function () {
                    $(this).remove();
                });
            },


            addMessageElement(el, options) {
                let $el = $(el);

                // Setup default options
                if (!options) {
                    options = {};
                }
                if (typeof options.fade === 'undefined') {
                    options.fade = true;
                }
                if (typeof options.prepend === 'undefined') {
                    options.prepend = false;
                }

                // Apply options
                if (options.fade) {
                    $el.hide().fadeIn(this.FADE_TIME);
                }
                if (options.prepend) {
                    $('.messages').prepend($el);
                } else {
                    $('.messages').append($el);
                }
                $('.messages')[0].scrollTop = $('.messages')[0].scrollHeight;
            },

            // Prevents input from having injected markup
            cleanInput(input) {
                return $('<div/>').text(input).text();
            },

            // Updates the typing event
            updateTyping() {
                if (this.connected) {
                    if (!this.typing) {
                        this.typing = true;
                        this.socket.emit('typing');
                    }
                    this.lastTypingTime = (new Date()).getTime();
                    let self=this;
                    setTimeout(function () {
                        let typingTimer = (new Date()).getTime();
                        let timeDiff = typingTimer - self.lastTypingTime;
                        if (timeDiff >= self.TYPING_TIMER_LENGTH && self.typing) {
                            self.socket.emit('stop_typing');
                            self.typing = false;
                        }
                    }, self.TYPING_TIMER_LENGTH);
                }
            },

            // Gets the 'X is typing' messages of a user
            getTypingMessages(data) {
                return $('.typing.message').filter(function (i) {
                    return $(this).data('username') === data.username;
                });
            },

            // Gets the color of a this.username through our hash function
            getusernameColor(username) {
                // Compute hash code
                let hash = 7;
                for (let i = 0; i < username.length; i++) {
                    hash = username.charCodeAt(i) + (hash << 5) - hash;
                }
                // Calculate color
                let index = Math.abs(hash % this.COLORS.length);
                return this.COLORS[index];
            }
        },

        mounted(){
            let socket = this.socket;
            let self = this;

            $(window).keydown(function (event) {
                // Auto-focus the current input when a key is typed
                if (!(event.ctrlKey || event.metaKey || event.altKey)) {
                    $('.inputMessage').focus();
                }
                // When the client hits ENTER on their keyboard

                if (event.which === 13) {
                    if (self.token) {
                        self.sendMessage();
                        socket.emit('stop_typing');
                        self.typing = false;
                    } else {
                        self.setUsername();
                    }
                }
            });

            socket.on('login', function (data) {
                console.log('===========On login');
                self.connected = true;
                // Display the welcome message
                let message = "Welcome to Chat";
                self.log(message, {
                    prepend: true
                });

                self.addParticipantsMessage(data);
            });

            // Whenever the server emits 'new message', update the chat body
            socket.on('new_message', function (data) {
                console.log('===========On new message');
                self.addChatMessage(data);
            });

            // Whenever the server emits 'user joined', log it in the chat body
            socket.on('user_joined', function (data) {
                console.log('===========On user joined');
                self.log(data.name + ' joined');
                self.username=data.name;
                self.addParticipantsMessage(data);
            });

            // Whenever the server emits 'user left', log it in the chat body
            socket.on('user_left', function (data) {
                console.log('===========On user left'); 
                self.log(data.name + ' left');
                self.addParticipantsMessage(data);
                self.removeChatTyping(data);
            });

            // Whenever the server emits 'typing', show the typing message
            socket.on('typing', function (data) {
                console.log('===========On typing');
                console.log('Data: ',data);
                self.addChatTyping(data);
            });

            // Whenever the server emits 'stop typing', kill the typing message
            socket.on('stop_typing', function (data) {
                console.log('===========Stop typing');
                self.removeChatTyping(data);
            });

            socket.on('disconnect', function () {
                console.log('===========On disconnected');
                self.log('you have been disconnected');
            });

            socket.on('reconnect', function () {
                console.log('===========On reconnect');
                self.log('you have been rethis.connected');
                if (this.username) {
                    socket.emit('add_user', this.username);
                }
            });

            socket.on('reconnect_error', function () {
                console.log('===========On reconnect');
                self.log('attempt to reconnect has failed');
            });
        }
    }
</script>