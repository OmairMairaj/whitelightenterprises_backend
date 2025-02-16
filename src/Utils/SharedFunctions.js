const slugify = require('slugify');
// const fast2sms = require('fast-two-sms')
const AdminUserModel = require('../models/AdminUser');
const bcrypt = require('bcrypt');
const shortid = require('shortid');

require('dotenv').config();

function extractUsernameFromEmail({ email }) {
    if (typeof email !== 'string') {
        throw new Error('Email must be a string');
    }
    const parts = email.split('@');
    const username = parts[0];
    return slugify(username, { lower: true });
}

const getUserDataByUsername = async ({ username }) => {
    try {

        const userData = await AdminUserModel.findOne({ username: username }).select('-password');
        return {
            userData
        };
    } catch (error) {
        return {
            error: 'Something went wrong',

        };
    }
};



function transformString(input) {
    return input.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}
function getDateFromISOString(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function generateShortId() {
    const id = shortid.generate();
    const ID = transformString(id);
    return ID;
}

function generateOrderId(minLength = 8) {
    const id = shortid.generate().replace(/[^a-zA-Z0-9]/g, '');
    const randomNumber = Math.floor(Math.random() * Math.pow(10, minLength)).toString();
    const combinedID = `${id}${randomNumber}`.toUpperCase();
    return combinedID.length >= minLength ? combinedID.slice(0, minLength) : combinedID.padEnd(minLength, '0');
}


// Function to get the formatted date in Indian time zone
function getFormattedDate() {
    const date = new Date();
    const options = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };
    const [day, month, year] = date.toLocaleDateString('en-IN', options).split('/');
    return `${day}-${month}-${year}`;
}

// Function to get the formatted time in Indian time zone
function getFormattedTime() {
    const date = new Date();
    const options = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };
    return date.toLocaleTimeString('en-IN', options);
}
function ConverDateIN(e) {
    const date = new Date(e);
    const options = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };
    const [day, month, year] = date.toLocaleDateString('en-IN', options).split('/');
    return `${day}-${month}-${year}`;
}
function ValidtyDateMaker(Validity) {
    const aajKiDate = new Date();
    const numberOfDaysToAdd = parseInt(Validity);
    const futureDate = new Date(aajKiDate);
    futureDate.setDate(aajKiDate.getDate() + numberOfDaysToAdd);

    // Use padStart to ensure that single-digit day and month have leading zeros
    const formattedFutureDate = `${futureDate.getDate().toString().padStart(2, '0')}-${(futureDate.getMonth() + 1).toString().padStart(2, '0')}-${futureDate.getFullYear()}`;
    console.log(formattedFutureDate)
    return formattedFutureDate


}
function CDataChecker(CData) {
    return CData;
}


function Genrateadminuserid(data) {
    return slugify(data, { lower: true });
}
function slugifyData(data) {
    return slugify(data, { lower: true });
}


const sendOTP = async ({ Mobile, OTP }) => {

    const mes = OTP;
    var options = { authorization: process.env.FastSMSkey, message: mes, numbers: [Mobile] }
    // const SendSMS = await fast2sms.sendMessage(options)
    console.log(OTP)

    // if (SendSMS) {
    //     return SendSMS
    // } else {
    //     return false
    // }
    return false;
};

const GenratePassKey = async ({ PassKey }) => {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password using the generated salt
        const hashedPassword = await bcrypt.hash(PassKey, salt);


        return hashedPassword;
    } catch (error) {
        return false

    }
};
const DecodePassKey = async ({ PassKey, PassKeyDb }) => {

    try {
        const salt = await bcrypt.genSalt(10);
        const match = await bcrypt.compare(PassKey, PassKeyDb);

        if (match) {
            return match;
        } else {
            return false;
        }
    } catch (error) {
        return false

    }
};
const getRandomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const convertMetersToKilometers = (meters) => {
    return meters / 1000;
};

const SendOtpUser = async ({ Mobile }) => {


    let OTPVAl = Math.floor(100000 + Math.random() * 900000)
    let mes = OTPVAl;

    if (Mobile) {

        var options = { authorization: process.env.FastSMSkey, message: mes, numbers: [Mobile] }
        // const SendSMS = await fast2sms.sendMessage(options)
        // console.log(SendSMS)

        // if (SendSMS.return == true) {
        //     try {
        //         const data = {
        //             otp: OTPVAl,
        //         };
        //         const updateOtp = await AdminUserModel.findOneAndUpdate(
        //             { mobile: Mobile },
        //             data,
        //             { new: true }
        //         );
        //         if (updateOtp) {
        //             return true
        //         } else {
        //             return false
        //         }

        //     } catch (error) {
        //         console.error(error)
        //         return false
        //     }

        // } else {
        //     return false
        // }
        return false;

    } else {
        return false
    }

};


const calculateDistance = (lat1, lon1, lat2, lon2) => {
    try {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180; // Convert degrees to radians
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    } catch (error) {
        console.error(error)
        return false;

    }
};

const SlotLists = async (date) => {
    try {
        const FinalDate = getDateFromISOString(date);

        const ListData = await AppointmentSlotModel.find().sort({ _id: -1 });

        const ordersOnDate = await ServicesOrdersModel.find({
            'OrderData.bookingDate': FinalDate,
            OrderStatus: { $nin: [0, 3] }
        });


        const SLists = {};
        ordersOnDate.forEach(order => {
            const slotId = order.OrderData.slotId;
            SLists[slotId] = false;

        });

        // Append availability status to each slot in ListData
        const updatedListData = ListData.map(slot => {
            const isAvailable = SLists[slot.slotId.toString()] !== false;
            return {
                ...slot.toObject(),
                availability: isAvailable
            };
        });

        return {
            success: true,
            data: updatedListData,

        };

    } catch (error) {
        console.log(error)
        return {
            success: false,
            data: null,
            error: error.message || "An error occurred while fetching slot availability."
        };
    }
};
const slotAvailability = async ({ slotId, date }) => {

    try {
        const FinalDate = getDateFromISOString(date);

        const ordersOnDate = await ServicesOrdersModel.countDocuments({
            'OrderData.bookingDate': FinalDate,
            'OrderData.slotId': slotId,
            OrderStatus: { $in: [1, 2] }
        });
        let isAvailable = false
        if (ordersOnDate == 0) {
            isAvailable = true
        }
        return {
            isAvailable
        };

    } catch (error) {
        console.log(error)
        return {
            success: false,
            data: null,
            error: error.message || "An error occurred while fetching slot availability."
        };
    }
};

module.exports = {
    getFormattedDate,
    getFormattedTime,
    ConverDateIN,
    ValidtyDateMaker,
    CDataChecker,
    Genrateadminuserid,
    sendOTP,
    SendOtpUser,
    GenratePassKey,
    DecodePassKey,
    getRandomNumberBetween,
    convertMetersToKilometers,
    calculateDistance,
    slugifyData,
    generateShortId,

    getUserDataByUsername,
    generateOrderId,
    getDateFromISOString,
    SlotLists,
    slotAvailability,
    extractUsernameFromEmail
};