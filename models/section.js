const mongoose = require('mongoose');

const section80CSchema = new mongoose.Schema({
    subSectionCode: { type: Number, required: true },
    subSection: { type: String, required: true },
    limitValue: { type: Number },
    taxExemption: { type: Number },
});

const section80DSchema = new mongoose.Schema({
    subSectionCode: { type: Number, required: true },
    subSection: { type: String, required: true },
    limitValue: { type: Number, required: true },
    taxExemption: { type: Number, required: true },
});
const section10Schema = new mongoose.Schema({
    subSectionCode: { type: String, required: true },
    subSection: { type: String, required: true },
    limitValue: { type: String, required: true },
    taxExemption: { type: Number },
});
const section24Schema = new mongoose.Schema({
    subSectionCode: { type: String, required: true },
    subSection: { type: String, required: true },
    limitValue: { type: Number, required: true },
    taxExemption: { type: Number },
});
const section80CCDSchema = new mongoose.Schema({
    subSectionCode: { type: String, required: true },
    subSection: { type: String, required: true },
    limitValue: { type: Number, required: true },
    taxExemption: { type: Number },
});

const Section80C = mongoose.model('Section80C', section80CSchema);
const Section80D = mongoose.model('Section80D', section80DSchema);
const Section10 = mongoose.model('Section10', section10Schema);
const Section24 = mongoose.model('Section24', section24Schema);
const Section80CCD = mongoose.model('Section80CCD', section80CCDSchema);

module.exports = { Section80C, Section80D, Section10, Section24, Section80CCD };
