<template>
    <div>
    <p>Test homepage</p>
        <button @click="handleClick">Nut bam</button>
        <p>Con so la: {{x|capitalize}}</p>
        <p>Chu cai la: {{char|capitalize}}</p>


        <div v-html="rawHtml"></div>

        <div v-if="seen">Now you see me</div>

        <a :href="url">Link</a>

        <div id="example">
            <p>Original message: "{{ char }}"</p>
            <p>Computed reversed message: "{{ reversedMessage }}"</p>
        </div>

        <div id="watch-example">
            <p>
                Ask a yes/no question:
                <input v-model="question">
            </p>
            <p>{{ answer }}</p>
        </div>

        <div class="static"
             v-bind:class="{ active: isActive, 'text-danger': hasError }">
        </div>
        <div v-bind:class="[activeClass, errorClass]"/>
        <div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }">Mau Chu nay no</div>
        <h2 v-if="isActive">Yes</h2>
        <h2 v-else="isActive">No</h2>

        <ul id="example">
            <li v-for="(item,idx) in items">
               {{idx+1}}. {{item}}
            </li>
        </ul>

        <div id="todo-list-example">
            <input
                    v-model="newTodoText"
                    v-on:keyup.enter="addNewTodo"
                    placeholder="Add a todo"
            >
            <ul>
                <li
                        is="todo-item"
                        v-for="(todo, index) in todos"
                        v-bind:key="todo"
                        v-bind:title="todo"
                        v-on:remove="todos.splice(index, 1)"
                ></li>
            </ul>
        </div>

        </div>
</template>

<script>
    export default {
        data() {
            return {
                x: 99,
                rawHtml:null,
                seen:false,
                url:null,
                char:'test chu cai',
                firstName: 'Chuc',
                lastName: 'Le',
                fullName: 'Le Manh Chuc',
                question: '',
                answer: 'I cannot give you an answer until you ask a question!',
                isActive:true,
                hasError:false,
                errorClass:{},
                activeColor: 'red',
                fontSize: 30,
                items: [
                    'Đồng Hới',
                    'Quảng Bình',
                    'Bắc Trung Bộ'
                ]
            }
        },

        beforeCreate() {
            console.log('Truoc khi khoi tao', this.x)
        },

        created() {
            console.log('The number log', this.x)
        },

        methods: {
            handleClick(){
                this.x+=2;
                this.rawHtml='<iframe width="560" height="315" src="https://www.youtube.com/embed/ZzRKtUK-hlw" frameborder="0" allowfullscreen></iframe>'
                this.seen=true;
                this.url='http://blog.mcit.cc';
                this.char+=this.x;
                this.isActive=!this.isActive;
                this.hasError=!this.hasError;
            }
        },

        filters: {
            capitalize: function (value) {
                if (!value) return ''
                value = value.toString()
                return value.charAt(0).toUpperCase() + value.slice(1)
            }
        },

        computed: {
            // a computed getter
            reversedMessage: function () {
                // `this` points to the vm instance
                return this.char.split('').reverse().join('')
            },
            now: function () {
                return Date.now()
            },
            fullName: function () {
                return this.firstName + ' ' + this.lastName
            }
        },

        watch: {
            firstName: function (val) {
                this.fullName = val + ' ' + this.lastName
            },
            lastName: function (val) {
                this.fullName = this.firstName + ' ' + val
            },

            question: function (newQuestion) {
                this.answer = 'Waiting for you to stop typing...'
            }
        },


    }

</script>