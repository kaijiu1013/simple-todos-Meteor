<template>
  <div className="container">
    <header>
      <h1>Todo List ({{ incompleteCount }})</h1>

      <label className="hide-completed">
        <input
          type="checkbox"
          readonly
          checked="hideCompleted"
          v-model="hideCompleted"
          @click="toggleHideCompleted"
        />
        Hide Completed Tasks
      </label>

      <blaze-template template="loginButtons" tag="span"></blaze-template>
      <template v-if="currentUser">
        <form className="new-task" @submit.prevent="handleSubmit">
          <input
            type="text"
            placeholder="Type to add new tasks"
            v-model="newTask"
          />
        </form>
      </template>
    </header>
    <ul>
      <Task
       v-for="task in tasks"
       v-bind:key="task._id"
       v-bind:task="task"
       v-bind:showPrivateButton="showPrivateButton(task)"
      />
      <!-- <Task v-for="task in tasks" v-bind:key="task._id" v-bind:task="task" /> -->
      <!-- <Task
              v-for="task in getTasks()"
              v-bind:key="task._id"
              v-bind:task="task"
            /> -->
    </ul>
  </div>
</template>

<script>
import { Meteor } from "meteor/meteor";
import Vue from "vue";
import Task from "./Task.vue";
import { Tasks } from "../api/tasks.js";

export default {
  components: {
    Task,
  },
  data() {
    return {
      newTask: "",
      hideCompleted: false,
    };
  },
  methods: {
    // getTasks() {
    //     return [
    //         { _id: 1, text: "This is task 1"},
    //         { _id: 2, text: "This is task 2"},
    //         { _id: 3, text: "This is task 3"}
    //     ];
    // }
    handleSubmit(event) {
      // Tasks.insert({
      //   text: this.newTask,
      //   createdAt: new Date(), // current time
      //   owner: Meteor.userId, //_id of logged in user
      //   username: Meteor.user().username, // username of logged in user
      // });

      Meteor.call('tasks.insert', this.newTask);
      //Clear form
      this.newTask = "";
    },
    toggleHideCompleted() {
      this.hideCompleted = !this.hideCompleted;
    },
    showPrivateButton(task) {
      const currentUserId = this.currentUser?._id;
      return task.owner === currentUserId;
    }
  },
  meteor: {
    $subscribe: {
      // Subscribes tothe 'threads' publication with no parameters
      tasks: []
    },
    tasks() {
      // return Tasks.find({}, {sort: { createdAt: -1 } }).fetch();
      let filteredTasks = Tasks.find({}, { sort: { createdAt: -1 } }).fetch();
      if (this.hideCompleted) {
        filteredTasks = filteredTasks.filter((task) => !task.checked);
      }
      return filteredTasks;
    },
    incompleteCount() {
      return Tasks.find({ checked: { $ne: true } }).count();
    },
    currentUser() {
      return Meteor.user();
    },
  },
};
</script>>