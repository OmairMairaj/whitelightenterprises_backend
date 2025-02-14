const express = require('express')

require('dotenv').config();
const ProductsModel = require('../models/Products');
const CategoryModel = require('../models/Category');
const subCategoryModel = require('../models/subCategory');
const SharedFunctionsUtils = require('../Utils/SharedFunctions');
const router = express.Router();
const mongoose = require("mongoose");

router.post('/category-list-all', async (req, res, next) => {
    try {
        const categories = await CategoryModel.find({isActive:true});

        return res.status(200).json({
            status: true,
            categories: categories,
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
           
        });
    }
});




router.post('/category-data', async (req, res, next) => {
    try {
        const { catId } = req.body;

        const DataRes = await CategoryModel.findOne({ catId: catId });

        if (DataRes) {
            return res.status(200).json({
                status: true,
                DataRes: DataRes,
            });
        } else {
            return res.status(404).json({
                status: false,
                msg: 'data not found',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            status: false,
            msg: error.message,
        });
    }
});




router.post('/sub-category-list-all', async (req, res, next) => {

    try {
        const { categoryId } = req.body;
      
        
        const subcategories = await subCategoryModel.find({catId:categoryId})

        return res.status(200).json({
            status: true,
            subcategories: subcategories,
          
        })

    } catch (error) {
        return res.status(200).json({
            status: false,
            msg: error,

        })
    }

})

router.post('/sub-category-data', async (req, res, next) => {
    try {
        const { subCatId } = req.body;

        const DataRes = await subCategoryModel.findOne({ subCatId: subCatId });

        if (DataRes) {
            return res.status(200).json({
                status: true,
                DataRes: DataRes,
            });
        } else {
            return res.status(404).json({
                status: false,
                msg: 'data not found',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            status: false,
            msg: error.message,
        });
    }
});


// category end


// products
router.post('/products-list', async (req, res, next) => {

    try {
        const { limit, page,catId } = req.body;
        const skip = (page - 1) * limit;
        let AllData = null
        if (page == 1) {
            AllData = await ProductsModel.countDocuments()
        }

        const ListData = await ProductsModel.find().sort({ _id: -1,isActive:true }).skip(skip).limit(limit)

        return res.status(200).json({
            status: true,
            ListData: ListData,
            AllData: AllData

        })

    } catch (error) {
        return res.status(200).json({
            status: false,
            msg: error,

        })
    }

})

router.post('/product-data', async (req, res, next) => {
    try {
        const { slug } = req.body;

        const DataRes = await ProductsModel.findOne({ slug: slug });

        if (DataRes) {
            return res.status(200).json({
                status: true,
                DataRes: DataRes,
            });
        } else {
            return res.status(404).json({
                status: false,
                msg: 'data not found',
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            status: false,
            msg: error.message,
        });
    }
});


router.post('/products-list-by-subcat', async (req, res, next) => {

    try {
        const { limit, page,subCatId } = req.body;
        const skip = (page - 1) * limit;
        let AllData = null
        if (page == 1) {
            AllData = await ProductsModel.countDocuments({subCatId:subCatId})
        }

        const ListData = await ProductsModel.find({subCatId:subCatId}).sort({ _id: -1 }).skip(skip).limit(limit)
        // const ListData = await ProductsModel.find({subCatId:subCatId,isActive:true}).sort({ _id: -1 }).skip(skip).limit(limit)

        return res.status(200).json({
            status: true,
            ListData: ListData,
            AllData: AllData

        })

    } catch (error) {
        return res.status(200).json({
            status: false,
            msg: error,

        })
    }

})



// products end






module.exports = router;