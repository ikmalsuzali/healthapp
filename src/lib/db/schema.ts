import { relations } from "drizzle-orm"
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
)

// Health App specific tables
export const profiles = pgTable("profile", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  dateOfBirth: timestamp("date_of_birth", { mode: "date" }),
  gender: text("gender"),
  height: integer("height"), // in cm
  weight: integer("weight"), // in kg
  activityLevel: text("activity_level"),
  medicalConditions: text("medical_conditions"),
  allergies: text("allergies"),
  medications: text("medications"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

// Health Map Assessment Tables
export const assessments = pgTable("assessment", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  version: text("version").notNull().default("1.0"),
  isActive: integer("is_active").notNull().default(1), // 1 = active, 0 = inactive
  freeResultsLimit: integer("free_results_limit").default(3), // Number of free insights
  paidReportPrice: integer("paid_report_price"), // Price in cents
  estimatedDuration: integer("estimated_duration"), // Duration in minutes
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const healthDimensions = pgTable("health_dimension", {
  id: text("id").notNull().primaryKey(),
  assessmentId: text("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  displayOrder: integer("display_order").notNull(),
  color: text("color"), // For visual representation
  icon: text("icon"), // Icon identifier
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const assessmentQuestions = pgTable("assessment_question", {
  id: text("id").notNull().primaryKey(),
  assessmentId: text("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  dimensionId: text("dimension_id").references(() => healthDimensions.id, {
    onDelete: "set null",
  }),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").notNull(), // 'multiple_choice', 'scale', 'boolean'
  displayOrder: integer("display_order").notNull(),
  isRequired: integer("is_required").notNull().default(1),
  weight: integer("weight").default(1), // Question importance weight
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const questionOptions = pgTable("question_option", {
  id: text("id").notNull().primaryKey(),
  questionId: text("question_id")
    .notNull()
    .references(() => assessmentQuestions.id, { onDelete: "cascade" }),
  optionText: text("option_text").notNull(),
  optionValue: integer("option_value").notNull(), // Numeric value for scoring
  displayOrder: integer("display_order").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const userAssessments = pgTable("user_assessment", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  assessmentId: text("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  organizationTrackingId: text("organization_tracking_id").references(
    () => organizationTracking.id,
    { onDelete: "set null" },
  ),
  status: text("status").notNull().default("in_progress"), // 'in_progress', 'completed', 'abandoned'
  startedAt: timestamp("started_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  completedAt: timestamp("completed_at", { mode: "date", withTimezone: true }),
  totalScore: integer("total_score"),
  percentageComplete: integer("percentage_complete").default(0),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const userResponses = pgTable("user_response", {
  id: text("id").notNull().primaryKey(),
  userAssessmentId: text("user_assessment_id")
    .notNull()
    .references(() => userAssessments.id, { onDelete: "cascade" }),
  questionId: text("question_id")
    .notNull()
    .references(() => assessmentQuestions.id, { onDelete: "cascade" }),
  optionId: text("option_id").references(() => questionOptions.id, {
    onDelete: "set null",
  }),
  responseValue: integer("response_value"), // For scale/numeric responses
  responseText: text("response_text"), // For text responses
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const assessmentResults = pgTable("assessment_result", {
  id: text("id").notNull().primaryKey(),
  userAssessmentId: text("user_assessment_id")
    .notNull()
    .references(() => userAssessments.id, { onDelete: "cascade" }),
  dimensionId: text("dimension_id")
    .notNull()
    .references(() => healthDimensions.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  percentageScore: integer("percentage_score").notNull(),
  level: text("level"), // 'low', 'medium', 'high', etc.
  interpretation: text("interpretation"), // AI-generated or predefined interpretation
  recommendations: text("recommendations"), // Suggestions for improvement
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const reports = pgTable("report", {
  id: text("id").notNull().primaryKey(),
  userAssessmentId: text("user_assessment_id")
    .notNull()
    .references(() => userAssessments.id, { onDelete: "cascade" }),
  reportType: text("report_type").notNull(), // 'free', 'paid', 'organizational'
  reportData: text("report_data").notNull(), // JSON string with full report data
  reportUrl: text("report_url"), // URL to generated PDF report
  isGenerated: integer("is_generated").notNull().default(0),
  generatedAt: timestamp("generated_at", { mode: "date", withTimezone: true }),
  deliveryMethod: text("delivery_method"), // 'email', 'whatsapp', 'download'
  deliveredAt: timestamp("delivered_at", { mode: "date", withTimezone: true }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const purchases = pgTable("purchase", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  userAssessmentId: text("user_assessment_id").references(
    () => userAssessments.id,
    { onDelete: "set null" },
  ),
  discountCodeId: text("discount_code_id").references(() => discountCodes.id, {
    onDelete: "set null",
  }),
  productType: text("product_type").notNull(), // 'full_report', 'organizational_package'
  originalPrice: integer("original_price").notNull(), // Price in cents
  discountAmount: integer("discount_amount").default(0),
  finalPrice: integer("final_price").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"), // 'pending', 'completed', 'failed', 'refunded'
  paymentProvider: text("payment_provider"), // 'stripe', 'paypal', etc.
  paymentId: text("payment_id"), // External payment reference
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const discountCodes = pgTable("discount_code", {
  id: text("id").notNull().primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
  discountType: text("discount_type").notNull(), // 'percentage', 'fixed'
  discountValue: integer("discount_value").notNull(), // Percentage or cents
  maxUses: integer("max_uses"), // Null for unlimited
  currentUses: integer("current_uses").notNull().default(0),
  isActive: integer("is_active").notNull().default(1),
  validFrom: timestamp("valid_from", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  validUntil: timestamp("valid_until", { mode: "date", withTimezone: true }),
  applicableProducts: text("applicable_products"), // JSON array of product types
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const organizationTracking = pgTable("organization_tracking", {
  id: text("id").notNull().primaryKey(),
  organizationName: text("organization_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactName: text("contact_name"),
  assessmentId: text("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  trackingCode: text("tracking_code").notNull().unique(), // Unique code for employees
  isActive: integer("is_active").notNull().default(1),
  totalParticipants: integer("total_participants").default(0),
  completedAssessments: integer("completed_assessments").default(0),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

// Stripe Integration Tables
export const stripeCustomers = pgTable("stripe_customer", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  organizationTrackingId: text("organization_tracking_id").references(
    () => organizationTracking.id,
    { onDelete: "cascade" },
  ),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  customerType: text("customer_type").notNull(), // 'individual', 'organization'
  defaultPaymentMethodId: text("default_payment_method_id"),
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const reportPackages = pgTable("report_package", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  packageType: text("package_type").notNull(), // 'single', 'bulk', 'organizational', 'unlimited'
  reportCount: integer("report_count"), // Number of reports included (null for unlimited)
  pricePerReport: integer("price_per_report"), // Price per report in cents
  totalPrice: integer("total_price").notNull(), // Total package price in cents
  discountPercentage: integer("discount_percentage").default(0),
  validityDays: integer("validity_days"), // Package validity period (null for lifetime)
  isActive: integer("is_active").notNull().default(1),
  targetCustomerType: text("target_customer_type").notNull(), // 'individual', 'organization', 'both'
  stripePriceId: text("stripe_price_id"), // Stripe Price ID for recurring billing
  features: text("features"), // JSON array of package features
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const stripePayments = pgTable("stripe_payment", {
  id: text("id").notNull().primaryKey(),
  stripeCustomerId: text("stripe_customer_id")
    .notNull()
    .references(() => stripeCustomers.id, { onDelete: "cascade" }),
  stripePaymentIntentId: text("stripe_payment_intent_id").notNull().unique(),
  stripeChargeId: text("stripe_charge_id"),
  amount: integer("amount").notNull(), // Amount in cents
  currency: text("currency").notNull().default("usd"),
  paymentStatus: text("payment_status").notNull(), // 'pending', 'succeeded', 'failed', 'canceled', 'refunded'
  paymentMethod: text("payment_method"), // 'card', 'bank_transfer', etc.
  paymentMethodId: text("payment_method_id"), // Stripe Payment Method ID
  receiptUrl: text("receipt_url"),
  failureReason: text("failure_reason"),
  refundAmount: integer("refund_amount").default(0),
  refundReason: text("refund_reason"),
  metadata: text("metadata"), // JSON string for additional Stripe metadata
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const packagePurchases = pgTable("package_purchase", {
  id: text("id").notNull().primaryKey(),
  stripeCustomerId: text("stripe_customer_id")
    .notNull()
    .references(() => stripeCustomers.id, { onDelete: "cascade" }),
  reportPackageId: text("report_package_id")
    .notNull()
    .references(() => reportPackages.id, { onDelete: "cascade" }),
  stripePaymentId: text("stripe_payment_id").references(
    () => stripePayments.id,
    { onDelete: "set null" },
  ),
  discountCodeId: text("discount_code_id").references(() => discountCodes.id, {
    onDelete: "set null",
  }),
  originalPrice: integer("original_price").notNull(),
  discountAmount: integer("discount_amount").default(0),
  finalPrice: integer("final_price").notNull(),
  reportsRemaining: integer("reports_remaining").notNull(),
  totalReports: integer("total_reports").notNull(),
  purchaseStatus: text("purchase_status").notNull().default("active"), // 'active', 'expired', 'exhausted', 'refunded'
  expiresAt: timestamp("expires_at", { mode: "date", withTimezone: true }),
  purchasedAt: timestamp("purchased_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const purchasedReports = pgTable("purchased_report", {
  id: text("id").notNull().primaryKey(),
  packagePurchaseId: text("package_purchase_id")
    .notNull()
    .references(() => packagePurchases.id, { onDelete: "cascade" }),
  userAssessmentId: text("user_assessment_id")
    .notNull()
    .references(() => userAssessments.id, { onDelete: "cascade" }),
  reportId: text("report_id").references(() => reports.id, {
    onDelete: "set null",
  }),
  reportStatus: text("report_status").notNull().default("pending"), // 'pending', 'generated', 'delivered', 'failed'
  assignedTo: text("assigned_to"), // Email or user ID for organizational purchases
  assignedBy: text("assigned_by").references(() => users.id, {
    onDelete: "set null",
  }), // Who assigned this report
  generatedAt: timestamp("generated_at", { mode: "date", withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { mode: "date", withTimezone: true }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const organizationInvites = pgTable("organization_invite", {
  id: text("id").notNull().primaryKey(),
  organizationTrackingId: text("organization_tracking_id")
    .notNull()
    .references(() => organizationTracking.id, { onDelete: "cascade" }),
  packagePurchaseId: text("package_purchase_id").references(
    () => packagePurchases.id,
    { onDelete: "cascade" },
  ),
  inviteCode: text("invite_code").notNull().unique(),
  email: text("email").notNull(),
  invitedBy: text("invited_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  inviteStatus: text("invite_status").notNull().default("pending"), // 'pending', 'accepted', 'expired'
  expiresAt: timestamp("expires_at", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
  acceptedAt: timestamp("accepted_at", { mode: "date", withTimezone: true }),
  acceptedBy: text("accepted_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
})

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  userAssessments: many(userAssessments),
  purchases: many(purchases),
  createdDiscountCodes: many(discountCodes),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}))

export const assessmentsRelations = relations(assessments, ({ many }) => ({
  healthDimensions: many(healthDimensions),
  assessmentQuestions: many(assessmentQuestions),
  userAssessments: many(userAssessments),
  organizationTracking: many(organizationTracking),
}))

export const healthDimensionsRelations = relations(
  healthDimensions,
  ({ one, many }) => ({
    assessment: one(assessments, {
      fields: [healthDimensions.assessmentId],
      references: [assessments.id],
    }),
    assessmentQuestions: many(assessmentQuestions),
    assessmentResults: many(assessmentResults),
  }),
)

export const assessmentQuestionsRelations = relations(
  assessmentQuestions,
  ({ one, many }) => ({
    assessment: one(assessments, {
      fields: [assessmentQuestions.assessmentId],
      references: [assessments.id],
    }),
    dimension: one(healthDimensions, {
      fields: [assessmentQuestions.dimensionId],
      references: [healthDimensions.id],
    }),
    questionOptions: many(questionOptions),
    userResponses: many(userResponses),
  }),
)

export const questionOptionsRelations = relations(
  questionOptions,
  ({ one, many }) => ({
    question: one(assessmentQuestions, {
      fields: [questionOptions.questionId],
      references: [assessmentQuestions.id],
    }),
    userResponses: many(userResponses),
  }),
)

export const userAssessmentsRelations = relations(
  userAssessments,
  ({ one, many }) => ({
    user: one(users, {
      fields: [userAssessments.userId],
      references: [users.id],
    }),
    assessment: one(assessments, {
      fields: [userAssessments.assessmentId],
      references: [assessments.id],
    }),
    organizationTracking: one(organizationTracking, {
      fields: [userAssessments.organizationTrackingId],
      references: [organizationTracking.id],
    }),
    userResponses: many(userResponses),
    assessmentResults: many(assessmentResults),
    reports: many(reports),
    purchases: many(purchases),
  }),
)

export const userResponsesRelations = relations(userResponses, ({ one }) => ({
  userAssessment: one(userAssessments, {
    fields: [userResponses.userAssessmentId],
    references: [userAssessments.id],
  }),
  question: one(assessmentQuestions, {
    fields: [userResponses.questionId],
    references: [assessmentQuestions.id],
  }),
  option: one(questionOptions, {
    fields: [userResponses.optionId],
    references: [questionOptions.id],
  }),
}))

export const assessmentResultsRelations = relations(
  assessmentResults,
  ({ one }) => ({
    userAssessment: one(userAssessments, {
      fields: [assessmentResults.userAssessmentId],
      references: [userAssessments.id],
    }),
    dimension: one(healthDimensions, {
      fields: [assessmentResults.dimensionId],
      references: [healthDimensions.id],
    }),
  }),
)

export const reportsRelations = relations(reports, ({ one }) => ({
  userAssessment: one(userAssessments, {
    fields: [reports.userAssessmentId],
    references: [userAssessments.id],
  }),
}))

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id],
  }),
  userAssessment: one(userAssessments, {
    fields: [purchases.userAssessmentId],
    references: [userAssessments.id],
  }),
  discountCode: one(discountCodes, {
    fields: [purchases.discountCodeId],
    references: [discountCodes.id],
  }),
}))

export const discountCodesRelations = relations(
  discountCodes,
  ({ one, many }) => ({
    createdBy: one(users, {
      fields: [discountCodes.createdBy],
      references: [users.id],
    }),
    purchases: many(purchases),
  }),
)

export const organizationTrackingRelations = relations(
  organizationTracking,
  ({ one, many }) => ({
    assessment: one(assessments, {
      fields: [organizationTracking.assessmentId],
      references: [assessments.id],
    }),
    userAssessments: many(userAssessments),
  }),
)

export const stripeCustomersRelations = relations(
  stripeCustomers,
  ({ one, many }) => ({
    user: one(users, {
      fields: [stripeCustomers.userId],
      references: [users.id],
    }),
    organizationTracking: one(organizationTracking, {
      fields: [stripeCustomers.organizationTrackingId],
      references: [organizationTracking.id],
    }),
    stripePayments: many(stripePayments),
    packagePurchases: many(packagePurchases),
  }),
)

export const reportPackagesRelations = relations(
  reportPackages,
  ({ many }) => ({
    packagePurchases: many(packagePurchases),
  }),
)

export const stripePaymentsRelations = relations(
  stripePayments,
  ({ one, many }) => ({
    stripeCustomer: one(stripeCustomers, {
      fields: [stripePayments.stripeCustomerId],
      references: [stripeCustomers.id],
    }),
    packagePurchases: many(packagePurchases),
  }),
)

export const packagePurchasesRelations = relations(
  packagePurchases,
  ({ one, many }) => ({
    stripeCustomer: one(stripeCustomers, {
      fields: [packagePurchases.stripeCustomerId],
      references: [stripeCustomers.id],
    }),
    reportPackage: one(reportPackages, {
      fields: [packagePurchases.reportPackageId],
      references: [reportPackages.id],
    }),
    discountCode: one(discountCodes, {
      fields: [packagePurchases.discountCodeId],
      references: [discountCodes.id],
    }),
    stripePayment: one(stripePayments, {
      fields: [packagePurchases.stripePaymentId],
      references: [stripePayments.id],
    }),
    purchasedReports: many(purchasedReports),
    organizationInvites: many(organizationInvites),
  }),
)

export const purchasedReportsRelations = relations(
  purchasedReports,
  ({ one }) => ({
    packagePurchase: one(packagePurchases, {
      fields: [purchasedReports.packagePurchaseId],
      references: [packagePurchases.id],
    }),
    userAssessment: one(userAssessments, {
      fields: [purchasedReports.userAssessmentId],
      references: [userAssessments.id],
    }),
    report: one(reports, {
      fields: [purchasedReports.reportId],
      references: [reports.id],
    }),
    assignedBy: one(users, {
      fields: [purchasedReports.assignedBy],
      references: [users.id],
    }),
  }),
)

export const organizationInvitesRelations = relations(
  organizationInvites,
  ({ one }) => ({
    organizationTracking: one(organizationTracking, {
      fields: [organizationInvites.organizationTrackingId],
      references: [organizationTracking.id],
    }),
    packagePurchase: one(packagePurchases, {
      fields: [organizationInvites.packagePurchaseId],
      references: [packagePurchases.id],
    }),
    invitedBy: one(users, {
      fields: [organizationInvites.invitedBy],
      references: [users.id],
    }),
    acceptedBy: one(users, {
      fields: [organizationInvites.acceptedBy],
      references: [users.id],
    }),
  }),
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert

// Assessment Types
export type Assessment = typeof assessments.$inferSelect
export type NewAssessment = typeof assessments.$inferInsert

export type HealthDimension = typeof healthDimensions.$inferSelect
export type NewHealthDimension = typeof healthDimensions.$inferInsert

export type AssessmentQuestion = typeof assessmentQuestions.$inferSelect
export type NewAssessmentQuestion = typeof assessmentQuestions.$inferInsert

export type QuestionOption = typeof questionOptions.$inferSelect
export type NewQuestionOption = typeof questionOptions.$inferInsert

export type UserAssessment = typeof userAssessments.$inferSelect
export type NewUserAssessment = typeof userAssessments.$inferInsert

export type UserResponse = typeof userResponses.$inferSelect
export type NewUserResponse = typeof userResponses.$inferInsert

export type AssessmentResult = typeof assessmentResults.$inferSelect
export type NewAssessmentResult = typeof assessmentResults.$inferInsert

export type Report = typeof reports.$inferSelect
export type NewReport = typeof reports.$inferInsert

export type Purchase = typeof purchases.$inferSelect
export type NewPurchase = typeof purchases.$inferInsert

export type DiscountCode = typeof discountCodes.$inferSelect
export type NewDiscountCode = typeof discountCodes.$inferInsert

export type OrganizationTracking = typeof organizationTracking.$inferSelect
export type NewOrganizationTracking = typeof organizationTracking.$inferInsert

// Stripe Integration Types
export type StripeCustomer = typeof stripeCustomers.$inferSelect
export type NewStripeCustomer = typeof stripeCustomers.$inferInsert

export type ReportPackage = typeof reportPackages.$inferSelect
export type NewReportPackage = typeof reportPackages.$inferInsert

export type StripePayment = typeof stripePayments.$inferSelect
export type NewStripePayment = typeof stripePayments.$inferInsert

export type PackagePurchase = typeof packagePurchases.$inferSelect
export type NewPackagePurchase = typeof packagePurchases.$inferInsert

export type PurchasedReport = typeof purchasedReports.$inferSelect
export type NewPurchasedReport = typeof purchasedReports.$inferInsert

export type OrganizationInvite = typeof organizationInvites.$inferSelect
export type NewOrganizationInvite = typeof organizationInvites.$inferInsert
