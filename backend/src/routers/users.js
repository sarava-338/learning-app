const express = require('express');
const Course = require('../mongoose/models/Course');

const router = new express.Router();

// write your code here

router.get('/courses/get', async (req, res, next) => {
  res.json(await Course.find({}));
});

router.post('/courses/enroll/:id', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (course.isApplied) throw new Error('Course already enrolled');
    course.isApplied = true;
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(403).send(error.message);
  }
});

router.post('/courses/drop/:id', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course.isApplied) throw new Error('Course already dropped');
    course.isApplied = false;
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(403).send(error.message);
  }
});

router.patch('/courses/rating/:id', async (req, res, next) => {
  try {
    const course = await Course.findById(req.prams.id);

    if (!course.isApplied) throw new Error('course not enrolled');
    if (course.isRated) throw new Error('course already rated');

    const rating =
      (course.rating * course.noOfRatings + req.body.rating) /
      (course.noOfRatings + 1);

    res.json(
      await Course.findByIdAndUpdate(req.params.id, {
        rating,
        isRated: true,
        noOfRatings: course.noOfRatings + 1,
      })
    );
  } catch (error) {
    res.status(403).send(error.message);
  }
});

module.exports = router;
