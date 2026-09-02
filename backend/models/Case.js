import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalText: { type: String, required: true },
    englishText: { type: String, required: true },

    classification: {
      predictedType: String,
      confidence: Number,
    },
    entities: {
      amounts: [String],
      dates: [String],
      upiIds: [String],
      phoneNumbers: [String],
      transactionRefs: [String],
    },
    legalInfo: {
      sections: [String],
      urgency: String,
      evidence: [String],
      guidance: String,
    },

    status: {
      type: String,
      enum: ["Filed", "Under Review", "Resolved", "Rejected"],
      default: "Filed",
    },
    adminNote: { type: String, default: "" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    evidencePhotos: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Case", caseSchema);
