import * as yup from "yup"

// Define the form schema with yup
export const resumeSchema = yup.object({
  personalInfo: yup.object({
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone number is required"),
    location: yup.string().required("Location is required"),
    linkedIn: yup.string().url("Invalid URL").optional(),
    portfolio: yup.string().url("Invalid URL").optional(),
  }),
  professionalSummary: yup
    .string()
    .required("Professional summary is required")
    .min(50, "Summary must be at least 50 characters"),
  workExperience: yup
    .array()
    .of(
      yup.object({
        company: yup.string().required("Company name is required"),
        position: yup.string().required("Position is required"),
        startDate: yup.string().required("Start date is required"),
        endDate: yup.string().optional(),
        current: yup.boolean(),
        description: yup
          .string()
          .required("Job description is required")
          .min(20, "Description must be at least 20 characters"),
      })
    )
    .min(1, "At least one work experience is required"),
  education: yup
    .array()
    .of(
      yup.object({
        institution: yup.string().required("Institution name is required"),
        degree: yup.string().required("Degree is required"),
        field: yup.string().required("Field of study is required"),
        graduationDate: yup.string().required("Graduation date is required"),
      })
    )
    .min(1, "At least one education entry is required"),
  skills: yup.object({
    technical: yup.string().required("Technical skills are required"),
    soft: yup.string().optional(),
  }),
})

export type ResumeFormData = yup.InferType<typeof resumeSchema>

export const STEPS = [
  { id: 1, title: "Personal Information", description: "Your contact details" },
  { id: 2, title: "Professional Summary", description: "Brief overview of your experience" },
  { id: 3, title: "Work Experience", description: "Your work history" },
  { id: 4, title: "Education", description: "Your educational background" },
  { id: 5, title: "Skills", description: "Your technical and soft skills" },
  { id: 6, title: "Review", description: "Review and submit your resume" },
]

export const defaultFormValues: ResumeFormData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    portfolio: "",
  },
  professionalSummary: "",
  workExperience: [
    {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  ],
  education: [
    {
      institution: "",
      degree: "",
      field: "",
      graduationDate: "",
    },
  ],
  skills: {
    technical: "",
    soft: "",
  },
}

