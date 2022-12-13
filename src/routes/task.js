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
router.post('/update', aeh(async function (req, res) {
  try {
    let { id, name, status, parentId } = req.body
    if (!id || !name || !status) {
      return res.status(403).error("Please pass all details")
    }
    let DataExists = await Task.find({ _id: id })
    if (!DataExists || DataExists.length == 0) {
      return res.status(403).error("Task do not exists!")
    }
    if(DataExists[0]._doc.parentId !== parentId){
      let newParentChilds = await Task.find({parentId: parentId})
      console.log(newParentChilds)
      if(newParentChilds.length > 0){
        const filterData = newParentChilds.filter((ele) => ele._doc.status !== 'Completed');
        if(filterData.length > 0){
          let update = await Task.updateOne({ _id: id }, { status: 'In Progress' })
          return res.status(200).json({
            success: true,
            data: 'Updated Successfully'
          })
        } else if (filterData.length == 0){
          let update = await Task.updateOne({ _id: id }, { status })
          return res.status(200).json({
            success: true,
            data: 'Updated Successfully'
          })
        }
      }
    }
    await Task.updateOne({ _id: id }, { name, status, parentId })
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

//*****  Update Status     ******//
router.post('/updateStatus', aeh(async function (req, res) {
  try {
    let { id, status } = req.body
    if (!id) {
      return res.status(403).error("Please pass Id")
    }
    let DataExists = await Task.find({ _id: id })
    if (!DataExists || DataExists.length == 0) {
      return res.status(403).error("Task do not exists!")
    }
    let ChildTasks = await Task.find({ parentId: id })
    if(ChildTasks.length == 0){
      let update = await Task.updateOne({ _id: id }, { status })
      return res.status(200).json({
        success: true,
        data: 'Updated Successfully'
      })
    }
    if(ChildTasks.length !== 0){
      const filterData = ChildTasks.filter((ele) => ele._doc.status !== 'Completed');
      console.log(filterData)
      if(filterData.length > 0){
        return res.status(403).error("Child Tasks Are Not Completed!")
      } else if (filterData.length == 0){
        let update = await Task.updateOne({ _id: id }, { status })
        return res.status(200).json({
          success: true,
          data: 'Updated Successfully'
        })
      }
    }
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

//*****     Child task by parent id     ******//
router.get('/childTasks/:taskId', aeh(async function (req, res) {
  try {
    const { taskId } = req.params
    if (!taskId) {
      return res.status(403).error("Please pass id")
    }
    let data = await Task.find({ parentId: taskId })
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