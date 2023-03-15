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
            <h1 class="login-text text-align-center">log in (user admin to read/write db)</h1>
            <div class="flex">
                <span class="p-float-label">
                    <InputText id="username" v-model="typed" />
                    <label v-if="!typed.length" for="username">Username</label>
                </span>
                <Button @click="current_username = typed; get_user_by_username_and_verify_if_admin(current_username);"
                    class="m-left-6" label="Submit" />
            </div>

        </div>

    </div>
    <div v-else-if="current_username.length" class="container">
        <div :class="{'change-upper-section-height':!admin}" class="upper-section align-text">
            <span>hello {{ current_username }} <span class="smaller-text" v-if="admin">(you are admin)</span></span>
            
        <div v-if="admin">
            

            <div class="inputs-wrapper">
                <div class="flex flex-col very-small-margin-right-left">
                    <label for="name">name</label>
                    <InputText class="InputText" type="text" v-model="interact.name" />
                </div>

                <div class="flex flex-col very-small-margin-right-left">
                    <label for="imageUrl">imageUrl</label>
                    <InputText class="InputText" type="text" v-model="interact.imageUrl" />
                </div>

                <div class="flex flex-col very-small-margin-right-left">
                    <label for="author">author</label>
                    <InputText class="InputText" type="text" v-model="interact.author" />
                </div>

                <div class="flex flex-col very-small-margin-right-left">
                    <label for="url">url</label>
                    <InputText class="InputText" type="text" v-model="interact.url" />
                </div>
            </div>

                <div class="flex buttons-wrapper">
                    <Button class="small-margin-right" @click="create_work" label="Create Work" />
                    <Button class="small-margin-right" @click="update_work(currentID)" label="Update Work" />
                    <Button @click="delete_work(currentID)" label="Delete Work" />
                </div>
        </div>
        </div>


    <div class="lower-section" :class="{'change-bottom-section-height':!admin}" >
        <div class="items-wrapper" v-for="(work) in reversed_list" :key="work._id">
            <div @click="selected = work._id; interact.name = work.name; interact.author = work.author; interact.imageUrl = work.imageUrl; interact.url = work.url; currentID = work._id;"
                :class="[{ 'red_border': admin && selected && selected === work._id },{'selected':selected && selected === work._id}]" class="flex info-wrapper">
                <div class="flex flex-col text-section">
                    <h1 class="small-margin-right">title: {{ work.name }}</h1>
                    <h1 class="small-margin-right">author: {{ work.author }}</h1>
                    <a class="fit-content small-margin-right" target="_blank" :href="work.url">{{work.url}}</a>
                </div>
                <img :src="work.imageUrl">
            </div>

        </div>
    </div>




    </div>
</template>

<script>
export default {
    data() {
        return {
            selected: false,
            interact: {
                name: "",
                imageUrl: "",
                author: "",
                url: "",
            },
            currentID: false,
            typed: "",
            current_username: "",
            admin: false,
            works_list: [],
        }
    },
    computed: {
        reversed_list() {
            return this.works_list.reverse();
        }
    },
    methods: {
        // GET (single) User by Username
        async get_user_by_username_and_verify_if_admin(username) {
            if (username.length) {
                const usernameResponse = await fetch("http://localhost:4000/users/getuserbyusername/" + username);
                const received_user_data = await usernameResponse.json();
                let user = received_user_data[0]
                if (user && user.isAdmin) {
                    this.admin = true;
                }
                else {
                    this.admin = false;
                }

                this.fetch_all_works();
            }


        },

        async fetch_all_works() {
            const response = await fetch("http://localhost:4000/works/");
            const received_data = await response.json();
            this.works_list = received_data;
        },
        async delete_work(workID) {
            if (this.works_list.filter(work => work._id === workID).length > 0) {
                let objectOfInputs = this.interact;
                if (objectOfInputs.name.length &&
                    objectOfInputs.author.length &&
                    objectOfInputs.imageUrl.length &&
                    objectOfInputs.url.length) {
                    let fetch_url = 'http://localhost:4000/works/delete/' + workID;
                    const response = await fetch(fetch_url, { method: "DELETE" });
                    const received_data = await response.json();
                    this.fetch_all_works();
                }
            }
        },
        async update_work(workID) {
            if (this.works_list.filter(work => work._id === workID).length > 0) {
                let objectOfInputs = this.interact;
                if (objectOfInputs.name.length &&
                    objectOfInputs.author.length &&
                    objectOfInputs.imageUrl.length &&
                    objectOfInputs.url.length) {

                    const response = await fetch("http://localhost:4000/works/update/" + workID, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: this.interact.name,
                            imageUrl: this.interact.imageUrl,
                            author: this.interact.author,
                            url: this.interact.url
                        })
                    });
                    const received_data = await response.json();
                    this.fetch_all_works();

                }
            }


        },
        async create_work() {
            let objectOfInputs = this.interact;
            if (objectOfInputs.name.length &&
                objectOfInputs.author.length &&
                objectOfInputs.imageUrl.length &&
                objectOfInputs.url.length) {
                const response = await fetch("http://localhost:4000/works/addwork", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: this.interact.name,
                        imageUrl: this.interact.imageUrl,
                        author: this.interact.author,
                        url: this.interact.url
                    })
                });
                const received_data = await response.json();
                this.fetch_all_works();
            }

        },

    },
    created() {

    }
}
</script>

<style scoped>
.text-section {
    display: flex;
    justify-content: space-around;
    max-width: 400px;
}
.very-small-margin-right-left {
    margin:0 4px;
}
.align-text {
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.change-upper-section-height {
    min-height: 12vh !important;
}
.change-bottom-section-height {
    min-height: 88vh !important;
}
.items-wrapper {
    display:flex;
    justify-content: center;
    align-items:center;
}
.buttons-wrapper {
    justify-content: center;
    margin: 10px 0;
}

.red_border {
    outline: 2px white solid !important;
}

a {
    text-decoration: none;
    color: rgb(102, 151, 255);
    font-size: 30px;
}

.info-wrapper {
    border: 1px white solid;
    background-color: rgb(0, 0, 0);
    margin-bottom:14px;
    max-width: 90%;
}
.selected {
    background-color: hsl(0, 0%, 9%);
}
.info-wrapper img {
    width: 240px;
    max-height: 220px;
    object-fit: cover;
}
.info-wrapper a {
    width:fit-content;
}
.info-wrapper h1  {
    width:400px;
}

.small-margin-right {
    margin-right: 12px;
}

.inputs-wrapper {
    width:100%;
    display: flex;
    justify-content: center;
}

.inputs-wrapper .InputText {
    margin-bottom: 2px;
    max-height: 40px;
}

.container {
    height: 100vh;

}

.login-text {
    margin-bottom: 20px;
    font-size: 30px;
    color:black !important;
}

.m-left-6 {
    margin-left: 6px;
}

.input-username-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

body {
  font-family: Helvetica;
}
.lower-section,
.upper-section {
  color: rgba(#2980b9, 0.5);
} 
.upper-section span {
    font-size: 2.2rem;
}
.upper-section {
  min-height: 24vh;
  width: 100%;
  background: #34495e;
  
}
.lower-section{
    padding-top: 50px;
  min-height: 76vh;
  width: 100%;
  background:  #2c3e50;
}
.smaller-text {
    font-size: 26px !important;
}
</style>
