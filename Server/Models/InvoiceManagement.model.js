var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Invoice Management Schema
var InvoiceSchema = mongoose.Schema({
   Seller: { type: Schema.Types.ObjectId, ref: 'Customers' },
   Business:{ type: Schema.Types.ObjectId, ref: 'Business' },
   // Branch: { type: Schema.Types.ObjectId, ref: 'Branch' },
   Buyer: { type: Schema.Types.ObjectId, ref: 'Customers' },
   BuyerBusiness:{ type: Schema.Types.ObjectId, ref: 'Business' },
   // BuyerBranch: { type: Schema.Types.ObjectId, ref: 'Branch' },
   InvoiceNumber: { type: String },
   InvoiceDate : { type: Date },
   InvoiceDueDate : { type: Date },
   ApprovedDate : { type: Date },
   IfBuyerApprove: { type: Boolean },
   IfBuyerNotify: { type: Boolean },   
   InvoiceStatus: { type: String }, // Pending, Disputed, Partial, Closed, Accept
	InvoiceAmount: { type: Number },
	PaidAmount: { type: Number },
   RemainingAmount: { type: Number },
	InProgressAmount: { type: Number },
   ChartAmount: { type: Number }, //Tracking Invoices After Paid 
   CurrentCreditAmount: { type: Number},
   UsedCurrentCreditAmount: { type: Number },
   PaidCurrentCreditAmount: { type: Number },
	IfUsedTemporaryCredit: { type: Boolean },
   IfUsedPaidTemporaryCredit: { type: Boolean },
   TemporaryRequestId: { type: String },
   TemporaryCreditAmount: { type: Number },
   UsedTemporaryCreditAmount: { type: Number },
   PaidTemporaryCreditAmount: { type: Number },
   InvoiceDescription: { type: String },
   Remarks: { type: String },
	DisputedParentID: { type: Schema.Types.ObjectId, ref: 'Invoice' },
   DisputedRemarks: { type: String },
   ResendRemarks: { type: String },
   AcceptRemarks: { type: String },
   PaidORUnpaid: { type: String },
   StatusType: { type: String }, //cleared,uncleared
   PaymentStatus: { type: String }, // WaitForPayment, PartialPayment, PaymentCompleted
   
   InvoiceAttachments: [{
      fileName: { type: String },
      fileType: { type: String }
   }],
   ActiveStatus: { type: Boolean},
   IfDeleted: { type: Boolean}
}, { timestamps: true });
var VarInvoiceSchema = mongoose.model('Invoice', InvoiceSchema, 'Invoice');

// Base64 schema
var Base64Schema = mongoose.Schema({
   Base64: { type: String },
   Active_Status: { type: Boolean, required: true },
   If_Deleted: { type: Boolean, required: true },
},
{ timestamps: true }
);

var VarBase64Schema = mongoose.model('All_Base64', Base64Schema, 'All_Base64');

module.exports = {
   InvoiceSchema: VarInvoiceSchema,
   Base64Schema: VarBase64Schema
};