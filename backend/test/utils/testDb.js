const mongoose = require('mongoose');
const Course = require('../../src/mongoose/models/Course');

const courses = [
  {
    //one
    _id: new mongoose.Types.ObjectId(),
    courseName: 'Node.js',
    courseDept: 'WD',
    description: 'Node.js is used to create back-end services',
    duration: 10,
    isRated: true,
    isApplied: true,
    noOfRatings: 15,
    rating: 4.5,
  },
  {
    //two
    _id: new mongoose.Types.ObjectId(),
    courseName: 'React.js',
    courseDept: 'WD',
    description: 'React.js is used to create front-end services',
    duration: 14,
    isRated: true,
    isApplied: true,
    noOfRatings: 145,
    rating: 4.3,
  },
  {
    //three
    _id: new mongoose.Types.ObjectId(),
    courseName: 'Angular',
    courseDept: 'WD',
    description: 'Angular is used to create front-end services',
    duration: 18,
    isRated: false,
    isApplied: false,
    noOfRatings: 10,
    rating: 4.1,
  },
  {
    //four
    _id: new mongoose.Types.ObjectId(),
    courseName: 'Machine Learning',
    courseDept: 'AI',
    description: 'ML is used in AI',
    duration: 20,
    isRated: false,
    isApplied: true,
    noOfRatings: 9,
    rating: 4.2,
  },
  {
    //five
    _id: new mongoose.Types.ObjectId(),
    courseName: 'SpringBboot',
    courseDept: 'WD',
    description: 'Springboot is used to create back-end services',
    duration: 12,
    isRated: false,
    isApplied: false,
    noOfRatings: 6,
    rating: 4.4,
  },
];

const setupDatabase = async () => {
  await Course.deleteMany();
  for (const course of courses) await new Course(course).save();
};

module.exports = {
  setupDatabase,
  courses,
};
