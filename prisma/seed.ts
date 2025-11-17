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

  console.log('🎉 Database seed completed!')
  console.log('\nTest credentials:')
  console.log('Admin: admin@instrukcije.hr / password123')
  console.log('Tutor: instruktor@instrukcije.hr / password123')
  console.log('Student: ucenik@instrukcije.hr / password123')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
