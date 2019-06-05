import { Template } from 'meteor/templating';

import './main.html';
import {testCollection} from "../lib/collection";

Template.hello.onCreated(function () {
  this.autorun(() => {
    this.subscribe('publish1');
    this.subscribe('publish2');

    console.log(testCollection.find().fetch());
  })
});

Template.hello.events({
  'click button'(event, instance) {
    Meteor.call('add.item');
  },
});
