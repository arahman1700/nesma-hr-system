import { Employee } from "../types";

// Helper function to generate random date
const randomDate = (start: Date, end: Date): string => {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
  return date.toISOString().split("T")[0];
};

// Real photos for employees - Middle Eastern / Arab looking photos
const malePhotos = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/men/44.jpg",
  "https://randomuser.me/api/portraits/men/45.jpg",
  "https://randomuser.me/api/portraits/men/46.jpg",
  "https://randomuser.me/api/portraits/men/47.jpg",
  "https://randomuser.me/api/portraits/men/51.jpg",
  "https://randomuser.me/api/portraits/men/52.jpg",
  "https://randomuser.me/api/portraits/men/53.jpg",
  "https://randomuser.me/api/portraits/men/54.jpg",
  "https://randomuser.me/api/portraits/men/55.jpg",
  "https://randomuser.me/api/portraits/men/56.jpg",
  "https://randomuser.me/api/portraits/men/57.jpg",
  "https://randomuser.me/api/portraits/men/58.jpg",
  "https://randomuser.me/api/portraits/men/59.jpg",
  "https://randomuser.me/api/portraits/men/60.jpg",
  "https://randomuser.me/api/portraits/men/61.jpg",
  "https://randomuser.me/api/portraits/men/62.jpg",
  "https://randomuser.me/api/portraits/men/63.jpg",
  "https://randomuser.me/api/portraits/men/64.jpg",
  "https://randomuser.me/api/portraits/men/65.jpg",
  "https://randomuser.me/api/portraits/men/66.jpg",
  "https://randomuser.me/api/portraits/men/67.jpg",
  "https://randomuser.me/api/portraits/men/68.jpg",
  "https://randomuser.me/api/portraits/men/69.jpg",
  "https://randomuser.me/api/portraits/men/70.jpg",
  "https://randomuser.me/api/portraits/men/71.jpg",
  "https://randomuser.me/api/portraits/men/72.jpg",
  "https://randomuser.me/api/portraits/men/73.jpg",
  "https://randomuser.me/api/portraits/men/74.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg",
];

const femalePhotos = [
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/women/45.jpg",
  "https://randomuser.me/api/portraits/women/46.jpg",
  "https://randomuser.me/api/portraits/women/47.jpg",
  "https://randomuser.me/api/portraits/women/48.jpg",
  "https://randomuser.me/api/portraits/women/49.jpg",
  "https://randomuser.me/api/portraits/women/50.jpg",
  "https://randomuser.me/api/portraits/women/51.jpg",
  "https://randomuser.me/api/portraits/women/52.jpg",
  "https://randomuser.me/api/portraits/women/53.jpg",
];

// Sample data for generating employees
const firstNames = [
  "Mohammed",
  "Ahmed",
  "Abdullah",
  "Omar",
  "Khalid",
  "Ali",
  "Hassan",
  "Youssef",
  "Faisal",
  "Saad",
  "Tariq",
  "Nasser",
  "Waleed",
  "Fahad",
  "Ibrahim",
  "Rashid",
  "Majid",
  "Sami",
  "Zaid",
  "Hamad",
  "Sultan",
  "Bandar",
  "Turki",
  "Nawaf",
  "Abdulaziz",
];

const firstNamesFemale = [
  "Sara",
  "Fatima",
  "Aisha",
  "Maryam",
  "Noor",
  "Huda",
  "Layla",
  "Reem",
  "Dana",
  "Lina",
];

const lastNames = [
  "Al-Rashid",
  "Al-Faisal",
  "Al-Ahmad",
  "Al-Hassan",
  "Al-Khalid",
  "Al-Salem",
  "Al-Mutairi",
  "Al-Qahtani",
  "Al-Ghamdi",
  "Al-Otaibi",
  "Al-Dosari",
  "Al-Harbi",
  "Al-Shammari",
  "Al-Zahrani",
  "Al-Malki",
  "Hussein",
  "Fekry",
  "Elkholy",
  "Mansour",
  "Saleh",
];

const nationalities = [
  "Saudi Arabia",
  "Saudi Arabia",
  "Saudi Arabia",
  "Egypt",
  "Jordan",
  "Pakistan",
  "India",
  "Philippines",
  "Syria",
  "Yemen",
];

const departments = [
  "Logistics",
  "Human Resources",
  "Finance",
  "Operations",
  "IT",
  "Marketing",
  "Sales",
  "Engineering",
  "Procurement",
  "Administration",
];

const positions = [
  "Manager",
  "Senior Specialist",
  "Specialist",
  "Analyst",
  "Coordinator",
  "Assistant",
  "Supervisor",
  "Director",
  "Executive",
  "Officer",
];

const banks = [
  "Al Rajhi Bank",
  "National Commercial Bank",
  "Riyad Bank",
  "Saudi British Bank",
  "Arab National Bank",
  "Bank Albilad",
  "Alinma Bank",
  "Banque Saudi Fransi",
];

const locations = [
  "Head Office - Riyadh",
  "NEOM Site",
  "Red Sea Project",
  "Jeddah Branch",
  "Dammam Office",
];

let malePhotoIndex = 0;
let femalePhotoIndex = 0;

