const Product = require('../models/product')
const cloudinary = require('../config/cloudinary')

exports.createProduct = async (req, res) => {
  try {
    const { productName, price, description, category } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Product images are required.' });
    }

    const images = [];

    for (const file of req.files) {
      let imageUrl = '';
      let publicId = undefined;

      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
        });
        imageUrl = result.secure_url;
        publicId = result.public_id;
      } catch (cloudError) {
        console.warn('Cloudinary upload failed for product image, using local upload path:', cloudError.message);
        imageUrl = `/uploads/${file.filename}`;
      }

      images.push({
        url: imageUrl,
        publicId,
      });
    }

    const product = await Product.create({
      productName,
      price,
      description,
      category,
      images,
    });

    res.status(201).json({
      message: "Product Created",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


exports.getProducts=async(req,res)=>{
    try {
        const product = await Product.find().populate('category');
        if(!product){
            return res.status(404).json({message:"Product Not Found"});
        }
        res.status(200).json({message:"Product Found",product})
    } catch (error) {
        res.status(500).json({message:"Server error"})
        console.log(error);
        
    }
}

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' })
    }

    await product.deleteOne()
    res.status(200).json({ message: 'Product deleted successfully.' })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({ message: 'Server error while deleting product.', error: error.message })
  }
}
