const express = require('express')
const jwt = require('jsonwebtoken')
// const multer = require("multer");
const upload = require("../Utils/Uploadfile"); // Ensure correct path
const cloudinary = require("../Utils/cloudinary");
require('dotenv').config();

const ProductsModel = require('../models/Products');
const CategoryModel = require('../models/Category');
const subCategoryModel = require('../models/subCategory');

const AdminUserModel = require('../models/AdminUser');
const verifyTokens = require('../Utils/verifyTokens');

const SharedFunctionsUtils = require('../Utils/SharedFunctions');
// const storage = multer.memoryStorage();
// const upload = require("../Utils/Uploadfile");
const router = express.Router();
const mongoose = require("mongoose");

router.post('/rm-data', async (req, res, next) => {
    const { collectionName } = req.body;

    try {
        if (!collectionName) {
            return res.status(400).json({
                success: false,
                message: 'Collection name is required',
            });
        }

        const model = mongoose.model(collectionName);
        const result = await model.deleteMany({});

        return res.status(200).json({
            success: true,
            message: 'All data deleted successfully',
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while deleting',
            error: error.message,
        });
    }
});


// Upload Files
router.post("/image-upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file provided" });
        }
        console.log("Uploading to Cloudinary:", req.file.path);

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "whitelight_categories",
            use_filename: true,
            unique_filename: false,
        });

        return res.status(200).json({
            message: "Image uploaded successfully",
            secure_url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return res.status(500).json({
            error: "Cloudinary upload failed",
            details: error.message,
        });
    }
});

// Login

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const users = await AdminUserModel.findOne({
            email: email,
        });

        if (!users) {
            return res.status(200).json({
                msg: 'email is not registered with us.',
            });
        } else {

            const DecodePassKey = await SharedFunctionsUtils.DecodePassKey({
                PassKey: password,
                PassKeyDb: users.password,
            });


            if (!DecodePassKey) {
                return res.status(200).json({
                    status: false,
                    msg: "Invalid credentials. Unable to verify password."
                });
            } else {

                const ud = await SharedFunctionsUtils.getUserDataByUsername({
                    username: users.username,
                });

                const userData = ud.userData;
                jwt.sign({ userData }, process.env.SecretKey, { expiresIn: '7d' }, (err, token) => {
                    if (err) {
                        return res.status(200).json({
                            status: false,
                            msg: "Error generating token."
                        });
                    }
                    return res.status(200).json({
                        status: true,
                        message: "Successfully logged in.",
                        token: token,
                        user: userData
                    });
                });
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(200).json({
            error: error.message || "An unexpected error occurred."
        });
    }
});
router.post('/add-admin', async (req, res, next) => {
    try {

        const { name, email, password } = req.body;
        const users = await AdminUserModel.findOne({
            email: email,
        });
        if (users) {
            return res.status(200).json({
                status: false,
                msg: 'email already in use',
            });
        } else {

            const username = await SharedFunctionsUtils.extractUsernameFromEmail({
                email: email,
            });
            const GenratePassKey = await SharedFunctionsUtils.GenratePassKey({
                PassKey: password,
            });

            if (!GenratePassKey) {
                return res.status(200).json({
                    status: false,
                    msg: "unambe to craete hash password."
                });
            } else {

                const createdAt = {
                    date: SharedFunctionsUtils.getFormattedDate(),
                    time: SharedFunctionsUtils.getFormattedTime(),
                }

                const AddData = new AdminUserModel({
                    _id: new mongoose.Types.ObjectId,
                    name: name,
                    email: email,
                    username: username,
                    password: GenratePassKey,
                    description: req.body.description,
                    createdAt: createdAt,
                    isActive: true,

                });

                const AddedData = await AddData.save()

                if (AddedData) {
                    return res.status(200).json({
                        status: true,
                        msg: `Data Created`,
                        Data: AddedData
                    })
                } else {
                    return res.status(200).json({
                        status: false,
                        msg: "Something Went Wrong",

                    })
                }



            }
        }

    } catch (error) {
        console.log(error);
        return res.status(200).json({
            error: error.message || "An unexpected error occurred."
        });
    }
});

router.post('/check-auth', verifyTokens, async (req, res, next) => {
    try {

        res.status(200).json({
            status: true,
            userData: req.user,
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            status: false,
            error: error
        })

    }
})


