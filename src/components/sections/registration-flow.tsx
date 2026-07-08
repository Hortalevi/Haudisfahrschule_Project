"use client";

import { useRef } from "react";
import type { Course } from "@/content/courses";
import type { CourseDate } from "@/content/course-dates";
import { CourseDateList } from "@/components/sections/course-date-list";
import { RegistrationForm, type RegistrationFormHandle } from "@/components/sections/registration-form";

export function RegistrationFlow({ dates, courses }: { dates: CourseDate[]; courses: Course[] }) {
  const formRef = useRef<RegistrationFormHandle>(null);

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
      <CourseDateList dates={dates} courses={courses} onSelect={(id) => formRef.current?.setCourseDate(id)} />
      <div className="lg:sticky lg:top-24 lg:self-start">
        <RegistrationForm ref={formRef} dates={dates} />
      </div>
    </div>
  );
}
