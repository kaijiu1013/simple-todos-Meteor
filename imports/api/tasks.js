import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
    // this code only runs on the server
    Meteor.publish('tasks', function tasksPublication() {
        // return Tasks.find();
        return Tasks.find({
            $or: [
                { private: { $ne: true} },
                { owner: this.userId }
            ]
        })
    });
}

Meteor.methods({
    'tasks.insert'(text) {
        check(text, String);

        // make sure the user is logged in before inserting a task
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.insert({
            text,
            createdAt: new Date(),
            owner: this.userId,
            username: Meteor.users.findOne(this.userId).username,
        });
    },
    'tasks.remove'(taskId) {
        check(taskId, String);

        // Tasks.remove(taskId);
        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // if the task is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
        }
        Tasks.remove(taskId);
    },
    'tasks.setChecked'(taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);

        // Tasks.update(taskId, { $set: { checked: setChecked } });
        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
            // if the task is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }
        Tasks.update(taskId, { $set: { checked: setChecked } });
    },
    'task.setPrivate'(taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);

        const task = Tasks.findOne(taskId);

        // make sure only the task owner can make a task private
        if(task.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        Tasks.update(taskId, { $set: { private: setToPrivate } });
    }
});