// category 


router.post('/add-category', verifyTokens, async (req, res, next) => {

    try {

        const createdAt = {
            date: SharedFunctionsUtils.getFormattedDate(),
            time: SharedFunctionsUtils.getFormattedTime(),
        }
        const Sid = await SharedFunctionsUtils.generateShortId()
        const Makeslug = await SharedFunctionsUtils.slugifyData(req.body.title)
        const catId = `${Makeslug}-${Sid}`
        const AddData = new CategoryModel({
            _id: new mongoose.Types.ObjectId,
            catId: catId,
            image: req.body.image,
            title: req.body.title,
            description: req.body.description,
            createdAt: createdAt,
            isActive: req.body.isActive,

        });

        const AddedData = await AddData.save()

        if (AddedData) {
            return res.status(200).json({
                status: true,
                msg: `Data Created`,
                Data: AddedData
            })
        } else {
            return res.status(200).json({
                status: false,
                msg: "Something Went Wrong",

            })
        }

    } catch (error) {
        console.log(error)
        return res.status(200).json({
            status: false,
            msg: error,

        })

    }

})
router.post('/category-list', verifyTokens, async (req, res, next) => {
    try {
        const { limit, page } = req.body;

        if (!limit || !page) {
            return res.status(400).json({
                status: false,
                msg: "Please provide both limit and page values.",
            });
        }

        const skip = (page - 1) * limit;
        let AllData = null;

        // Get the total count of categories if page is 1
        if (page == 1) {
            AllData = await CategoryModel.countDocuments();
        }

        // Fetch categories along with the subcategory count using aggregation
        const ListData = await CategoryModel.aggregate([
            {
                $sort: { _id: -1 } // Sorting categories by ID in descending order
            },
            {
                $skip: skip // Skipping documents for pagination
            },
            {
                $limit: limit // Limiting the number of documents
            },
            {
                $lookup: {
                    from: 'subcategories', // Assuming subcategory collection is called 'subcategories'
                    localField: 'catId',
                    foreignField: 'catId',
                    as: 'subcategories'
                }
            },
            {
                $addFields: {
                    subcategoryCount: { $size: '$subcategories' }
                }
            },
            {
                $project: {
                    subcategories: 0 // Hide subcategories array, just showing count
                }
            }
        ]);

        return res.status(200).json({
            status: true,
            ListData: ListData,
            AllData: AllData,
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            msg: error.message,
        });
    }
});

