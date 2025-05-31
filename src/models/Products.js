
const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    slug: {
        type: String,
        required: true,
        unique: true

    },
    catId: {
        type: String,
        required: true,
    },
    subCatId: {
        type: String,

    },
    image: {
        type: String,
        required: true,
    },
    hoverImage: {
        type: String,
        required: true,

    },
    additionalImages: {
        type: Object,


    },
    additional_img_cap_1: { type: String, default: "" },
    additional_img_cap_2: { type: String, default: "" },
    additional_img_cap_3: { type: String, default: "" },
    additional_img_cap_4: { type: String, default: "" },
    additional_img_cap_5: { type: String, default: "" },

    bannerImage: {
        type: String,
        required: true,
        default: "",
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Object,
        required: true,
    },
    discount: {
        type: Object,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    shortDescription: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Object,
        required: true,
    },
    availability: {
        type: Boolean,
        required: true,
    },

})

module.exports = mongoose.model('Products', ProductsSchema);