import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CoursesCardListComponent } from "./courses-card-list.component";
import { CoursesModule } from "../courses.module";
import { COURSES } from "../../../../server/db-data";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { sortCoursesBySeqNo } from "../home/sort-course-by-seq";
import { Course } from "../model/course";
import { setupCourses } from "../common/setup-test-data";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  // aync is imported from angular testing library.
  // We are using promises (.then()) to compile the components.
  //So, the test cases (it()) will execute before compiling the components and test cases wiil be failed.
  // To avoid that, we async() [It will end at beforeeach()]
  // async() will wait till all the async operations completed. So, after compilation of components, the test cases will be executed.

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
    console.log(component);
  });

  it("should display the course list", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    console.log(el.nativeElement.outerHTML);
    const cards = el.queryAll(By.css(".course-card"));
    expect(cards).toBeTruthy("Could not find cards");
    expect(cards.length).toBe(12, "Unexpeced error while loading cards.");
  });

  it("should display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    const course = component.courses[0];
    const card = el.query(By.css(".course-card:first-child"));
    const title = card.query(By.css("mat-card-title"));
    const image = card.query(By.css("img"));

    expect(card).toBeTruthy("Could not load first card");
    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);
  });
});
