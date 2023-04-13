const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

exports.getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

exports.getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw NotFoundError('Invalid Job ID');
  }
  res.status(StatusCodes.OK).json(job);
};

exports.createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

exports.updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (!company === '' || position === '') {
    throw new BadRequestError('Compnay or Position fields cannot be empty');
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw NotFoundError('Invalid Job ID');
  }
  res.status(StatusCodes.OK).json(job);
};

exports.deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });
  if (!job) {
    throw NotFoundError('Invalid Job ID');
  }
  res.status(StatusCodes.OK).send();
};
