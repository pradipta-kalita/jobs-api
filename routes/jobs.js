const express = require('express');
const router = express.Router();

const jobsController = require('../controllers/jobs');

// prettier-ignore
router
  .route('/')
  .post(jobsController.createJob)
  .get(jobsController.getAllJobs);

router
  .route('/:id')
  .get(jobsController.getJob)
  .patch(jobsController.updateJob)
  .delete(jobsController.deleteJob);

module.exports = router;
