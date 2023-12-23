const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { MALE, FEMALE, DOCTOR, USER } = require('../utils/constants');
const hashIt = require('../utils/hashIt');

const doctorSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId, // Use the ObjectId constructor as the default value
      unique: true
    },
    name: {
      type: String,
      required: [true, 'Please tell us your name!']
    },
    fullArName: String,
    fullEnName: String,
    experienceYears: Number,
    // 1 for male 2 for female
    gender: {
      type: Number,
      enum: [MALE, FEMALE]
    },
    // country is any number betwen 1 and 242
    country: Number,
    // languages is array from 257 or 258 or 259 or 260 or 261 or 262 or 263 or 264 or 265 or 266 or 267 or 268 or
    languages: [Number],
    // prefix is one of 'Dr', 'PsyD', 'Prof', 'MBPsS', 'Mr', 'Mrs', 'Ms'
    prefix: Number,
    sessions: Number,
    nReviews: {
      type: Number,
      default: 0
    },
    avgReviews: {
      type: Number,
      min: [0.0, 'min avrage reviews is 0.0'],
      max: [5.0, 'max avrage reviews is 5.0'],
      default: 3.5
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    address: String,
    ar_address: String,
    phone: String,
    // photo should be in base64 image you can add and doctor image randomly
    photo: {
      type: String
      // get(photo) {
      //   if (photo && photo.includs('http:')) {
      //     const url = `data:image/jpeg;base64,${photo}`;
      //     return url;
      //   }
      // }
    },
    // role is 1 for user and 2 for doctor
    role: {
      type: Number,
      enum: [USER, DOCTOR],
      default: DOCTOR
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false
    },
    birthDate: Date,
    cv: {
      type: String
      // get(cv) {
      //   if (cv) {
      //     const url = `data:image/jpeg;base64,${cv}`;
      //     return url;
      //   }
      // }
    },
    certifications: [
      {
        title: String,
        ar_title: String,
        place: String,
        ar_place: String,
        time: [Date]
      }
    ],
    educations: [
      {
        title: String,
        ar_title: String,
        ar_place: String,
        place: String,
        time: [Date]
      }
    ],
    experiences: [
      {
        title: String,
        ar_title: String,
        description: String,
        ar_description: String,
        company_logo: String,
        time: [Date]
      }
    ],
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },
    //specialization is array from  1 or 2 or 3 or 4 or 8 or 9 or 10 or 11 or 12 or 13 or 14
    specialization: [Number],
    feez: [{ amount: Number, duration: Number }],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    verified: {
      type: Boolean,
      default: false
    },
    isOnline: {
      type: Boolean,
      default: false
    },
    verificationHash: String
  },
  {
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true },
    timestamps: true
  }
);

doctorSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

doctorSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

doctorSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

doctorSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

doctorSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

doctorSchema.methods.createVerificationCode = function() {
  const verificationCode = crypto.randomBytes(32).toString('hex');
  this.verificationHash = crypto
    .createHash('sha256')
    .update(verificationCode)
    .digest('hex');
  return verificationCode;
};

doctorSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = hashIt(resetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

doctorSchema.virtual('slots', {
  ref: 'Slot',
  localField: '_id',
  foreignField: 'doctor'
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
