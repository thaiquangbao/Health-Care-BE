class QAResponse {
  async toQAResponse(qa, user) {
    const data = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      sex: user.sex,
      image: user.image,
      dateOfBirth: user.dateOfBirth,
    };
    const qaData = {
      _id: qa._id,
      patient: data,
      content: qa.content,
      image: qa.image,
      date: qa.date,
      like: qa.like,
      views: qa.views,
      category: qa.category,
      title: qa.title,
      comment: qa.comment,
    };
    return qaData;
  }
}
module.exports = new QAResponse();
