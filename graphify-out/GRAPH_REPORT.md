# Graph Report - .  (2026-06-04)

## Corpus Check
- 162 files · ~108,715 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 777 nodes · 1575 edges · 53 communities (46 shown, 7 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 57 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_App Layout & Fonts|App Layout & Fonts]]
- [[_COMMUNITY_Account & Admin UI|Account & Admin UI]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_API Routes & Rate Limiting|API Routes & Rate Limiting]]
- [[_COMMUNITY_Course & OnDemand Pages|Course & OnDemand Pages]]
- [[_COMMUNITY_Admin Sidebar Navigation|Admin Sidebar Navigation]]
- [[_COMMUNITY_Sitemap & Middleware|Sitemap & Middleware]]
- [[_COMMUNITY_Promo Codes Manager|Promo Codes Manager]]
- [[_COMMUNITY_Admin Overview & Digital Products|Admin Overview & Digital Products]]
- [[_COMMUNITY_Account Page & Modules API|Account Page & Modules API]]
- [[_COMMUNITY_Curriculum Builder|Curriculum Builder]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Auth Forms|Auth Forms]]
- [[_COMMUNITY_File Upload & Env Config|File Upload & Env Config]]
- [[_COMMUNITY_Course Meta Form|Course Meta Form]]
- [[_COMMUNITY_OnDemand Docs & Build System|OnDemand Docs & Build System]]
- [[_COMMUNITY_Digital Product Admin Form|Digital Product Admin Form]]
- [[_COMMUNITY_PayPal Payment Capture|PayPal Payment Capture]]
- [[_COMMUNITY_Admin Codes API|Admin Codes API]]
- [[_COMMUNITY_Package Manifest|Package Manifest]]
- [[_COMMUNITY_Supabase Auth & Server|Supabase Auth & Server]]
- [[_COMMUNITY_Lesson Player|Lesson Player]]
- [[_COMMUNITY_Video & Mux Integration|Video & Mux Integration]]
- [[_COMMUNITY_Student Progress Tracking|Student Progress Tracking]]
- [[_COMMUNITY_Course Enrollment Flow|Course Enrollment Flow]]
- [[_COMMUNITY_Marketing Landing Pages|Marketing Landing Pages]]
- [[_COMMUNITY_Brand Assets & Images|Brand Assets & Images]]
- [[_COMMUNITY_Review Testimonials|Review Testimonials]]
- [[_COMMUNITY_Tutor Profile (Anto)|Tutor Profile (Anto)]]
- [[_COMMUNITY_SEO & Metadata|SEO & Metadata]]
- [[_COMMUNITY_Checkout & Pricing|Checkout & Pricing]]
- [[_COMMUNITY_Webhook Handlers|Webhook Handlers]]
- [[_COMMUNITY_Admin Dashboard|Admin Dashboard]]
- [[_COMMUNITY_Module & Lesson CRUD|Module & Lesson CRUD]]
- [[_COMMUNITY_UI Components|UI Components]]
- [[_COMMUNITY_Form Validation|Form Validation]]
- [[_COMMUNITY_React Hooks|React Hooks]]
- [[_COMMUNITY_Email Notifications|Email Notifications]]
- [[_COMMUNITY_Certificate Generation|Certificate Generation]]
- [[_COMMUNITY_Analytics & Tracking|Analytics & Tracking]]
- [[_COMMUNITY_Type Definitions|Type Definitions]]
- [[_COMMUNITY_Static Assets|Static Assets]]
- [[_COMMUNITY_Error Handling|Error Handling]]
- [[_COMMUNITY_Search & Filtering|Search & Filtering]]
- [[_COMMUNITY_Access Control|Access Control]]
- [[_COMMUNITY_Data Fetching Utilities|Data Fetching Utilities]]
- [[_COMMUNITY_Podcast  Audio Content|Podcast / Audio Content]]
- [[_COMMUNITY_Community Features|Community Features]]
- [[_COMMUNITY_Blog & Content|Blog & Content]]
- [[_COMMUNITY_Stripe Payments|Stripe Payments]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_Testing Setup|Testing Setup]]
- [[_COMMUNITY_Miscellaneous Utilities|Miscellaneous Utilities]]

## God Nodes (most connected - your core abstractions)
1. `getSupabaseAdminClient()` - 82 edges
2. `getCurrentProfile()` - 47 edges
3. `cn()` - 40 edges
4. `Button` - 32 edges
5. `getCurrentUser()` - 28 edges
6. `Build Prompt — Poncho OnDemand Academy FINAL` - 21 edges
7. `getSupabaseServerClient()` - 19 edges
8. `Build Summary — On-Demand Academy Session 1` - 18 edges
9. `Decisions Log — On-Demand Academy Build` - 18 edges
10. `Card` - 17 edges

