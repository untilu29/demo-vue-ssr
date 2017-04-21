<template>
    <div id="todo-list-example">
        <input v-model="newTodoText" @keyup.enter="addNewTodo" placeholder="Add new todo"/>
        <ul>
            <li is="todo-item"
                v-for="(todo,index) in todos"
                :key="todo"
                :title="todo"
                @remove="todos.splice(index,1)"/>
        </ul>
    </div>
</template>
<script>
    import TodoItem from './TodoItem.vue'
    export default {
        components:{
            TodoItem
        },
        data(){
            return {
                newTodoText: '',
                todos: [
                    'Do the dishes',
                    'Take out the trash',
                    'Mow the lawn'
                ]
            }
        },
        methods:{
            addNewTodo(){
                console.log(this.todos);
                this.todos.push(this.newTodoText);
                this.newTodoText='';
            }
        }
    }
</script>