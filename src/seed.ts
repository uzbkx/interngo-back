import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/interngo?authSource=interngo';

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db!;

  // --- Clear existing data ---
  console.log('Clearing existing data...');
  await db.collection('users').deleteMany({});
  await db.collection('listings').deleteMany({});
  await db.collection('categories').deleteMany({});
  await db.collection('organizations').deleteMany({});
  await db.collection('scouted_sources').deleteMany({});
  await db.collection('scouted_results').deleteMany({});
  await db.collection('scouter_runs').deleteMany({});
  await db.collection('applications').deleteMany({});
  await db.collection('saved_listings').deleteMany({});

  // --- Users ---
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 12);

  const [adminUser, studentUser, orgUser] = await db.collection('users').insertMany([
    {
      email: 'admin@interngo.uz',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      bio: 'Platform administrator',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: 'student@example.com',
      password: hashedPassword,
      name: 'Jasur Karimov',
      role: 'STUDENT',
      bio: 'Computer Science student at TUIT, looking for international internships',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: 'org@example.com',
      password: hashedPassword,
      name: 'Nodira Rashidova',
      role: 'ORGANIZATION',
      bio: 'HR Manager at TechHub Tashkent',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]).then(r => [r.insertedIds[0], r.insertedIds[1], r.insertedIds[2]]);

  console.log(`  Admin: admin@interngo.uz / password123`);
  console.log(`  Student: student@example.com / password123`);
  console.log(`  Org: org@example.com / password123`);

  // --- Categories ---
  console.log('Creating categories...');
  const categoryDocs = [
    { name: 'Technology', slug: 'technology' },
    { name: 'Business', slug: 'business' },
    { name: 'Engineering', slug: 'engineering' },
    { name: 'Science', slug: 'science' },
    { name: 'Arts & Design', slug: 'arts-design' },
    { name: 'Healthcare', slug: 'healthcare' },
    { name: 'Education', slug: 'education' },
    { name: 'Social Impact', slug: 'social-impact' },
    { name: 'Agriculture', slug: 'agriculture' },
    { name: 'Finance', slug: 'finance' },
  ];
  const catResult = await db.collection('categories').insertMany(categoryDocs);
  const catIds = Object.values(catResult.insertedIds);

  // --- Organization ---
  console.log('Creating organizations...');
  const orgResult = await db.collection('organizations').insertOne({
    name: 'TechHub Tashkent',
    slug: 'techhub-tashkent',
    description: 'A leading technology hub in Tashkent fostering innovation and talent',
    website: 'https://techhub.uz',
    verified: true,
    ownerId: orgUser,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // --- Listings ---
  console.log('Creating listings...');
  const now = new Date();
  const futureDate = (days: number) => new Date(now.getTime() + days * 86400000);

  const listings = [
    // Internships
    {
      title: 'Google STEP Internship 2026',
      slug: 'google-step-internship-2026',
      description: 'Google\'s Student Training in Engineering Program (STEP) is designed for first and second-year undergraduate students with a passion for technology.\n\n## What You\'ll Do\n- Work on real Google projects alongside experienced engineers\n- Participate in mentorship and professional development sessions\n- Collaborate with a diverse team of brilliant minds\n\n## Requirements\n- Currently enrolled in a Bachelor\'s program in CS, CE, or related field\n- Strong fundamentals in data structures and algorithms\n- Excellent problem-solving skills',
      type: 'INTERNSHIP',
      status: 'PUBLISHED',
      source: 'USER_SUBMITTED',
      country: 'United States',
      city: 'Mountain View',
      isRemote: false,
      isPaid: true,
      salary: '8,000',
      currency: 'USD',
      applyUrl: 'https://careers.google.com/step',
      deadline: futureDate(45),
      startDate: futureDate(120),
      endDate: futureDate(210),
      categories: [catIds[0], catIds[2]],
      createdAt: new Date(now.getTime() - 3 * 86400000),
      updatedAt: new Date(),
    },
    {
      title: 'UNDP Youth Internship Programme - Tashkent',
      slug: 'undp-youth-internship-tashkent',
      description: 'The United Nations Development Programme invites young professionals from Uzbekistan to apply for internship positions at the UNDP Country Office in Tashkent.\n\n## Areas of Work\n- Sustainable development goals monitoring\n- Climate change and environmental projects\n- Digital transformation initiatives\n\n## Benefits\n- Monthly stipend provided\n- Professional development workshops\n- UN system networking opportunities',
      type: 'INTERNSHIP',
      status: 'PUBLISHED',
      source: 'AI_SCOUTED',
      country: 'Uzbekistan',
      city: 'Tashkent',
      isRemote: false,
      isPaid: true,
      salary: '500',
      currency: 'USD',
      applyUrl: 'https://www.undp.org/uzbekistan/jobs',
      deadline: futureDate(30),
      startDate: futureDate(60),
      endDate: futureDate(240),
      categories: [catIds[7]],
      createdAt: new Date(now.getTime() - 5 * 86400000),
      updatedAt: new Date(),
    },
    {
      title: 'Samsung R&D Summer Internship Korea',
      slug: 'samsung-rd-summer-internship-korea',
      description: 'Samsung Electronics invites top engineering students worldwide for a summer research internship at Samsung R&D Center in Seoul.\n\n## Focus Areas\n- AI and Machine Learning\n- 5G/6G Communications\n- Semiconductor Design\n- Software Platform Development\n\n## Package\n- Round-trip airfare covered\n- Furnished accommodation provided\n- Competitive monthly stipend',
      type: 'INTERNSHIP',
      status: 'PUBLISHED',
      source: 'USER_SUBMITTED',
      country: 'South Korea',
      city: 'Seoul',
      isRemote: false,
      isPaid: true,
      salary: '3,000',
      currency: 'USD',
      applyUrl: 'https://www.samsung.com/global/careers',
      deadline: futureDate(20),
      startDate: futureDate(90),
      endDate: futureDate(150),
      categories: [catIds[0], catIds[2], catIds[3]],
      createdAt: new Date(now.getTime() - 2 * 86400000),
      updatedAt: new Date(),
    },

    // Scholarships
    {
      title: 'Chevening Scholarship 2026/2027 - UK',
      slug: 'chevening-scholarship-2026-2027',
      description: 'Chevening is the UK Government\'s international scholarships programme funded by the Foreign, Commonwealth and Development Office. It offers full financial support for a one-year Master\'s degree at any UK university.\n\n## Coverage\n- Full tuition fees\n- Monthly living allowance\n- Return airfare\n- Thesis/dissertation grant\n- Study travel allowance\n\n## Eligibility\n- Citizen of an eligible Chevening country (Uzbekistan is eligible)\n- At least 2 years of work experience\n- Return to home country for minimum 2 years after the scholarship',
      type: 'SCHOLARSHIP',
      status: 'PUBLISHED',
      source: 'AI_SCOUTED',
      country: 'United Kingdom',
      isRemote: false,
      isPaid: true,
      applyUrl: 'https://www.chevening.org/scholarships/',
      deadline: futureDate(60),
      startDate: futureDate(180),
      categories: [catIds[1], catIds[6]],
      createdAt: new Date(now.getTime() - 7 * 86400000),
      updatedAt: new Date(),
    },
    {
      title: 'Korean Government Scholarship Program (KGSP) 2026',
      slug: 'kgsp-2026',
      description: 'The Korean Government Scholarship Program provides international students from partner countries with opportunities to conduct advanced studies at higher educational institutions in Korea.\n\n## Coverage\n- Full tuition\n- Monthly living allowance (1,000,000 KRW)\n- Round-trip airfare\n- Korean language training (1 year)\n- Medical insurance\n- Settlement allowance\n\n## Available Degrees\n- Undergraduate (4 years + 1 year Korean)\n- Master\'s (2 years + 1 year Korean)\n- Doctoral (3 years + 1 year Korean)',
      type: 'SCHOLARSHIP',
      status: 'PUBLISHED',
      source: 'USER_SUBMITTED',
      country: 'South Korea',
      isRemote: false,
      isPaid: true,
      salary: '1,000,000',
      currency: 'KRW',
      applyUrl: 'https://www.studyinkorea.go.kr/en/sub/gks/allnew_invite.do',
      deadline: futureDate(75),
      startDate: futureDate(210),
      categories: [catIds[6], catIds[3]],
      createdAt: new Date(now.getTime() - 10 * 86400000),
      updatedAt: new Date(),
    },
    {
      title: 'Erasmus Mundus Joint Master Degrees 2026',
      slug: 'erasmus-mundus-joint-masters-2026',
      description: 'Erasmus Mundus Joint Master Degrees (EMJMDs) are prestigious, integrated, international study programmes, jointly delivered by an international consortium of higher education institutions from different countries.\n\n## Scholarship Coverage\n- Participation costs (including tuition fees)\n- Travel and installation costs\n- Monthly subsistence allowance (1,000 EUR/month)\n\n## Duration\n- 1-2 years depending on the programme\n- Study in at least 2 European countries',
      type: 'SCHOLARSHIP',
      status: 'PUBLISHED',
      source: 'AI_SCOUTED',
      country: 'European Union',
      isRemote: false,
      isPaid: true,
      salary: '1,000',
      currency: 'EUR',
      applyUrl: 'https://erasmus-plus.ec.europa.eu',
      deadline: futureDate(50),
      startDate: futureDate(180),
      categories: [catIds[6]],
      createdAt: new Date(now.getTime() - 4 * 86400000),
      updatedAt: new Date(),
    },

    // Programs
    {
      title: 'FLEX Alumni Exchange Program 2026',
      slug: 'flex-alumni-exchange-2026',
      description: 'The Future Leaders Exchange (FLEX) Alumni program provides opportunities for former FLEX participants to engage in community service, professional development, and cross-cultural exchange.\n\n## Activities\n- Community development projects\n- Leadership training workshops\n- Cross-cultural exchange events\n- Alumni mentoring network',
      type: 'PROGRAM',
      status: 'PUBLISHED',
      source: 'USER_SUBMITTED',
      country: 'United States',
      isRemote: false,
      isPaid: false,
      applyUrl: 'https://www.americancouncils.org/programs/flex',
      deadline: futureDate(40),
      categories: [catIds[6], catIds[7]],
      createdAt: new Date(now.getTime() - 6 * 86400000),
      updatedAt: new Date(),
    },
    {
      title: 'TechWomen Emerging Leaders Program',
      slug: 'techwomen-emerging-leaders-2026',
      description: 'TechWomen brings emerging women leaders in STEM from Africa, Central and South Asia, and the Middle East together with their professional counterparts in the United States for a mentorship and exchange program.\n\n## Program Includes\n- 5-week mentorship at a leading Silicon Valley company\n- Cultural exchange activities\n- All expenses covered (travel, accommodation, meals)\n- Professional networking opportunities',
      type: 'PROGRAM',
      status: 'PUBLISHED',
      source: 'AI_SCOUTED',
      country: 'United States',
      city: 'San Francisco',
      isRemote: false,
      isPaid: true,
      applyUrl: 'https://www.techwomen.org/apply',
      deadline: futureDate(55),
      startDate: futureDate(150),
      endDate: futureDate(185),
      categories: [catIds[0], catIds[2]],
      createdAt: new Date(now.getTime() - 8 * 86400000),
      updatedAt: new Date(),
    },

    // Volunteering
    {
      title: 'European Solidarity Corps - Volunteer in Germany',
      slug: 'european-solidarity-corps-germany',
      description: 'The European Solidarity Corps offers volunteering opportunities for young people aged 18-30 in Germany.\n\n## Project Details\n- Work with local NGOs on environmental and social projects\n- Duration: 6-12 months\n- Full board and accommodation provided\n- Monthly pocket money\n- Language course included\n- Travel costs covered',
      type: 'VOLUNTEER',
      status: 'PUBLISHED',
      source: 'USER_SUBMITTED',
      country: 'Germany',
      city: 'Berlin',
      isRemote: false,
      isPaid: false,
      applyUrl: 'https://europa.eu/youth/solidarity_en',
      deadline: futureDate(35),
      startDate: futureDate(90),
      endDate: futureDate(450),
      categories: [catIds[7]],
      createdAt: new Date(now.getTime() - 1 * 86400000),
      updatedAt: new Date(),
    },

    // Jobs
    {
      title: 'Junior Frontend Developer - Remote',
      slug: 'junior-frontend-developer-remote',
      description: 'We\'re looking for a junior frontend developer to join our distributed team. This is a fully remote position open to developers in Central Asia.\n\n## Requirements\n- 1+ years experience with React/Next.js\n- Strong TypeScript skills\n- Familiarity with Tailwind CSS\n- Good English communication skills\n\n## Benefits\n- Competitive salary in USD\n- Flexible working hours\n- Annual team retreats\n- Learning budget',
      type: 'JOB',
      status: 'PUBLISHED',
      source: 'USER_SUBMITTED',
      country: 'Uzbekistan',
      city: 'Tashkent',
      isRemote: true,
      isPaid: true,
      salary: '1,500-2,500',
      currency: 'USD',
      organizationId: orgResult.insertedId,
      organizationName: 'TechHub Tashkent',
      applyUrl: 'https://techhub.uz/careers',
      deadline: futureDate(25),
      categories: [catIds[0]],
      createdAt: new Date(now.getTime() - 1 * 86400000),
      updatedAt: new Date(),
    },
    {
      title: 'Data Analyst Intern - World Bank Tashkent Office',
      slug: 'data-analyst-intern-world-bank-tashkent',
      description: 'The World Bank Group Tashkent office is seeking a Data Analyst Intern to support the Poverty and Equity team.\n\n## Responsibilities\n- Analyze household survey data\n- Create data visualizations and dashboards\n- Support research papers with statistical analysis\n- Assist in report preparation\n\n## Qualifications\n- Master\'s student or recent graduate in Economics, Statistics, or related field\n- Proficiency in Stata, R, or Python\n- Strong analytical skills',
      type: 'INTERNSHIP',
      status: 'PUBLISHED',
      source: 'USER_SUBMITTED',
      country: 'Uzbekistan',
      city: 'Tashkent',
      isRemote: false,
      isPaid: true,
      salary: '800',
      currency: 'USD',
      applyUrl: 'https://www.worldbank.org/en/about/careers',
      deadline: futureDate(15),
      startDate: futureDate(45),
      endDate: futureDate(135),
      categories: [catIds[1], catIds[9]],
      createdAt: new Date(now.getTime() - 3 * 86400000),
      updatedAt: new Date(),
    },

    // Draft listings (for admin to review)
    {
      title: 'DAAD Research Grants for Doctoral Candidates',
      slug: 'daad-research-grants-doctoral',
      description: 'The German Academic Exchange Service (DAAD) offers research grants for doctoral candidates and young academics from developing countries to carry out research at a German university.',
      type: 'SCHOLARSHIP',
      status: 'DRAFT',
      source: 'USER_SUBMITTED',
      country: 'Germany',
      isRemote: false,
      isPaid: true,
      applyUrl: 'https://www.daad.de/en/',
      deadline: futureDate(90),
      categories: [catIds[3], catIds[6]],
      createdAt: new Date(now.getTime() - 1 * 86400000),
      updatedAt: new Date(),
    },
    {
      title: 'Startup Incubator Program - Dubai',
      slug: 'startup-incubator-dubai',
      description: 'A 3-month startup incubator program in Dubai for young entrepreneurs from Central Asia. Includes seed funding, mentorship, and co-working space.',
      type: 'PROGRAM',
      status: 'DRAFT',
      source: 'AI_SCOUTED',
      country: 'UAE',
      city: 'Dubai',
      isRemote: false,
      isPaid: true,
      salary: '5,000',
      currency: 'USD',
      applyUrl: 'https://example.com/dubai-incubator',
      deadline: futureDate(40),
      categories: [catIds[1]],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Remote UX Design Internship',
      slug: 'remote-ux-design-internship',
      description: 'A fully remote UX design internship opportunity with a Berlin-based design studio. Great for students with a portfolio in Figma.',
      type: 'INTERNSHIP',
      status: 'DRAFT',
      source: 'USER_SUBMITTED',
      country: 'Germany',
      city: 'Berlin',
      isRemote: true,
      isPaid: true,
      salary: '600',
      currency: 'EUR',
      applyUrl: 'https://example.com/ux-intern',
      deadline: futureDate(20),
      categories: [catIds[4]],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.collection('listings').insertMany(listings);
  console.log(`  Created ${listings.length} listings (${listings.filter(l => l.status === 'PUBLISHED').length} published, ${listings.filter(l => l.status === 'DRAFT').length} drafts)`);

  // --- Scouted Sources ---
  console.log('Creating scouted sources...');
  const sources = [
    {
      name: 'Chevening',
      url: 'https://www.chevening.org/scholarships/',
      description: 'UK Government international scholarships',
      isActive: true,
      lastScraped: new Date(now.getTime() - 2 * 86400000),
      createdAt: new Date(now.getTime() - 30 * 86400000),
      updatedAt: new Date(),
    },
    {
      name: 'DAAD Scholarships',
      url: 'https://www.daad.de/en/studying-in-germany/scholarships/',
      description: 'German Academic Exchange Service scholarships for international students',
      isActive: true,
      lastScraped: new Date(now.getTime() - 1 * 86400000),
      createdAt: new Date(now.getTime() - 25 * 86400000),
      updatedAt: new Date(),
    },
    {
      name: 'UN Careers',
      url: 'https://careers.un.org/lbw/home.aspx',
      description: 'United Nations internship and job opportunities',
      isActive: true,
      createdAt: new Date(now.getTime() - 20 * 86400000),
      updatedAt: new Date(),
    },
    {
      name: 'Study in Korea (KGSP)',
      url: 'https://www.studyinkorea.go.kr/en/sub/gks/allnew_invite.do',
      description: 'Korean Government Scholarship Program listings',
      isActive: true,
      lastScraped: new Date(now.getTime() - 3 * 86400000),
      createdAt: new Date(now.getTime() - 15 * 86400000),
      updatedAt: new Date(),
    },
    {
      name: 'Erasmus+ Opportunities',
      url: 'https://erasmus-plus.ec.europa.eu/opportunities',
      description: 'EU-funded education and training opportunities',
      isActive: true,
      createdAt: new Date(now.getTime() - 10 * 86400000),
      updatedAt: new Date(),
    },
  ];

  await db.collection('scouted_sources').insertMany(sources);
  console.log(`  Created ${sources.length} scouted sources`);

  // --- Scouter Runs ---
  console.log('Creating scouter run history...');
  const runs = [
    {
      type: 'scheduled',
      status: 'completed',
      sourcesCount: 5,
      foundCount: 12,
      addedCount: 8,
      autoApproved: 3,
      errors: [],
      startedAt: new Date(now.getTime() - 2 * 86400000),
      completedAt: new Date(now.getTime() - 2 * 86400000 + 120000),
    },
    {
      type: 'manual',
      status: 'completed',
      sourcesCount: 1,
      foundCount: 4,
      addedCount: 2,
      autoApproved: 1,
      errors: [],
      startedAt: new Date(now.getTime() - 1 * 86400000),
      completedAt: new Date(now.getTime() - 1 * 86400000 + 45000),
    },
    {
      type: 'discovery',
      status: 'completed',
      sourcesCount: 0,
      foundCount: 0,
      addedCount: 3,
      autoApproved: 0,
      errors: [],
      startedAt: new Date(now.getTime() - 12 * 3600000),
      completedAt: new Date(now.getTime() - 12 * 3600000 + 30000),
    },
  ];

  await db.collection('scouter_runs').insertMany(runs);
  console.log(`  Created ${runs.length} scouter runs`);

  // --- Applications (for student user) ---
  console.log('Creating sample applications...');
  const publishedListings = await db.collection('listings').find({ status: 'PUBLISHED' }).limit(3).toArray();

  if (publishedListings.length >= 3) {
    await db.collection('applications').insertMany([
      {
        userId: studentUser,
        listingId: publishedListings[0]._id,
        status: 'APPLIED',
        notes: 'Submitted my resume and cover letter on March 15',
        createdAt: new Date(now.getTime() - 5 * 86400000),
        updatedAt: new Date(now.getTime() - 2 * 86400000),
      },
      {
        userId: studentUser,
        listingId: publishedListings[1]._id,
        status: 'INTERVIEW',
        notes: 'Interview scheduled for next Monday at 2pm',
        createdAt: new Date(now.getTime() - 10 * 86400000),
        updatedAt: new Date(now.getTime() - 1 * 86400000),
      },
      {
        userId: studentUser,
        listingId: publishedListings[2]._id,
        status: 'INTERESTED',
        notes: '',
        createdAt: new Date(now.getTime() - 1 * 86400000),
        updatedAt: new Date(),
      },
    ]);
    console.log('  Created 3 sample applications for student');
  }

  // --- Saved Listings (for student user) ---
  console.log('Creating saved listings...');
  if (publishedListings.length >= 2) {
    await db.collection('saved_listings').insertMany([
      {
        userId: studentUser,
        listingId: publishedListings[0]._id,
        createdAt: new Date(now.getTime() - 3 * 86400000),
      },
      {
        userId: studentUser,
        listingId: publishedListings[1]._id,
        createdAt: new Date(now.getTime() - 2 * 86400000),
      },
    ]);
    console.log('  Created 2 saved listings for student');
  }

  console.log('\n--- Seed complete! ---');
  console.log('\nAccounts:');
  console.log('  Admin:   admin@interngo.uz / password123');
  console.log('  Student: student@example.com / password123');
  console.log('  Org:     org@example.com / password123');
  console.log(`\nListings: ${listings.filter(l => l.status === 'PUBLISHED').length} published, ${listings.filter(l => l.status === 'DRAFT').length} pending review`);
  console.log(`Sources:  ${sources.length} scouted sources`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
