import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import {
  COURSES,
  findLessonsForCourse,
  LESSONS,
} from "./../../../../server/db-data";

import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe("CoursesService", () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],

      providers: [CoursesService],
    });

    coursesService = TestBed.get(CoursesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it("should retrieve all courses", () => {
    // When you run npm run server, it will take the data from db-data.ts. So we have to run this command to test this service.
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("No courses returned.");
      expect(courses.length).toBe(12, "Incorrect number of courses");
      const course = courses.find((c) => c.id == 12);
      expect(course.titles.description).toBe("Angular Testing Course");
    });

    // To call the api, we use htpp testing controller
    const req = httpTestingController.expectOne("/api/courses");
    expect(req.request.method).toBe("GET");

    // To pass Test data/ To avoid to call backend directly
    // When we call flush method, it will return that data whenever we subscribe to it.
    req.flush({
      payload: Object.values(COURSES),
    });
  });

  it("should find a course by id", () => {
    coursesService.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toBe("GET");
    req.flush(COURSES[12]);
  });

  it("shoudl save the course data", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };

    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toBe("PUT");
    expect(req.request.body.titles.description).toEqual(
      changes.titles.description
    );

    req.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  it("should fail while saving the course", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };

    coursesService.saveCourse(12, changes).subscribe(
      () => fail("the course operayion is failed."),
      (err: HttpErrorResponse) => {
        expect(err.status).toBe(500);
      }
    );

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toBe("PUT");

    req.flush("Save Course is failed", {
      status: 500,
      statusText: "Internal Server Error",
    });
  });

  it("should find list of lessons based on course id", () => {
    coursesService.findLessons(12).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const req = httpTestingController.expectOne(
      (request) => request.url == "/api/lessons"
    );

    expect(req.request.method).toBe("GET");
    expect(req.request.params.get("courseId")).toEqual("12");
    expect(req.request.params.get("filter")).toEqual("");
    expect(req.request.params.get("sortOrder")).toEqual("asc");
    expect(req.request.params.get("pageNumber")).toEqual("0");
    expect(req.request.params.get("pageSize")).toEqual("3");

    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3),
    });
  });

  afterEach(() => {
    //It will verify whether we call correct api end point ot not.
    httpTestingController.verify();
  });
});