router.post('/category-list-all', verifyTokens, async (req, res, next) => {
    try {
        const categories = await CategoryModel.find();

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


router.post('/edit-category', verifyTokens, async (req, res, next) => {
    try {

        const { catId, image, title, description, isActive } = req.body

        const updatedData = {
            image: image,
            title: title,
            description: description,
            isActive: isActive,

        };

        const result = await CategoryModel.findOneAndUpdate(
            { catId: catId },
            { $set: updatedData },
            { new: true }
        );

        if (result) {
            return res.status(200).json({
                status: true,
                msg: 'Updated successfully',
                Data: result,
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
router.post('/delete-category', verifyTokens, async (req, res, next) => {
    try {
        const catId = req.body.catId;

        // Delete category from CategoryModel
        const result = await CategoryModel.findOneAndDelete({ catId: catId });

        if (result) {
            // Delete all related subcategories from subCategoryModel
            const subCategoryResult = await subCategoryModel.deleteMany({ catId: catId });

            return res.status(200).json({
                status: true,
                msg: 'Category and related subcategories deleted successfully',
                deletedSubCategoriesCount: subCategoryResult.deletedCount,
            });
        } else {
            return res.status(404).json({
                status: false,
                msg: 'Category not found',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            msg: 'An error occurred',
            error: error.message,
        });
    }
});


router.post('/category-data', verifyTokens, async (req, res, next) => {
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


router.post('/add-sub-category', verifyTokens, async (req, res, next) => {

    try {

        const createdAt = {
            date: SharedFunctionsUtils.getFormattedDate(),
            time: SharedFunctionsUtils.getFormattedTime(),
        }
        const Sid = await SharedFunctionsUtils.generateShortId()
        const Makeslug = await SharedFunctionsUtils.slugifyData(req.body.title)
        const subCatId = `${Makeslug}-${Sid}`
        const AddData = new subCategoryModel({
            _id: new mongoose.Types.ObjectId,
            catId: req.body.catId,
            subCatId: subCatId,
            image: req.body.image,
            title: req.body.title,
            description: req.body.description,
            createdAt: createdAt,
            isActive: req.body.isActive,

        });

        const AddedData = await AddData.save()

        if (AddedData) {
            return res.status(200).json({
                status: true,
                msg: `Data Created`,
                Data: AddedData
            })
        } else {
            return res.status(200).json({
                status: false,
                msg: "Something Went Wrong",

            })
        }

    } catch (error) {
        console.log(error)
        return res.status(200).json({
            status: false,
            msg: error,

        })

    }

})

router.post('/sub-category-list', verifyTokens, async (req, res, next) => {

    try {
        const { limit, page, catId } = req.body;
        const skip = (page - 1) * limit;
        let AllData = null
        if (page == 1) {
            AllData = await subCategoryModel.countDocuments({ catId: catId })
        }

        const ListData = await subCategoryModel.find({ catId: catId }).sort({ _id: -1 }).skip(skip).limit(limit)

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

router.post('/sub-category-list-all', verifyTokens, async (req, res, next) => {

    try {
        const { categoryId } = req.body;


        const subcategories = await subCategoryModel.find({ catId: categoryId })

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

router.post('/sub-category-data', verifyTokens, async (req, res, next) => {
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
router.post('/edit-sub-category', verifyTokens, async (req, res, next) => {
    try {

        const { subCatId, image, title, description, isActive } = req.body

        const updatedData = {
            image: image,
            title: title,
            description: description,
            isActive: isActive,

        };

        const result = await subCategoryModel.findOneAndUpdate(
            { subCatId: subCatId },
            { $set: updatedData },
            { new: true }
        );

        if (result) {
            return res.status(200).json({
                status: true,
                msg: 'updated successfully',
                Data: result,
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


router.post('/delete-sub-category', verifyTokens, async (req, res, next) => {
    try {
        const { subCatId } = req.body;

        const result = await subCategoryModel.findOneAndDelete({ subCatId: subCatId });

        if (result) {
            return res.status(200).json({
                status: true,
                msg: 'deleted successfully',
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
router.post('/products-list', verifyTokens, async (req, res, next) => {

    try {
        const { limit, page, catId } = req.body;
        const skip = (page - 1) * limit;
        let AllData = null
        if (page == 1) {
            AllData = await ProductsModel.countDocuments()
        }

        const ListData = await ProductsModel.find().sort({ _id: -1 }).skip(skip).limit(limit)

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

router.post('/add-product', verifyTokens, async (req, res, next) => {
    try {
        const {
            name,
            price,
            discount,
            shortDescription,
            description,
            image,
            hoverImage,
            availability,
            subcategory,
            category,
            additionalImages,
            additional_img_cap_1,
            additional_img_cap_2,
            additional_img_cap_3,
            additional_img_cap_4,
            additional_img_cap_5,
            bannerImage,
            pdfFile
        } = req.body;

        // Format creation date and time
        const createdAt = {
            date: SharedFunctionsUtils.getFormattedDate(),
            time: SharedFunctionsUtils.getFormattedTime(),
        };

        // Generate unique product ID and slug
        const Sid = await SharedFunctionsUtils.generateShortId();
        const Makeslug = await SharedFunctionsUtils.slugifyData(name);
        const slug = `${Makeslug}-${Sid}`;

        // Create a new product data object
        const AddData = new ProductsModel({
            _id: new mongoose.Types.ObjectId(),
            slug: slug,
            catId: category,
            subCatId: subcategory,
            image: image,
            hoverImage: hoverImage,
            additionalImages: additionalImages,
            title: name,
            price: price,
            discount: discount,
            shortDescription: shortDescription,
            description: description,
            availability: availability,
            createdAt: createdAt,
            additional_img_cap_1: additional_img_cap_1,
            additional_img_cap_2: additional_img_cap_2,
            additional_img_cap_3: additional_img_cap_3,
            additional_img_cap_4: additional_img_cap_4,
            additional_img_cap_5: additional_img_cap_5,
            pdfFile:pdfFile,
            bannerImage: bannerImage, // Default to empty string if not provided

        });

        // Save product to the database
        const AddedData = await AddData.save();

        // If successfully added, return a success response
        if (AddedData) {
            return res.status(200).json({
                status: true,
                msg: `Product Created Successfully`,
                Data: AddedData,
            });
        } else {
            return res.status(400).json({
                status: false,
                msg: "Something Went Wrong",
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            msg: "Server Error: " + error.message,
        });
    }
});

router.post('/product-data', verifyTokens, async (req, res, next) => {
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

router.post('/edit-product', verifyTokens, async (req, res, next) => {
    try {

        const { slug, name, price, discount, shortDescription, description, image, hoverImage, availability, category, subcategory, additionalImages, additional_img_cap_1, additional_img_cap_2, additional_img_cap_3, additional_img_cap_4, additional_img_cap_5, bannerImage } = req.body



        const updatedData = {

            title: name,
            price: price,
            discount: discount,
            shortDescription: shortDescription,
            description: description,
            image: image,
            hoverImage: hoverImage,
            availability: availability,
            category: category,
            subcategory: subcategory || null,
            additionalImages: additionalImages,
            additional_img_cap_1: additional_img_cap_1,
            additional_img_cap_2: additional_img_cap_2,
            additional_img_cap_3: additional_img_cap_3,
            additional_img_cap_4: additional_img_cap_4,
            additional_img_cap_5: additional_img_cap_5,
            pdfFile:pdfFile,
            bannerImage: bannerImage

        };

        const result = await ProductsModel.findOneAndUpdate(
            { slug: slug },
            { $set: updatedData },
            { new: true }
        );

        if (result) {
            return res.status(200).json({
                status: true,
                msg: 'updated successfully',
                Data: result,
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

router.post('/delete-product', verifyTokens, async (req, res, next) => {
    try {
        const { slug } = req.body;

        const result = await ProductsModel.findOneAndDelete({ slug: slug });

        if (result) {
            return res.status(200).json({
                status: true,
                msg: 'deleted successfully',
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



// products end



router.post('/db-counter', verifyTokens, async (req, res, next) => {
    try {
        const products = await ProductsModel.countDocuments()
        const categories = await CategoryModel.countDocuments()
        const subcategories = await subCategoryModel.countDocuments()


        return res.status(200).json({
            status: true,
            products: products,
            categories: categories,
            subcategories: subcategories,

        })

    } catch (error) {
        return res.status(200).json({
            status: false,
            msg: error,

        })
    }

})

router.post('/update-products-with-captions', async (req, res) => {
    try {
        // Define default values for new caption fields
        const defaultCaptions = {
            additional_img_cap_1: "",
            additional_img_cap_2: "",
            additional_img_cap_3: "",
            additional_img_cap_4: "",
            additional_img_cap_5: ""
        };

        // Update all products that don't have these caption fields
        const result = await ProductsModel.updateMany(
            {
                $or: [
                    { additional_img_cap_1: { $exists: false } },
                    { additional_img_cap_2: { $exists: false } },
                    { additional_img_cap_3: { $exists: false } },
                    { additional_img_cap_4: { $exists: false } },
                    { additional_img_cap_5: { $exists: false } }
                ]
            },
            { $set: defaultCaptions } // Set default values
        );

        return res.status(200).json({
            status: true,
            msg: 'All products updated with new caption fields',
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        console.error("Error updating products:", error);
        return res.status(500).json({
            status: false,
            msg: 'Server error while updating products',
            error: error.message
        });
    }
});

router.post('/add-banner-image-field', async (req, res) => {
    try {
        // Default value for bannerImage (adjust if needed)
        const defaultBannerImage = "";

        // Update all products where bannerImage does not exist
        const result = await ProductsModel.updateMany(
            { bannerImage: { $exists: false } },
            { $set: { bannerImage: defaultBannerImage } }
        );

        return res.status(200).json({
            status: true,
            msg: `${result.modifiedCount} products updated with bannerImage field.`,
        });
    } catch (error) {
        console.error("Error updating bannerImage field:", error);
        return res.status(500).json({
            status: false,
            msg: 'Server error while updating products.',
        });
    }
});


module.exports = router;