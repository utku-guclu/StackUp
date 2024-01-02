const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  is_completed: {
    type: Boolean,
    required: false,
    default: false,
  },
}, {
  timestamps: true,
});

const TaskModel = mongoose.model('tasks', taskSchema);

module.exports = TaskModel;


/* In the code sample above, we will import mongoose, which is an Object Relational Mapping (ORM) module to communicate directly to our database. There are alternatives to communicating with databases. These can come in the form of raw query strings like SELECT * FROM tasks . This is a query string for SQL databases. This includes MySQL and MongoDB.

The reason why ORMs are better than writing query strings is that they are safer and a recommended practice in software development. Writing raw query strings poses a security concern and a huge risk to SQL injection. SQL injection is the name of a process when someone tries to inject another SQL string with the intent to steal or destroy databases and collections. Gone are the days when we will need to learn Query Languages. But it is still important that we learn the foundations of query strings as a programmer. If you are interested in reading more about SQL injection, please read this article.

In TaskModel.js, we will define the keys that we are expecting to store in the database. Keys such as task (line 4) and is_completed (line 8). We can also define the data type we are expecting to store within the database (lines 5 and line 9). Lastly, we can also configure whether this key is necessary when creating a new document. If the key is not found within the document creation operation, the process of creating a new document will fail. It is similar to how MySQL checks for non-null values in the columns. In line 17, we will define the name of the collection that will be storing our documents. For this step, we will be using tasks as the name of our collection. In line 14, we will also configure that we would want to track the timestamp. As such we set the timestamp to be true. By doing so, MongoDB will automatically store the timestamp when the document has been created and when the document has been updated. */