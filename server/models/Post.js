const mongoose = require('mongoose');
const {schema, model} = mongoose;

const PostSchema = new mongoose.Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
},{
    timestamps: true,
});

const PostModel = model('Post',PostSchema);

module.exports = PostModel