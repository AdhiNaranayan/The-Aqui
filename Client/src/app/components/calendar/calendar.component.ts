import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { OwnerRegisterService } from 'src/app/services/registration/owner-register.service';
import { from, Observable, Subscription } from 'rxjs';
import { LoginManageService } from 'src/app/services/common-services/login-manage.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalCalendarViewComponent } from '../Modals/modal-calendar-view/modal-calendar-view.component';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  currentDate: Date = new Date();
  selectedYear: number;
  AllCategory: any[] = [];
  CustomerCategory: any;
  UserInfo: any;
  events: any[] = [];
  modalReference: BsModalRef;

  CalendarAmounts: any[] = [];
  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Note: JavaScript months are zero-based
  }

  constructor(private cdr: ChangeDetectorRef,
    private OwnerRegister: OwnerRegisterService,
    private LoginService: LoginManageService,
    public ModalService: BsModalService,
    private loadingService: LoadingService,
    private DataPassingService: CategoryDataPassingService,) {
    this.selectedYear = this.currentDate.getFullYear();



    this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
    // this.Service_Loader();
    // this.BusinessService.IndustrySimpleList({ Owner: this.UserInfo.User }).subscribe(response => {
    //   this.IndustryList = response.Response;
    //   setTimeout(() => {
    //     this.FilterFGroup.controls.Industry.updateValueAndValidity();
    //   }, 100);
    // });

    this.subscription.add(
      this.DataPassingService.AllCategory.subscribe(response => {
        this.AllCategory = response;
        if (this.AllCategory.length > 0) {
          this.CustomerCategory = this.AllCategory[0];
          if (this.CustomerCategory === 'Buyer') {
            this.Service_Loader();
          } else if (this.CustomerCategory === 'Seller') {
            this.Service_Loader();
          }
        } else {
          // this.router.navigate(['Customers/Owner']);
        }
      })
    );
  }

  getDaysInMonth(year: number, month: number): number[][] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const weeks: number[][] = [];
    let currentWeek: number[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      currentWeek.push(0); // Placeholder for empty cells before the first day
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      // Add remaining days from the last week
      for (let i = currentWeek.length; i < 7; i++) {
        currentWeek.push(0); // Placeholder for empty cells after the last day
      }
      weeks.push(currentWeek);
    }

    return weeks;
  }

  getFormattedDate(): string {
    return formatDate(this.currentDate, 'MMMM yyyy', 'en-US');
  }

  isToday(day: number): boolean {
    const today = new Date();
    return (
      today.getFullYear() === this.currentDate.getFullYear() &&
      today.getMonth() === this.currentDate.getMonth() &&
      today.getDate() === day
    );
  }

  getSelectableYears(): number[] {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 50; // Change the range as needed
    const endYear = currentYear + 50; // Change the range as needed

    return Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);
  }

  getPreviousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.loadEvents(); // Call the API when changing the month
    this.cdr.detectChanges();
  }

  getNextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.loadEvents(); // Call the API when changing the month
    this.cdr.detectChanges();
  }

  onYearChange(): void {
    this.currentDate.setFullYear(this.selectedYear);
    this.loadEvents(); // Call the API when changing the month
    this.cdr.detectChanges();
  }


  onDateClick(day: number): void {

    const clickedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    // Format date to send in the request
    const formattedDate = formatDate(clickedDate, 'dd-MM-yyyy', 'en-US');

    // Prepare request data
    const requestData = {
      CustomerCategory: this.CustomerCategory,
      CustomerId: this.UserInfo.User,
      DateOfMonth: formattedDate
    };

    // console.log(requestData, 'requestDatarequestData');


    // Call API to get data for the clicked date
    this.OwnerRegister.MonthlyReports(requestData).subscribe(
      (response) => {
        // Handle successful response
        this.CalendarAmounts = response.Response;
        // console.log(this.CalendarAmounts, 'this.CalendarAmountsthis.CalendarAmounts');

        if (this.CalendarAmounts) {
          // Open the modal and pass the API data for the clicked date
          const modalInitialState = {
            Type: 'DefaultPage',
            clickedDate: formattedDate,
            data: this.CalendarAmounts.filter((item: any) => item.Date == formattedDate)
          };

          this.openModal(modalInitialState);
        } else {
          // Handle case where no data received
          console.log('No data received from the API');
        }
      },
      (error) => {
        // Handle API error
        console.error('API Error:', error);
      }
    );
  }

  openModal(initialState: any): void {
    // Open modal popup
    this.modalReference = this.ModalService.show(
      ModalCalendarViewComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-md modal-dialog-centered animated zoomIn' })
    );
    // Subscribe to modal close event
    this.modalReference.content.onClose.subscribe(modalResponse => {
      if (modalResponse.Status) {
        // Update CalendarAmounts if modal response is successful
        this.CalendarAmounts = modalResponse.Response;
      }
    });
  }



  loadEvents(): void {
    this.loadingService.show(); // Show loader
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1; // Note: JavaScript months are zero-based
    const firstDayOfMonth = new Date(year, month - 1, 1); // First day of the month

    const Data = {
      "CustomerCategory": this.CustomerCategory,
      "CustomerId": this.UserInfo.User,
      "DateOfMonth": formatDate(firstDayOfMonth, 'dd-MM-yyyy', 'en-US')
    };

    this.OwnerRegister.MonthlyReports(Data).subscribe(
      (response) => {
        if (response.Status && response.Status === true) {
          // Extract the array of events from the response, or use the entire response if it's an array
          const eventsArray = response.Response || [];
          // After the asynchronous operation completes, hide the loader
          this.loadingService.hide();
          // Process events based on CustomerCategory
          if (this.CustomerCategory === "Buyer") {
            this.events = this.processBuyerEvents(eventsArray);

          } else if (this.CustomerCategory === "Seller") {
            this.events = this.processSellerEvents(eventsArray);
          } else {
            // Handle other CustomerCategory values if needed
            this.events = [];
          }

          // console.log(this.events, 'this.eventsthis.eventsthis.events');
        } else {
          this.events = [];
        }
      },
      (error) => {
        console.error('API Error:', error);
      }
    );
  }

  processBuyerEvents(events: any[]): any[] {
    // Group events by date and calculate total for each date
    const groupedEvents = this.groupEventsByDate(events);

    return groupedEvents;
  }

  processSellerEvents(events: any[]): any[] {
    // Process events for Seller category, adjust logic as needed
    // For example, you might want to display total InvoiceAmount for each date
    const groupedEvents = [];

    events.forEach((event) => {
      const existingGroup = groupedEvents.find((group) => group.Date === event.Date);

      if (existingGroup) {
        existingGroup.InvoiceAmount += event.InvoiceAmount;
      } else {
        const newGroup = {
          Date: event.Date,
          PaymentAmount: event.PaymentAmount,
          InvoiceAmount: event.InvoiceAmount,
          OverDueAmount: event.OverDueAmount,
          DueTodayAmount: event.DueTodayAmount,
          UpComingAmount: event.UpComingAmount,
          Details: [...event.Details]
        };

        groupedEvents.push(newGroup);
      }
    });

    return groupedEvents;
  }


  groupEventsByDate(events: any[]): any[] {
    const groupedEvents = [];

    // Ensure events is an array before trying to iterate over it
    if (Array.isArray(events)) {
      // Group events by date
      events.forEach((event) => {
        const existingGroup = groupedEvents.find((group) => group.Date === event.Date);

        if (existingGroup) {
          // Update existing group with the new event
          existingGroup.Details.push(...event.Details);
          existingGroup.InvoiceAmount += event.InvoiceAmount;
        } else {
          // Create a new group for the date
          const newGroup = {
            Date: event.Date,
            PaymentAmount: event.PaymentAmount,
            InvoiceAmount: event.InvoiceAmount,
            OverDueAmount: event.OverDueAmount,
            DueTodayAmount: event.DueTodayAmount,
            UpComingAmount: event.UpComingAmount,
            Details: [...event.Details]
          };

          groupedEvents.push(newGroup);
        }
      });
    }

    return groupedEvents;
  }

  Service_Loader() {
    this.loadEvents();
  }
  ngOnInit(): void {
  }

}
