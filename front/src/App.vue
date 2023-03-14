<script setup>
//theme
import "primevue/resources/themes/lara-light-indigo/theme.css";
//core
import "primevue/resources/primevue.min.css";
//icons
import "primeicons/primeicons.css";

import InputText from 'primevue/inputtext';
import TreeTable from 'primevue/treetable';
import Row from 'primevue/row';
import Button from 'primevue/button';
</script>

<template>

<div v-if="!current_username.length" class="input-username-container">
    <div>
        <h1 class="login-text text-align-center">log in</h1>
        <div class="flex">
            <span class="p-float-label">
            <InputText id="username" v-model="typed" />
            <label v-if="!typed.length" for="username">Username</label>
            </span>
            <Button @click="current_username=typed; get_user_by_username_and_verify_if_admin(current_username);" class="m-left-6" label="Submit" />
        </div>

    </div>

</div>
<div v-else-if="current_username.length" class="container">
    <h1>hello {{ current_username }}</h1>
    <div v-if="admin">
        <h2>you are admin</h2>
        
        <InputText type="text" v-model="interact.name" />
        <InputText type="text" v-model="interact.imageUrl" />
        <InputText type="text" v-model="interact.author" />
        <InputText type="text" v-model="interact.url" />
        
    
    </div>

    <div v-for="(item, index) in items" :key="index">
    item
    </div>

</div>


</template>

<script>
export default {
    data() {
        return {
            interact: {
                name:"",
                imageUrl:"",
                author:"",
                url:"",
            },
            typed:"",
            current_username:"",
            admin:false,
            works_list: [],
        }
    },
    methods: {
        // GET (single) User by Username
        async get_user_by_username_and_verify_if_admin(username) {
            const usernameResponse = await fetch("http://localhost:4000/users/getuserbyusername/"+username);
            const received_user_data = await usernameResponse.json();
            console.log(received_user_data)
            let user = received_user_data[0]
            if(user && user.isAdmin) {
                this.admin = true;
            }
            else {
                this.admin = false;
            }

            this.fetch_all_works();
            
        },

        async fetch_all_works() {
            const response = await fetch("http://localhost:4000/works/");
            const received_data = await response.json();
            this.works_list = received_data;
            console.log(received_data)
        },
        async delete_work(workID) {
            let fetch_url = 'http://localhost:4000/works/delete/' + workID;
            const response = await fetch(fetch_url, { method: "DELETE" });
            const received_data = await response.json();
            this.fetch_all_works();
        },
        async update_work(workID) {
            const response = await fetch("http://localhost:4000/works/update/" + workID, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.body_data)
            });
            const received_data = await response.json();
            this.fetch_all_works();
        },
        async create_work() {
            const response = await fetch("http://localhost:4000/works/addwork", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(this.body_data)
            });
            const received_data = await response.json();
            this.fetch_all_works();
        },

    },
    created() {
        
    }
}
</script>

<style scoped>
.container {
    height:100vh;

}
.login-text {
    margin-bottom: 20px;
    font-size: 30px;
}
.m-left-6 {
    margin-left: 6px;
}
.input-username-container {
    height:100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
