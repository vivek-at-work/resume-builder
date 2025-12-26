import type { ResumeFormData } from "./resumeSchema"

export const dummyResumeData: ResumeFormData = {
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedIn: "https://linkedin.com/in/johndoe",
    portfolio: "https://johndoe.dev",
  },
  professionalSummary:
    "Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable web applications and leading cross-functional teams. Passionate about clean code, agile methodologies, and continuous learning.",
  workExperience: [
    {
      company: "Tech Corp",
      position: "Senior Software Engineer",
      startDate: "2020-01",
      endDate: "",
      current: true,
      description:
        "Led development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored junior developers and conducted code reviews. Technologies: React, Node.js, AWS, Docker, Kubernetes.",
    },
    {
      company: "StartupXYZ",
      position: "Full Stack Developer",
      startDate: "2018-06",
      endDate: "2019-12",
      current: false,
      description:
        "Built and maintained customer-facing web applications using React and Node.js. Collaborated with design team to implement responsive UI components. Optimized database queries improving page load times by 40%.",
    },
    {
      company: "WebDev Agency",
      position: "Frontend Developer",
      startDate: "2017-01",
      endDate: "2018-05",
      current: false,
      description:
        "Developed responsive web applications for various clients. Worked with HTML, CSS, JavaScript, and React. Ensured cross-browser compatibility and accessibility standards.",
    },
  ],
  education: [
    {
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      graduationDate: "2016-05",
    },
  ],
  skills: {
    technical: "JavaScript, TypeScript, React, Node.js, Python, SQL, Git, AWS, Docker, Kubernetes, MongoDB, PostgreSQL",
    soft: "Leadership, Communication, Problem-solving, Teamwork, Agile Methodologies",
  },
}

