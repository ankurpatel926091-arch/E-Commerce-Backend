const Category = require('../models/category')

const cloudinary = require('../config/cloudinary')
  
const createCategory = async (req, res) => {
  try {
    console.log('createCategory called by user:', req.user ? req.user._id || req.user : req.user)
    console.log('createCategory body:', req.body)
    console.log('createCategory file:', req.file)
    if (!req.file) {
      return res.status(400).json({ message: 'Category image is required.' })
    }

    let imageUrl = ''
    let publicId = undefined

    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'categories'
      })
      imageUrl = result.secure_url
      publicId = result.public_id
    } catch (cloudError) {
      console.warn('Cloudinary upload failed, using local upload path:', cloudError.message)
      imageUrl = `/uploads/${req.file.filename}`
      publicId = undefined
    }

    const categoryData = {
      categoryName: req.body.categoryName,
      image: imageUrl
    }
    if (publicId) {
      categoryData.publicId = publicId
    }

    const category = await Category.create(categoryData)

    res.status(201).json({ message: 'Category Created', category })
  } catch (error) {
    console.error('createCategory error:', error)
    return res.status(500).json({ message: 'Server Error', error: error.message })
  }
}



const getCategory = async(req,res)=>{
    try {
        const category = await Category.find()
        res.status(200).json({message:"Category Found",category})
    } catch (error) {
        res.status(400).json({message:"Server error during getting category"})
    }
}


const updateCategory =async(req,res)=>{
    try {
        const category = await Category.findById(req.params.id)
        if(!category){
            return res.status(404).json({message:"Category not found"})
        }
        if (req.file) {
            if (category.publicId) {
                await cloudinary.uploader.destroy(category.publicId)
            }
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'categories'
            })
            category.publicId = result.public_id
            category.image = result.secure_url
        }
        category.categoryName = req.body.categoryName || category.categoryName 
        await category.save()
        res.status(200).json({message:"Category Updated"})

    } catch (error) {
        res.status(500).json({message:"Server Error",error})
    }
}


const deleteCategory = async(req,res)=>{
    try {
        const category = await Category.findById(req.params.id)
        if(!category){
            return res.status(404).json({message:"Category not found"})
        }
        if (category.publicId) {
            await cloudinary.uploader.destroy(category.publicId)
        }
        await category.deleteOne()
        res.status(200).json({message:"Category Deleted"})
    } catch (error) {
        return res.status(500).json({message:"Server Error During Delete Category",error})
    }
}


module.exports= {createCategory,getCategory,updateCategory,deleteCategory}