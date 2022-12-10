const express = require('express');
const router = express.Router();
const Task = require('../db/models/Task');
const aeh = require('../middleware/asyncErrorHandler');


//*****  Create Task     ******//
router.post('/addTask', aeh(async function (req, res) {
  try {
    const { name, parentId } = req.body
    if (!name) {
      return res.status(403).error("Please add name")
    }
    let data = await Task.create({ name, parentId })
    return res.status(200).json({
      success: true,
      data: data
    })
  }
  catch (error) {
    console.log(error)
    throw error
  }
}));

//*****  Update Task     ******//
router.put('/update', aeh(async function (req, res) {
  try {
    const { id, name, dob, salary, joiningDate, releivingDate, contact, status } = req.body
    if (!id || !name) {
      return res.status(403).error("Please pass id & name")
    }
    let EmployeeExists = await Task.find({ _id: id })
    if (!EmployeeExists || EmployeeExists.length == 0) {
      return res.status(403).error("Task do not exists!")
    }
    await Task.updateOne({ _id: id }, { name, dob, salary, joiningDate, releivingDate, contact, status })
    return res.status(200).json({
      success: true,
      data: 'Updated Successfully'
    })
  }
  catch (error) {
    console.log(error)
    throw error
  }
}));

//*****  delete Task     ******//
router.post('/delete', aeh(async function (req, res) {
  try {
    const { id } = req.body
    console.log(id)
    if (!id) {
      return res.status(403).error(" please pass id")
    }
    let dataExists = await Task.find({ _id: id })
    if (!dataExists || dataExists.length == 0) {
      return res.status(403).error("Task do not exists!")
    }
    await Task.deleteOne({ _id: id })
    return res.status(200).json({
      success: true,
      data: 'deleted Successfully'
    })
  }
  catch (error) {
    console.log(error)
    throw error
  }
}));

//*****      task by id     ******//
router.get('/id/:taskId', aeh(async function (req, res) {
  try {
    const { taskId } = req.params
    if (!taskId) {
      return res.status(403).error("Please pass id")
    }
    let data = await Task.find({ _id: taskId }).sort({ createdAt: -1 })
    return res.status(200).json({
      success: true,
      data: data[0]
    })
  }
  catch (error) {
    console.log(error)
    throw error
  }
}));


//*****      List all Tasks     ******//
router.get('/listTasks', aeh(async function (req, res) {
  try {
    let TaskData = await Task.find({})
    return res.status(200).json({
      success: true,
      data: TaskData
    })
  }
  catch (error) {
    console.log(error)
    throw error
  }
}));

module.exports = router;