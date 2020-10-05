<template>
    <!-- <li>{{ this.task.text }}</li> -->
    <li v-bind:class="taskClassName">
        <button className="delete" @click="deleteThisTask">
            ×
        </button>

        <input 
         type="checkbox"
         readOnly
         v-bind:checked="!!this.task.checked"
         @click="toggleCheched"
        />

        <template v-if="this.showPrivateButton">
            <button className="toggle-private" @click="togglePrivate">
                {{ this.task.private ? "Private" : "Public"}}
            </button>
        </template>

        <span class="text"> 
            <strong> {{ this.task.username }} </strong>
            : {{ this.task.text }}
        </span>
    </li>
</template>

<script>
import { Tasks } from "../api/tasks.js";
import { Meteor } from "meteor/meteor";
import classnames from "classnames";

export default {
    props: ["task", "showPrivateButton"],
    data() {
        return {};
    },
    computed: {
        taskClassName: function() {
            // return this.task.checked ? "checked" : "";
            return classnames({
                checked: this.task.checked,
                private: this.task.private
            })
        }
    },
    methods: {
        toggleCheched() {
            // Set the checked property to the opposite of its current value
            // Tasks.update(this.task._id, {
            //     $set: { checked: !this.task.checked }
            // });
            Meteor.call('tasks.setChecked', this.task._id, !this.task.checked);
        },
        deleteThisTask() {
            // Tasks.remove(this.task._id);
            Meteor.call('tasks.remove', this.task._id);
        },
        togglePrivate() {
            Meteor.call("tasks.setPrivate", this.task._id, !this.task.private);
        }
    }
};
</script>