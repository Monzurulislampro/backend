const getUser = (req, res, next) => {
  const { name, email, jobStatus } = req.body;
  const user = new User({ name, email, jobStatus });

  user
    .save()
    .then(() => res.status(200).send(user))
    .catch((error) => next(error));
};
module.exports = { getUser };
