import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Hash password for all users
  const hashedPassword = await hash('password123', 10)

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@instrukcije.hr' },
    update: {},
    create: {
      email: 'admin@instrukcije.hr',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      phone: '+385 91 234 5678',
      bio: 'Administrator korisnik sa punim pristupom sustavu',
    },
  })
  console.log('✓ Created admin user:', admin.email)

  // Create Tutor user with profile
  const tutor = await prisma.user.upsert({
    where: { email: 'instruktor@instrukcije.hr' },
    update: {},
    create: {
      email: 'instruktor@instrukcije.hr',
      password: hashedPassword,
      name: 'Marko Horvat',
      role: 'TUTOR',
      phone: '+385 91 234 5679',
      bio: 'Iskusni instruktor matematike i fizike sa 10+ godina iskustva',
      tutorProfile: {
        create: {
          title: 'Magistar matematike',
          hourlyRate: 25.0,
          experience: 10,
          verified: true,
          education: 'Magistar matematike, Prirodoslovno-matematički fakultet Zagreb',
          certifications: ['Certificirani nastavnik matematike', 'STEM educator'],
          languages: ['Hrvatski', 'Engleski'],
          availableOnline: true,
          availableInPerson: true,
          educationLevels: ['OSNOVNA_SKOLA', 'SREDNJA_SKOLA', 'FAKULTET'],
          totalSessions: 150,
          averageRating: 4.8,
          responseTime: 30,
        },
      },
    },
  })
  console.log('✓ Created tutor user:', tutor.email)

  // Create Student user with profile
  const student = await prisma.user.upsert({
    where: { email: 'ucenik@instrukcije.hr' },
    update: {},
    create: {
      email: 'ucenik@instrukcije.hr',
      password: hashedPassword,
      name: 'Ana Kovač',
      role: 'STUDENT',
      phone: '+385 91 234 5680',
      bio: 'Studentica matematike',
      studentProfile: {
        create: {
          educationLevel: 'FAKULTET',
          interests: ['Matematika', 'Fizika', 'Programiranje'],
          learningGoals: 'Poboljšati znanje iz matematičke analize',
        },
      },
    },
  })
  console.log('✓ Created student user:', student.email)

  // Create Parent user with profile
  const parent = await prisma.user.upsert({
    where: { email: 'parent@instrukcije.hr' },
    update: {},
    create: {
      email: 'parent@instrukcije.hr',
      password: hashedPassword,
      name: 'Marija Novak',
      role: 'PARENT',
      phone: '+385 91 234 5681',
      bio: 'Roditelj dvoje djece koja pohađaju instrukcije',
      parentProfile: {
        create: {
          occupation: 'Inženjer',
          emergencyContact: '+385 91 987 6543',
        },
      },
    },
  })
  console.log('✓ Created parent user:', parent.email)

  // Create first child (student)
  const child1 = await prisma.user.upsert({
    where: { email: 'dijete1@instrukcije.hr' },
    update: {},
    create: {
      email: 'dijete1@instrukcije.hr',
      password: hashedPassword,
      name: 'Luka Novak',
      role: 'STUDENT',
      phone: '+385 91 234 5682',
      bio: 'Učenik 7. razreda osnovne škole',
      studentProfile: {
        create: {
          educationLevel: 'OSNOVNA_SKOLA',
          interests: ['Matematika', 'Programiranje'],
          learningGoals: 'Poboljšati ocjenu iz matematike',
        },
      },
    },
  })
  console.log('✓ Created child 1:', child1.email)

  // Create second child (student)
  const child2 = await prisma.user.upsert({
    where: { email: 'dijete2@instrukcije.hr' },
    update: {},
    create: {
      email: 'dijete2@instrukcije.hr',
      password: hashedPassword,
      name: 'Petra Novak',
      role: 'STUDENT',
      phone: '+385 91 234 5683',
      bio: 'Učenica 3. razreda srednje škole',
      studentProfile: {
        create: {
          educationLevel: 'SREDNJA_SKOLA',
          interests: ['Fizika', 'Engleski jezik'],
          learningGoals: 'Priprema za maturu iz fizike',
        },
      },
    },
  })
  console.log('✓ Created child 2:', child2.email)

  // Link children to parent
  await prisma.parentChild.upsert({
    where: {
      parentId_childId: {
        parentId: parent.id,
        childId: child1.id,
      },
    },
    update: {},
    create: {
      parentId: parent.id,
      childId: child1.id,
      relationship: 'Mother',
      isPrimary: true,
      canBook: true,
      canViewProgress: true,
    },
  })

  await prisma.parentChild.upsert({
    where: {
      parentId_childId: {
        parentId: parent.id,
        childId: child2.id,
      },
    },
    update: {},
    create: {
      parentId: parent.id,
      childId: child2.id,
      relationship: 'Mother',
      isPrimary: true,
      canBook: true,
      canViewProgress: true,
    },
  })
  console.log('✓ Linked children to parent')

  // Create some subjects
  const subjects = await Promise.all([
    prisma.subject.upsert({
      where: { name: 'Matematika' },
      update: {},
      create: {
        name: 'Matematika',
        nameEn: 'Mathematics',
        category: 'STEM',
        description: 'Osnove matematike, algebra, geometrija, analiza',
        icon: '📐',
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Fizika' },
      update: {},
      create: {
        name: 'Fizika',
        nameEn: 'Physics',
        category: 'STEM',
        description: 'Mehanika, termodinamika, elektromagnetizam',
        icon: '⚡',
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Programiranje' },
      update: {},
      create: {
        name: 'Programiranje',
        nameEn: 'Programming',
        category: 'Tehnologija',
        description: 'JavaScript, Python, Web development',
        icon: '💻',
      },
    }),
    prisma.subject.upsert({
      where: { name: 'Engleski jezik' },
      update: {},
      create: {
        name: 'Engleski jezik',
        nameEn: 'English Language',
        category: 'Jezici',
        description: 'Gramatika, konverzacija, priprema za ispite',
        icon: '🇬🇧',
      },
    }),
  ])
  console.log('✓ Created subjects:', subjects.length)

  // Link subjects to tutor
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId: tutor.id },
  })

  if (tutorProfile) {
    await Promise.all([
      prisma.subjectTaught.upsert({
        where: {
          tutorProfileId_subjectId: {
            tutorProfileId: tutorProfile.id,
            subjectId: subjects[0].id, // Matematika
          },
        },
        update: {},
        create: {
          tutorProfileId: tutorProfile.id,
          subjectId: subjects[0].id,
          experienceYears: 10,
        },
      }),
      prisma.subjectTaught.upsert({
        where: {
          tutorProfileId_subjectId: {
            tutorProfileId: tutorProfile.id,
            subjectId: subjects[1].id, // Fizika
          },
        },
        update: {},
        create: {
          tutorProfileId: tutorProfile.id,
          subjectId: subjects[1].id,
          experienceYears: 8,
        },
      }),
    ])
    console.log('✓ Linked subjects to tutor')

    // Add tutor availability (Monday to Friday, 14:00-20:00)
    for (let day = 1; day <= 5; day++) {
      await prisma.availability.upsert({
        where: {
          id: `${tutorProfile.id}-day-${day}`,
        },
        update: {},
        create: {
          id: `${tutorProfile.id}-day-${day}`,
          tutorProfileId: tutorProfile.id,
          dayOfWeek: day,
          startTime: '14:00',
          endTime: '20:00',
        },
      })
    }
    console.log('✓ Added tutor availability')
  }

  // Seed Reward Catalog
  console.log('\n📦 Seeding reward catalog...')

  const tutorRewards = [
    {
      type: 'COMMISSION_DISCOUNT',
      title: '5% Popust na proviziju',
      description: 'Smanjite platformsku proviziju za 5% tijekom 1 mjeseca. Idealno za aktivne instruktore koji žele povećati zaradu.',
      pointsCost: 500,
      value: 5,
      userRole: 'TUTOR',
      validDays: 30,
      icon: 'Percent',
    },
    {
      type: 'COMMISSION_DISCOUNT',
      title: '10% Popust na proviziju',
      description: 'Smanjite platformsku proviziju za 10% tijekom 1 mjeseca. Značajno povećanje zarade za lojalne instruktore.',
      pointsCost: 1000,
      value: 10,
      userRole: 'TUTOR',
      validDays: 30,
      icon: 'Percent',
    },
    {
      type: 'FEATURED',
      title: 'Featured Status - 7 dana',
      description: 'Budite istaknuti na homepage i u search rezultatima 7 dana. Povećajte svoju vidljivost i privucite nove učenike.',
      pointsCost: 2000,
      value: 7,
      userRole: 'TUTOR',
      validDays: 7,
      icon: 'Star',
    },
    {
      type: 'COMMISSION_DISCOUNT',
      title: '15% Popust na proviziju - 3 mjeseca',
      description: 'Vrhunski popust od 15% na proviziju tijekom 3 mjeseca. Za najlojalnije i najaktivnije instruktore.',
      pointsCost: 5000,
      value: 15,
      userRole: 'TUTOR',
      validDays: 90,
      icon: 'Percent',
    },
    {
      type: 'PREMIUM',
      title: 'Premium Profil - 6 mjeseci',
      description: 'Besplatni premium profil sa svim prednostima tijekom 6 mjeseci. Uključuje prioritet u preporukama i napredne statistike.',
      pointsCost: 10000,
      value: 1,
      userRole: 'TUTOR',
      validDays: 180,
      icon: 'Crown',
    },
  ]

  const studentRewards = [
    {
      type: 'VOUCHER',
      title: '5 EUR Voucher',
      description: 'Popust od 5 EUR na sljedeću instrukciju. Idealno za redovite učenike.',
      pointsCost: 100,
      value: 5,
      userRole: 'STUDENT',
      validDays: 30,
      icon: 'Gift',
    },
    {
      type: 'VOUCHER',
      title: '10 EUR Voucher',
      description: 'Popust od 10 EUR na sljedeću instrukciju. Nagrada za aktivne učenike.',
      pointsCost: 200,
      value: 10,
      userRole: 'STUDENT',
      validDays: 30,
      icon: 'Gift',
    },
    {
      type: 'FREE_LESSON',
      title: 'Besplatna Instrukcija',
      description: 'Potpuno besplatna instrukcija u vrijednosti do 25 EUR. Odličan način da isprobate novog instruktora.',
      pointsCost: 500,
      value: 25,
      userRole: 'STUDENT',
      validDays: 60,
      icon: 'Award',
    },
    {
      type: 'VOUCHER',
      title: '30 EUR Voucher',
      description: 'Veliki popust od 30 EUR za lojalne učenike. Iskoristite za paket instrukcija.',
      pointsCost: 1000,
      value: 30,
      userRole: 'STUDENT',
      validDays: 30,
      icon: 'DollarSign',
    },
    {
      type: 'PREMIUM',
      title: 'Premium Pristup - 1 mjesec',
      description: 'Premium pristup sa prioritet bookingom i ekskluzivnim instruktorima tijekom 1 mjeseca.',
      pointsCost: 2000,
      value: 1,
      userRole: 'STUDENT',
      validDays: 30,
      icon: 'Crown',
    },
  ]

  for (const reward of tutorRewards) {
    await prisma.rewardCatalog.upsert({
      where: { id: `tutor-${reward.type.toLowerCase()}-${reward.pointsCost}` },
      update: {},
      create: {
        id: `tutor-${reward.type.toLowerCase()}-${reward.pointsCost}`,
        ...reward,
      },
    })
  }
  console.log(`✓ Created ${tutorRewards.length} tutor rewards`)

  for (const reward of studentRewards) {
    await prisma.rewardCatalog.upsert({
      where: { id: `student-${reward.type.toLowerCase()}-${reward.pointsCost}` },
      update: {},
      create: {
        id: `student-${reward.type.toLowerCase()}-${reward.pointsCost}`,
        ...reward,
      },
    })
  }
  console.log(`✓ Created ${studentRewards.length} student rewards`)

  console.log('🎉 Database seed completed!')
  console.log('\nTest credentials:')
  console.log('Admin: admin@instrukcije.hr / password123')
  console.log('Tutor: instruktor@instrukcije.hr / password123')
  console.log('Student: ucenik@instrukcije.hr / password123')
  console.log('Parent: parent@instrukcije.hr / password123')
  console.log('Child 1: dijete1@instrukcije.hr / password123')
  console.log('Child 2: dijete2@instrukcije.hr / password123')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