## Surprising Connections (you probably didn't know these)
- `AdminCourseEditPage()` --calls--> `getSupabaseAdminClient()`  [INFERRED]
  app/(admin)/admin/courses/[id]/page.tsx → lib/supabase/server.ts
- `Completion Certificates (react-pdf, public verify)` --conceptually_related_to--> `Build Summary — On-Demand Academy Session 1`  [INFERRED]
  docs/ONDEMAND_BUILD_PROMPT.md → BUILD_SUMMARY.md
- `Mux API Keys Setup (Token ID, Secret, Signing Key)` --references--> `Mux Video Integration`  [INFERRED]
  TODO_HUMAN.md → BUILD_SUMMARY.md
- `AdminCodesPage()` --calls--> `getSupabaseAdminClient()`  [EXTRACTED]
  app/(admin)/admin/codes/page.tsx → lib/supabase/server.ts
- `EditDigitalProductPage()` --calls--> `getSupabaseAdminClient()`  [INFERRED]
  app/(admin)/admin/digital-products/[id]/page.tsx → lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (53 total, 7 thin omitted)

### Community 0 - "App Layout & Fonts"
Cohesion: 0.06
Nodes (45): baskerville, metadata, montserrat, RootLayout(), viewport, aiCrawlers, disallow, AboutAntoSection() (+37 more)