const getNextPhoto = (isFemale: boolean): string => {
  if (isFemale) {
    const photo = femalePhotos[femalePhotoIndex % femalePhotos.length];
    femalePhotoIndex++;
    return photo;
  } else {
    const photo = malePhotos[malePhotoIndex % malePhotos.length];
    malePhotoIndex++;
    return photo;
  }
};

export const generateEmployees = (count: number = 45): Employee[] => {
  const employees: Employee[] = [];

  // Reset photo indices
  malePhotoIndex = 0;
  femalePhotoIndex = 0;

  for (let i = 1; i <= count; i++) {
    const isFemale = Math.random() < 0.2; // 20% female
    const firstName = isFemale
      ? firstNamesFemale[Math.floor(Math.random() * firstNamesFemale.length)]
      : firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department =
      departments[Math.floor(Math.random() * departments.length)];
    const position = `${department} ${positions[Math.floor(Math.random() * positions.length)]}`;
    const location = locations[Math.floor(Math.random() * locations.length)];
    const basicSalary = Math.floor(Math.random() * 15000) + 5000;
    const housingAllowance = Math.floor(basicSalary * 0.25);
    const transportAllowance = Math.floor(Math.random() * 1000) + 500;
    const otherAllowances = Math.floor(Math.random() * 2000);

    const employee: Employee = {
      id: `emp-${i.toString().padStart(3, "0")}`,
      employeeId: `NIT-2025-${i.toString().padStart(3, "0")}`,
      firstName,
      lastName,
      firstNameAr: firstName,
      lastNameAr: lastName,
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace("al-", "")}@nit.com.sa`,
      phone: `+966 5${Math.floor(Math.random() * 90000000 + 10000000)}`,
      nationalId: `${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      dateOfBirth: randomDate(new Date(1970, 0, 1), new Date(2000, 11, 31)),
      gender: isFemale ? "Female" : "Male",
      nationality:
        nationalities[Math.floor(Math.random() * nationalities.length)],
      maritalStatus: ["Single", "Married", "Divorced"][
        Math.floor(Math.random() * 3)
      ] as Employee["maritalStatus"],

      position,
      positionId: `pos-${Math.floor(Math.random() * 20) + 1}`,
      department,
      departmentId: `dept-${departments.indexOf(department) + 1}`,
      hireDate: randomDate(new Date(2020, 0, 1), new Date(2025, 10, 30)),
      employmentType: ["Full-time", "Part-time", "Contractor"][
        Math.floor(Math.random() * 3)
      ] as Employee["employmentType"],
      contractType: ["Permanent", "Temporary", "Fixed-term"][
        Math.floor(Math.random() * 3)
      ] as Employee["contractType"],
      status: Math.random() > 0.1 ? "Active" : "Inactive",
      probationEndDate: randomDate(new Date(2025, 0, 1), new Date(2026, 5, 30)),

      basicSalary,
      housingAllowance,
      transportAllowance,
      otherAllowances,
      totalSalary:
        basicSalary + housingAllowance + transportAllowance + otherAllowances,

      bankName: banks[Math.floor(Math.random() * banks.length)],
      iban: `SA${Math.floor(Math.random() * 90000000000000000000 + 10000000000000000000)}`.substring(
        0,
        24,
      ),
      accountName: `${firstName} ${lastName}`,

      passportNumber: `A${Math.floor(Math.random() * 90000000 + 10000000)}`,
      passportExpiry: randomDate(new Date(2026, 0, 1), new Date(2030, 11, 31)),
      iqamaNumber: `2${Math.floor(Math.random() * 900000000 + 100000000)}`,
      iqamaExpiry: randomDate(new Date(2025, 6, 1), new Date(2027, 11, 31)),

      emergencyName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      emergencyPhone: `+966 5${Math.floor(Math.random() * 90000000 + 10000000)}`,
      emergencyRelation: ["Spouse", "Parent", "Sibling", "Friend"][
        Math.floor(Math.random() * 4)
      ],

      managerId:
        i > 5
          ? `emp-${Math.floor(Math.random() * 5) + 1}`.padStart(7, "emp-00")
          : undefined,
      managerName:
        i > 5
          ? `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`
          : undefined,

      locationId: `loc-${locations.indexOf(location) + 1}`,
      locationName: location,

      photo: getNextPhoto(isFemale),

      createdAt: randomDate(new Date(2020, 0, 1), new Date(2025, 10, 30)),
      updatedAt: new Date().toISOString(),
    };

    employees.push(employee);
  }

  // Set first employee as current user (Abdulrahman Hussein)
  employees[0] = {
    ...employees[0],
    id: "emp-001",
    employeeId: "NIT-2025-001",
    firstName: "Abdulrahman",
    lastName: "Hussein",
    fullName: "Abdulrahman Hussein",
    email: "abdulrahman.hussein@nit.com.sa",
    phone: "+966 539962999",
    position: "Logistics Manager",
    department: "Logistics",
    status: "Active",
    nationality: "Saudi Arabia",
    hireDate: "2025-09-24",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  return employees;
};

export const employees = generateEmployees(45);

export const getEmployeeById = (id: string): Employee | undefined => {
  return employees.find((e) => e.id === id);
};

export const getEmployeesByDepartment = (department: string): Employee[] => {
  return employees.filter((e) => e.department === department);
};

export const getActiveEmployees = (): Employee[] => {
  return employees.filter((e) => e.status === "Active");
};

export default employees;
