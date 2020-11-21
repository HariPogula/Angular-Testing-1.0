import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe("CalculatorService", () => {
  let calService: CalculatorService;
  let loggerSpy: any;

  beforeEach(() => {
    //It will create fake implementaion of logger Service.
    // Generally we do the fale impl. for dependencies.
    loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);
    // This is old way of creating instances. We use test Beds to created dependency injection

    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        { provide: LoggerService, useValue: loggerSpy },
      ],
    });
    // calService = new CalculatorService(loggerSpy);
    calService = TestBed.get(CalculatorService);
  });

  it("Should Add 2 numbers", () => {
    //Setup
    // const logger = new LoggerService();

    // spyOn(logger, "log");

    //Execute
    const addresult = calService.add(1, 2);

    //Assertion
    expect(addresult).toBe(3);
    // We are calling log method in add() for 1 time.
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it("Should Suntract 2 numbers", () => {
    //Execute
    const subResult = calService.subtract(3, 2);

    //Assert
    expect(subResult).toBe(1, "Unexpected Subtract Result");
    // We are calling log method in add() for 1 time.
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
