const request = require('supertest');
const app = require('../src/app');
const { setupDatabase, courses } = require('./utils/testDb');
const Course = require('../src/mongoose/models/Course');
const { default: mongoose } = require('mongoose');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/learning-app');
});

beforeEach(setupDatabase);

afterAll(async () => {
  await mongoose.disconnect();
});

test('1. Viewing all the courses', async () => {
  const res = await request(app).get('/courses/get').expect(200);
  expect(res.body.length).toBe(5);
  expect(res.body[0].coursename).toBe(courses[0].courseName);
  expect(res.body[1].coursename).toBe(courses[1].courseName);
  expect(res.body[2].coursename).toBe(courses[2].courseName);
  expect(res.body[3].coursename).toBe(courses[3].courseName);
  expect(res.body[4].coursename).toBe(courses[4].courseName);
});

test('2. Enrolling a course', async () => {
  await request(app).post(`/courses/enroll/${courses[2]._id}`).expect(200);
  const course = await Course.findById(courses[2]._id);
  expect(course.isApplied).toBe(true);
});

test('3. Enrolling an already enrolled course', async () => {
  await request(app).post(`/courses/enroll/${courses[0]._id}`).expect(403);
  const course = await Course.findById(courses[0]._id);
  expect(course.isApplied).toBe(true);
});

test('4. Dropping a course', async () => {
  await request(app).post(`/courses/drop/${courses[1]._id}`).expect(200);
  const course = await Course.findById(courses[1]._id);
  expect(course.isApplied).toBe(false);
});

test('5. dropping an uenrolled course', async () => {
  await request(app).post(`/courses/drop/${courses[2]._id}`).expect(403);
  const course = await Course.findById(courses[2]._id);
  expect(course.isApplied).toBe(false);
});

test('6. Rating a course', async () => {
  await request(app).patch(`/courses/rating/${courses[3]._id}`).send({
    rating: 5,
  });
  const course = await Course.findById(courses[3]._id);
  expect(course.rating).toBe(4.3);
  expect(course.noOfRatings).toBe(courses[3].noOfRatings + 1);
});

test('7. Rating an already rated course', async () => {
  await request(app)
    .patch(`/courses/rating/${courses[0]._id}`)
    .send({
      rating: 5,
    })
    .expect(403);
});

test('8. Rating an unenrolled course', async () => {
  await request(app)
    .patch(`/courses/rating/${courses[4]._id}`)
    .send({
      rating: 5,
    })
    .expect(403);
});
