const CommentModel = require("../models/CommentModel");
const PostModel = require("../models/PostModel");

/* When a user submits a new post through the form, it is saved to the database, and MongoDB generates a unique _id for this post. */
const create_post = async (req, res) => {
  try {
    let { title, content } = req.body;
    let post = new PostModel({
      title,
      content,
      user_id: req.session.userId,
      // _id
    });

    await post.save();

    return res.redirect("/dashboard");
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const submit_comment = async (req, res) => {
  try {
    let { comment } = req.body;
    let commentObj = {
      comment,
      user_id: req.session.userId,
      post_id: req.params.post_id,
    };

    let commentModel = new CommentModel(commentObj);
    await commentModel.save();
    return res.redirect(`/post/${req.params.post_id}`);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  create_post,
  submit_comment,
};
