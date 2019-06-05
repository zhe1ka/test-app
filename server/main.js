import { Meteor } from 'meteor/meteor';
import { testCollection } from "../lib/collection";

const fakeData = [
    { a: 1, b: 2 },
    { a: 1, b: 2 },
    { a: 1, b: 2 },
];

if (testCollection.find().count() === 0) {
    fakeData.forEach((item) => {
        testCollection.insert(item);
    });
}

Meteor.methods({
    'add.item'() {
        const firstItem = testCollection.findOne();

        testCollection.update(firstItem._id, {
            $set: {
                a: firstItem.a + 1,
            }
        })
    }
});

Meteor.publish('publish1', function () {
    const cursor = testCollection.find();

    cursor.forEach((item) => {
        this.added('testCollection', item._id, item);
    });

    // cursor.observe({
    //     changed: (newDoc) => {
    //         // since inside this publication "testCollection" is fulled then it works as expected
    //         // the object is changed each time
    //         this.changed('testCollection', newDoc._id, newDoc);
    //     }
    // });

    this.ready();
});

Meteor.publish('publish2', function () {
    const cursor = testCollection.find();

    this.ready();

    cursor.observe({
        changed: (newDoc) => {
            console.log('observer works');

            // This doesn't change the object
            this.changed('testCollection', newDoc._id, newDoc);

            // but this line adds "newField" so it means that it's possible to change testCollection's object from this publication
            // this.changed('testCollection', newDoc._id, { newField: 1 });
        }
    });
});
