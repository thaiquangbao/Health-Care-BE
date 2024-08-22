class CommentDto {
  toCommentRes(comment, author) {
    const user = {
      _id: author._id,
      fullName: author.fullName,
      image: author.image,
    };
    const data = {
      _id: comment._id,
      text: comment.text,
      author: user,
      date: comment.date,
      qa: comment.qa,
      image: comment.image,
    };
    return data;
  }
}
module.exports = new CommentDto();
