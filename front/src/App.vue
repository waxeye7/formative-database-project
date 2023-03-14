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
                <Button @click="current_username = typed; get_user_by_username_and_verify_if_admin(current_username);"
                    class="m-left-6" label="Submit" />
            </div>

        </div>

    </div>
    <div v-else-if="current_username.length" class="container">
        <h1>hello {{ current_username }}</h1>
        <div v-if="admin">
            <h2>you are admin</h2>

            <div class="inputs-wrapper">
                <label for="name">name</label>
                <InputText class="InputText" type="text" v-model="interact.name" />
                <label for="imageUrl">imageUrl</label>
                <InputText class="InputText" type="text" v-model="interact.imageUrl" />
                <label for="author">author</label>
                <InputText class="InputText" type="text" v-model="interact.author" />
                <label for="url">url</label>
                <InputText class="InputText" type="text" v-model="interact.url" />

                <div class="flex buttons-wrapper">
                    <Button class="small-margin-right" @click="create_work" label="Create Work" />
                    <Button class="small-margin-right" @click="update_work(currentID)" label="Update Work" />
                    <Button @click="delete_work(currentID)" label="Delete Work" />
                </div>

            </div>



        </div>

        <div v-for="(work) in works_list" :key="work._id">
            <div @click="selected = work._id; interact.name = work.name; interact.author = work.author; interact.imageUrl = work.imageUrl; interact.url = work.url; currentID = work._id;"
                :class="{ 'red_border': admin && selected && selected === work._id }" class="flex info-wrapper">
                <div class="flex flex-col">
                    <h1 class="small-margin-right">title: {{ work.name }}</h1>
                    <h1 class="small-margin-right">author: {{ work.author }}</h1>
                    <a class="fit-content small-margin-right" target="_blank" :href="work.url">site</a>
                </div>
                <img :src="work.imageUrl">
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
    methods: {
        // GET (single) User by Username
        async get_user_by_username_and_verify_if_admin(username) {
            if (username.length) {
                const usernameResponse = await fetch("https://idyllic-alfajores-43aebc.netlify.app/users/getuserbyusername/" + username);
                const received_user_data = await usernameResponse.json();
                console.log(received_user_data)
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
            const response = await fetch("https://idyllic-alfajores-43aebc.netlify.app/works/");
            const received_data = await response.json();
            this.works_list = received_data;
            console.log(received_data)
        },
        async delete_work(workID) {
            if (this.works_list.filter(work => work._id === workID).length > 0) {
                let objectOfInputs = this.interact;
                if (objectOfInputs.name.length &&
                    objectOfInputs.author.length &&
                    objectOfInputs.imageUrl.length &&
                    objectOfInputs.url.length) {
                    let fetch_url = 'https://idyllic-alfajores-43aebc.netlify.app/delete/' + workID;
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

                    const response = await fetch("https://idyllic-alfajores-43aebc.netlify.app/update/" + workID, {
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
                const response = await fetch("https://idyllic-alfajores-43aebc.netlify.app/works/addwork", {
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
.buttons-wrapper {
    margin: 10px 0;
    width: fit-content;
}

.red_border {
    outline: 4px red dotted !important;
}

a {
    text-decoration: underline;
    color: black;
    font-size: 30px;
}

.info-wrapper {
    border: 1px black solid;
    width: fit-content;
}

.small-margin-right {
    margin-right: 12px;
}

.inputs-wrapper {
    display: flex;
    flex-direction: column;
    width: 240px;
}

.inputs-wrapper .InputText {
    margin-bottom: 2px;
}

.container {
    height: 100vh;

}

.login-text {
    margin-bottom: 20px;
    font-size: 30px;
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
</style>
