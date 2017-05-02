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

        <todo/>

        <!--Lam viec voi form-->
        <input v-model="textModel" placeholder="Edit nao"/>
        <p>Chu them vao: {{textModel}}</p>

        <input type="checkbox" id="check-box" v-model="checkBox"/>
        <label for="check-box"> {{checkBox}} </label>

        <hr/>
        <input type="checkbox" id="jack" value="Chuc" v-model="checkedNames">
        <label for="jack">Chuc</label>
        <input type="checkbox" id="john" value="Hien" v-model="checkedNames">
        <label for="john">Hien</label>
        <input type="checkbox" id="mike" value="Phuc" v-model="checkedNames">
        <label for="mike">Phuc</label>
        <br>
        <span>Checked names: {{ checkedNames }}</span>
        <hr/>
        <select v-model="selected">
            <option disabled value="">Please select one</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
        </select>
        <span>Selected: {{ selected }}</span>

        </div>
</template>

<script>
    import Todo from './Todo.vue'

    export default {
        components:{
            Todo
        },
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
                activeClass:{},
                errorClass:{},
                activeColor: 'red',
                fontSize: 30,
                items: [
                    'Đồng Hới',
                    'Quảng Bình',
                    'Bắc Trung Bộ'
                ],
                textModel:'',
                checkBox:false,
                checkedNames:[],
                selected:''
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
                emailExists({ sender: 'darthvader@gmail.com',
                      recipient: 'lukeskywalker@gmail.com' })
            .then(console.log)
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