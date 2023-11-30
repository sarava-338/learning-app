import React from 'react';

export default class Home extends React.Component {
  state = {
    show: false,
    data: [],
    rating: 1,
    selectedCourseId: '',
  };

  backendApp = 'http://localhost:8001';

  componentDidMount = async () => {
    this.setState({ data: await this.handleGetData() });
  };

  handleGetData = async () => {
    const res = await fetch(`${this.backendApp}/courses/get`);
    return await res.json();
  };

  handleApply = async id => {
    await fetch(`${this.backendApp}/courses/enroll/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  };

  handleRating = (e, id) => {
    this.setState({ rating: parseInt(e.target.value, 10), selectedCourseId: id });
  };

  handleAddRating = async id => {
    const rating = this.state.rating;
    await fetch(`${this.backendApp}/courses/rating/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: `{"rating":${rating}}`,
    });
  };

  handleDrop = async id => {
    await fetch(`${this.backendApp}/courses/drop/${id}`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  };

  render() {
    return (
      <div className='home'>
        <header>
          <h2>ABC Learning</h2>
        </header>

        {/** Write your code here */}
        <div className='cardContainer'>
          {this.state.data.map((course, i) => (
            <div className='card' key={i}>
              <ul>
                <div className='header'>
                  <li>{course.courseName}</li>
                  <li>{course.courseDept}</li>
                  <li>{course.description}</li>
                  <li>
                    Rate:
                    <select name='rating' id='' className='rating' value={course.rating} onChange={e => this.handleRating(e, course._id)}>
                      <option value='1'>1</option>
                      <option value='2'>2</option>
                      <option value='3'>3</option>
                      <option value='4'>4</option>
                      <option value='5'>5</option>
                    </select>
                    <button
                      className='rate'
                      onClick={() => {
                        this.handleAddRating(course._id);
                      }}>
                      Add
                    </button>
                    <button
                      className='drop'
                      onClick={() => {
                        this.handleDrop(course._id);
                      }}>
                      Drop Course
                    </button>
                    <button
                      className='btn'
                      onClick={() => {
                        this.handleApply(course._id);
                      }}>
                      Apply
                    </button>
                  </li>
                </div>
                <div className='footer'>
                  <li>
                    {course.duration} hrs . {course.noOfRatings} ratings . {course.rating}/5
                  </li>
                </div>
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
