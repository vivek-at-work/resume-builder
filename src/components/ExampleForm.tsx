"use client"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Define the form schema with yup
const formSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  age: yup
    .number()
    .required("Age is required")
    .positive("Age must be positive")
    .integer("Age must be an integer")
    .min(18, "Must be at least 18 years old")
    .max(100, "Age must be less than 100"),
})

type FormData = yup.InferType<typeof formSchema>

export function ExampleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
  })

  const onSubmit = (data: FormData) => {
    console.log("Form data:", data)
    alert(`Form submitted!\n\nName: ${data.name}\nEmail: ${data.email}\nAge: ${data.age}`)
    reset()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Form Example</CardTitle>
        <CardDescription>
          React Hook Form with Yup validation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter your name"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              {...register("age", { valueAsNumber: true })}
              placeholder="Enter your age"
              className={errors.age ? "border-destructive" : ""}
            />
            {errors.age && (
              <p className="text-sm text-destructive">{errors.age.message}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Submit
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