### Community 1 - "Account & Admin UI"
Cohesion: 0.08
Nodes (27): metadata, AdminBanner(), FileUploaderProps, NewCourseForm(), metadata, metadata, metadata, RedeemCodeCard() (+19 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.04
Nodes (51): dependencies, canvas-confetti, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, framer-motion (+43 more)

### Community 3 - "API Routes & Rate Limiting"
Cohesion: 0.08
Nodes (35): GET(), Bucket, buckets, ipFromRequest(), rateLimit(), RateLimitOptions, RateLimitProfiles, RateLimitResult (+27 more)

### Community 4 - "Course & OnDemand Pages"
Cohesion: 0.09
Nodes (36): PageProps, PageProps, GET(), DashboardPage(), CourseOutline(), CourseOutlineProps, ModuleWithLessons, MarkCompleteButton() (+28 more)

### Community 5 - "Admin Sidebar Navigation"
Cohesion: 0.06
Nodes (27): ACCOUNT, AdminSidebar(), COMMERCE, NavItem, PRIMARY, AdminLayout(), metadata, AppShellLayout() (+19 more)

### Community 6 - "Sitemap & Middleware"
Cohesion: 0.05
Nodes (36): config, middleware(), CookieToSet, updateSession(), AccessCode, Certificate, CodeScope, Contact (+28 more)

### Community 7 - "Promo Codes Manager"
Cohesion: 0.11
Nodes (23): AnyCode, BaseCode, CodeRow(), CodesManager(), CourseOption, CreateForm(), DiscountCode, FreeCode (+15 more)

### Community 8 - "Admin Overview & Digital Products"
Cohesion: 0.12
Nodes (19): AdminOverviewPage(), PageProps, CreateSchema, generateCode(), GET(), POST(), requireAdmin(), POST() (+11 more)

### Community 9 - "Account Page & Modules API"
Cohesion: 0.13
Nodes (16): AccountPage(), PATCH(), Schema, DELETE(), PATCH(), PatchSchema, DELETE(), PATCH() (+8 more)

### Community 10 - "Curriculum Builder"
Cohesion: 0.12
Nodes (16): CurriculumBuilder(), CurriculumContext, LessonItem, LessonRow(), ModuleCard(), ModuleItem, InitialSubtitle, LANG_LABEL (+8 more)

### Community 11 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 12 - "Auth Forms"
Cohesion: 0.19
Nodes (12): FormValues, Schema, FormValues, Schema, AccountForm(), CheckoutPanel(), CheckoutPanelProps, getSupabaseBrowserClient() (+4 more)

### Community 13 - "File Upload & Env Config"
Cohesion: 0.19
Nodes (11): POST(), env, DEFAULT_NEW_ASSET_SETTINGS, getMux(), muxStaticMp4Url(), muxThumbnailUrl(), MuxWebhookVerification, verifyMuxSignature() (+3 more)

### Community 14 - "Course Meta Form"
Cohesion: 0.17
Nodes (13): CourseMetaForm(), CURRENCIES, LEVELS, LEVELS, ContactInput, ContactSchema, interests, levels (+5 more)

### Community 15 - "OnDemand Docs & Build System"
Cohesion: 0.14
Nodes (14): Anto's First-Session Self-Serve Journey (12 Steps), Completion Certificates (react-pdf, public verify), Build Prompt — Poncho OnDemand Academy FINAL, Confetti on Course Completion (canvas-confetti), Course Detail Page as Landing Page (Conversion Polish), Standalone Digital Products (ebooks etc.), Drag-and-Drop Curriculum Editor (dnd-kit), Internationalization EN + ES (next-intl) (+6 more)

### Community 16 - "Digital Product Admin Form"
Cohesion: 0.21
Nodes (6): DigitalProductForm(), DraftState, FileUploader(), PublishToggle(), metadata, Switch

### Community 17 - "PayPal Payment Capture"
Cohesion: 0.21
Nodes (9): CaptureResponse, POST(), Schema, POST(), Schema, AccessTokenResponse, getPaypalAccessToken(), paypalFetch() (+1 more)

### Community 18 - "Admin Codes API"
Cohesion: 0.24
Nodes (7): DELETE(), requireAdmin(), BodySchema, POST(), GET(), CookieToSet, requireAdmin()

### Community 19 - "Package Manifest"
Cohesion: 0.18
Nodes (10): description, name, private, scripts, build, dev, lint, start (+2 more)

### Community 20 - "Supabase Auth & Server"
Cohesion: 0.18
Nodes (11): devDependencies, autoprefixer, eslint, eslint-config-next, postcss, tailwindcss, @types/jsonwebtoken, @types/node (+3 more)

### Community 21 - "Lesson Player"
Cohesion: 0.18
Nodes (11): Liberal Service-Role Usage Trade-off, Decisions Log — On-Demand Academy Build, D10: 12 Standard Tags Seeded Automatically, D11: last_position_seconds on lesson_progress, D12: user_preferences One Row Per User (PK = user_id), D14: Denormalized Course Aggregates (students_count, avg_rating), D15: Minimal Postgres Functions, Logic in Server Actions, D1: New Supabase Project (Not Reusing Legacy Ref) (+3 more)

### Community 22 - "Video & Mux Integration"
Cohesion: 0.27
Nodes (7): POST(), Schema, POST(), Schema, slugify(), CreateSchema, POST()

### Community 23 - "Student Progress Tracking"
Cohesion: 0.20
Nodes (10): PWA Shell (manifest + service worker, no full offline), PayPal Checkout Integration, Future: Abandoned-Checkout Vercel Cron Emails, Future: Affiliate / Referral Codes, Future: AI Chatbot Tutor, Future / Out-of-Scope Features, Future: Course Bundles, Future: Lesson Quizzes (+2 more)

### Community 24 - "Course Enrollment Flow"
Cohesion: 0.22
Nodes (10): Access Codes and Discount Codes, Admin Panel Shell, Build Summary — On-Demand Academy Session 1, 16 Supabase DB Migrations, OnDemand Storefront (renamed from /courses), In-Memory Token-Bucket Rate Limiter, Row-Level Security (RLS) on All Tables, Supabase Project wdpgkhghigaowtdtjztz (Poncho Spanish) (+2 more)

### Community 25 - "Marketing Landing Pages"
Cohesion: 0.22
Nodes (9): Mux Direct Upload + tus.io Resumable Upload Flow, Per-Cue Subtitle Editor with Versioning, Mux Video Integration, Webhook Idempotency via webhook_events Table, OpenAI Whisper Subtitle Pipeline, D2: Keep course-videos Bucket Despite Mux Primary, D3: Subtitle Languages en/es (ISO-639-1, No Regional Codes), D6: Webhook Idempotency via Unique Constraint (+1 more)

### Community 26 - "Brand Assets & Images"
Cohesion: 0.31
Nodes (9): Book, Child Student, Over-ear Headphones, Home Study Environment, Laptop, Marketing Image for Spanish Learning Platform, Notebook, Online Learning / Study Session (+1 more)

### Community 27 - "Review Testimonials"
Cohesion: 0.22
Nodes (9): Resend Transactional Email, D13: email_log Keeps Full JSONB Payload Forever, TODO Human — Keys and Accounts, Mux API Keys Setup (Token ID, Secret, Signing Key), PayPal Business Account Setup (Sandbox + Live), PostHog Analytics Setup (EU Region), Resend Domain Verification and API Key, Sentry Error Tracking Setup (Next.js) (+1 more)

### Community 28 - "Tutor Profile (Anto)"
Cohesion: 0.36
Nodes (7): EmailKind, getResend(), logEmail(), LogEmailArgs, sendEmail(), SendEmailParams, SendEmailResult

### Community 29 - "SEO & Metadata"
Cohesion: 0.36
Nodes (8): Child 1, Child 2, Child 3, Child 4, Children Fashion Photography, Group of Children, Image, Marketing Asset

### Community 30 - "Checkout & Pricing"
Cohesion: 0.43
Nodes (8): Study Desk, Headphones, Home Learning Environment, Laptop, Online Learning, Spanish Language Learning, Student, Success / Excitement

### Community 31 - "Webhook Handlers"
Cohesion: 0.39
Nodes (8): Brand, Dark Terracotta Red, Golden Amber Yellow, Medium Burnt Orange, Brand Color Palette, Logo, Small Diamond Accent, Layered Chevron Symbol

### Community 32 - "Admin Dashboard"
Cohesion: 0.29
Nodes (6): Document, Page, WorkbookViewer(), WorkbookViewerProps, Textarea, TextareaProps

### Community 33 - "Module & Lesson CRUD"
Cohesion: 0.43
Nodes (5): PageProps, AdminCourseEditPage(), TabsContent, TabsList, TabsTrigger

### Community 34 - "UI Components"
Cohesion: 0.60
Nodes (4): DELETE(), PATCH(), PatchSchema, requireAdmin()

### Community 35 - "Form Validation"
Cohesion: 0.60
Nodes (5): Caroline, Caroline's Daughter, Poncho Spanish, Google Review by Caroline, Spanish IGCSE

### Community 36 - "React Hooks"
Cohesion: 0.50
Nodes (5): A* in Spanish (grade 7), Holding conversations in Spain, Poncho Spanish, Review by Sabine, Sabine

### Community 37 - "Email Notifications"
Cohesion: 0.70
Nodes (5): Anto, Nikki C., Review by Nikki C., Nikki's Son, Tutoring Service

### Community 38 - "Certificate Generation"
Cohesion: 0.60
Nodes (5): Anto, Claire S., Claire's son (age 7), Google Review by Claire S., Poncho Spanish Tutoring Service

### Community 39 - "Analytics & Tracking"
Cohesion: 0.70
Nodes (5): Anto, Jess's Daughter, Jess, Online Spanish Lessons, Review by Jess

### Community 40 - "Type Definitions"
Cohesion: 0.40
Nodes (4): ALLOWED_BUCKETS, POST(), Schema, SUPABASE_BUCKET

### Community 41 - "Static Assets"
Cohesion: 0.83
Nodes (4): Application, Image, Person, UISection

### Community 42 - "Error Handling"
Cohesion: 0.67
Nodes (4): Tropical/Beach Background, Woman (Anto), Circular Crop Frame, Anto Profile Photo

### Community 43 - "Search & Filtering"
Cohesion: 0.83
Nodes (4): Spanish Learning Platform, Binoculars Hand Gesture, niñatapandoselosojos.jpg, Young Girl

### Community 46 - "Podcast / Audio Content"
Cohesion: 0.67
Nodes (3): Premium Video Player (MuxPlayer + Notes + Bookmarks), Mux Signed Playback URLs (RS256 JWT), D16: Signed URLs as Public Path for Storage

### Community 47 - "Community Features"
Cohesion: 1.00
Nodes (3): Image, Person, Website

## Knowledge Gaps
- **279 isolated node(s):** `extends`, `metadata`, `PageProps`, `metadata`, `PageProps` (+274 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSupabaseAdminClient()` connect `Admin Overview & Digital Products` to `Account & Admin UI`, `UI Components`, `Module & Lesson CRUD`, `API Routes & Rate Limiting`, `Course & OnDemand Pages`, `Promo Codes Manager`, `Type Definitions`, `Account Page & Modules API`, `File Upload & Env Config`, `PayPal Payment Capture`, `Admin Codes API`, `Video & Mux Integration`, `Tutor Profile (Anto)`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `Button` connect `Account & Admin UI` to `Admin Dashboard`, `Module & Lesson CRUD`, `App Layout & Fonts`, `Course & OnDemand Pages`, `Admin Sidebar Navigation`, `Promo Codes Manager`, `Curriculum Builder`, `Auth Forms`, `Course Meta Form`, `Digital Product Admin Form`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `cn()` connect `Promo Codes Manager` to `App Layout & Fonts`, `Account & Admin UI`, `Module & Lesson CRUD`, `Admin Dashboard`, `Course & OnDemand Pages`, `Admin Sidebar Navigation`, `Curriculum Builder`, `Auth Forms`, `Course Meta Form`, `Digital Product Admin Form`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `getSupabaseAdminClient()` (e.g. with `DELETE()` and `PATCH()`) actually correct?**
  _`getSupabaseAdminClient()` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 11 inferred relationships involving `getCurrentProfile()` (e.g. with `PATCH()` and `requireAdmin()`) actually correct?**
  _`getCurrentProfile()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **What connects `extends`, `metadata`, `PageProps` to the rest of the system?**
  _286 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Layout & Fonts` be split into smaller, more focused modules?**
  _Cohesion score 0.05608322026232474 - nodes in this community are weakly interconnected._