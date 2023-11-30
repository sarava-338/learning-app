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

router.delete('/courses/drop/:id', async (req, res, next) => {
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
    const course = await Course.findById(req.params.id);

    if (!course.isApplied) throw new Error('course not enrolled');
    if (course.isRated) throw new Error('course already rated');

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          rating: parseFloat((course.rating * course.noOfRatings + req.body.rating) / (course.noOfRatings + 1)).toFixed(1),
          noOfRatings: course.noOfRatings + 1,
          isRated: true,
        },
      },
      { new: true }
    );
    res.json(updatedCourse);
  } catch (error) {
    res.status(403).send(error.message);
  }
});

module.exports = router;
