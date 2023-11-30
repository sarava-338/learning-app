import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from '@cfaester/enzyme-adapter-react-18';
import React from 'react';

import App from '../App';

Enzyme.configure({ adapter: new EnzymeAdapter() });

describe('App component', () => {
  const data = [
    {
      _id: '5ff5706baf74d71378df935f',
      courseName: 'Node.js',
      courseDept: 'WD',
      description: 'Node.js is used to create back-end services',
      duration: 10,
      isRated: true,
      isApplied: false,
      noOfRatings: 15,
      rating: 4.5,
    },
    {
      _id: '5ff5706baf74d71378df9360',
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
      _id: '5ff5706baf74d71378df9361',
      courseName: 'Angular',
      courseDept: 'WD',
      description: 'Angular is used to create front-end services',
      duration: 18,
      isRated: true,
      isApplied: false,
      noOfRatings: 10,
      rating: 4.1,
    },
  ];

  let component;
  let backendApp = 'http://localhost:8001';

  const getElementForTest2 = (ulId, liId) => component.find('ul').at(ulId).find('li').at(liId);

  // const getElementForTest3 = (ulId, liId) => component.find('ul');

  const getCourseDetails = course => `${course.duration} hrs . ${course.noOfRatings} ratings . ${course.rating}/5`;

  beforeEach(() => {
    const mockJsonPromise = Promise.resolve([]);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise,
    });
    // jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
    window.alert = jest.fn();

    component = shallow(<App />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1. Routes check', () => {
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(`${backendApp}/courses/get`);
    global.fetch.mockClear();
  });

  it('2. data map check', () => {
    component.instance().setState({ data });

    expect(getElementForTest2(0, 0).text()).toBe(data[0].courseName);
    expect(getElementForTest2(0, 1).text()).toBe(data[0].courseDept);
    expect(getElementForTest2(0, 2).text()).toBe(data[0].description);
    expect(getElementForTest2(0, 4).text()).toBe(getCourseDetails(data[0]));

    expect(getElementForTest2(1, 0).text()).toBe(data[1].courseName);
    expect(getElementForTest2(1, 1).text()).toBe(data[1].courseDept);
    expect(getElementForTest2(1, 2).text()).toBe(data[1].description);
    expect(getElementForTest2(1, 4).text()).toBe(getCourseDetails(data[1]));

    expect(getElementForTest2(2, 0).text()).toBe(data[2].courseName);
    expect(getElementForTest2(2, 1).text()).toBe(data[2].courseDept);
    expect(getElementForTest2(2, 2).text()).toBe(data[2].description);
    expect(getElementForTest2(2, 4).text()).toBe(getCourseDetails(data[2]));
  });

  it('3. Add rating check', () => {
    component.instance().setState({ data: [data[0]] });

    const addRating = component.find('ul').at(0).find('li').at(3).find('li').at(0).find('.rate').find('button');
    addRating.simulate('click');
    component.find('.rating').simulate('change', { target: { name: 'rating', value: 5 } });
    expect(component.state().rating).toBe(5);

    //patch

    let spy = jest.spyOn(component.instance(), 'handleAddRating');
    spy();
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(global.fetch).toHaveBeenCalledWith(`${backendApp}/courses/rating/${data[0]._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: '{"rating":1}',
    });
    global.fetch.mockClear();
  });

  it('4. Apply check', () => {
    component.instance().setState({ data: [data[0]] });

    const apply = component.find('ul').at(0).find('li').at(3).find('.btn');
    apply.simulate('click');
    let spy = jest.spyOn(component.instance(), 'handleApply');

    expect(global.fetch).toHaveBeenCalledWith(
      `${backendApp}/courses/enroll/${data[0]._id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    let spy1 = jest.spyOn(component.instance(), 'handleGetData');
    spy1();

    expect(spy1).toHaveBeenCalledTimes(1);
    global.fetch.mockClear();
  });

  it('5. drop rating check', () => {
    component.instance().setState({data: [data[0]]});

    const addrating = component.find('ul').at(0).find('li').at(3).find('.drop');
    addrating.simulate('click');
    
    // delete

    let spy = jest.spyOn(component.instance(), 'handleDrop');
    spy();

    window.alert = jest.fn();

    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(global.fetch).toHaveBeenCalledWith(
      `${backendApp}/courses/drop/${data[0]._id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    window.alert.mockClear();
    global.fetch.mockClear();
  });
});
