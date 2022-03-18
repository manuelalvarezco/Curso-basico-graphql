'use strict'

const connectDb = require('../db')
const { ObjectId } = require('mongodb')
const { errorHandler } = require('./errorHandler')



module.exports = {
  createCourse: async ( root , {input } )=> {
    const defaults = {
      teacher: '',
      topic: ''
    }

    const newCourse = Object.assign(defaults, input)
    let db
    let course
    try {
      db = await connectDb()
      course= await db.collection('courses').insertOne(newCourse)
      newCourse._id = course.insertedId
    } catch (error) {
      errorHandler(error)
    }
    return newCourse
  },

  editCourse: async (root, {id, input }) => {
    let db
    let course
    try {
      db = await connectDb()
      await db.collection('courses').updateOne(
        { _id: ObjectId(id) },
        { $set: input }
        )
      course = await db.collection('courses').findOne({ _id: ObjectId(id)})

    } catch (error) {
      errorHandler(error)
    }
    return course
  },

  // Students
  createPerson: async ( root , {input } )=> {
    let db
    let student
    try {
      db = await connectDb()
      student= await db.collection('students').insertOne(input)
      input._id = student.insertedId
    } catch (error) {
      errorHandler(error)
    }
    return input
  },

  editPerson: async (root, {id, input }) => {
    let db
    let student
    try {
      db = await connectDb()
      student= await db.collection('students').updateOne(
        { id: ObjectId(id) },
        { $set: input }
        )
      student = await db.collection('students').findOne({ id: ObjectId(id)})

    } catch (error) {
      errorHandler(error)
    }
    return student
  },

  addPeople: async (root, {courseID, personID})=>{
    let db
    let person
    let course
    try {
      db = await connectDb()
      course = await db.collection('courses').findOne({ _id: ObjectId(courseID)})
      person = await db.collection('students').findOne({ _id: ObjectId(personID)})

      if(!course && !person) throw new Error('La persona o el curso no existe')

      await db.collection('courses').updateOne(
        {_id: ObjectId(courseID)},
        { $addToSet: {people: ObjectId(personID)}}
      )

    } catch (error) {
      errorHandler(error)
    }
    return course
  }


}