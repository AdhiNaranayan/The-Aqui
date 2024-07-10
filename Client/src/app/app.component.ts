import { Component, HostListener, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LANGUAGE_DICTIONARY } from './dataCollection/languageDictionary';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Routes } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { LoginManageService } from './services/common-services/login-manage.service';
import { ToastrService } from './services/common-services/toastr.service';
import { Subscription } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { CategoryDataPassingService } from 'src/app/services/common-services/category-data-passing.service';
import { OwnerRegisterService } from './services/registration/owner-register.service';
import { SocketManagementService } from './services/socket-management/socket-management.service';
import { NotificationsService } from './services/common-services/notifications.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LogoutModalComponent } from './components/Modals/logout-modal/logout-modal.component';
import { SamplePopupComponent } from './components/Modals/sample-popup/sample-popup.component';
import { ModalNotificationDetailedViewComponent } from './components/Modals/modal-notification-detailed-view/modal-notification-detailed-view.component';
import { Observable } from 'rxjs';
import { Data } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  pageTitle$: Observable<string>;
  navItems: { name: string, link: string }[] = [];


  private dictionary = LANGUAGE_DICTIONARY;

  currentLan = 'English';
  sessionLan: any;

  //  @ViewChild('SideNav', { static: true }) SideNav: MatSidenav;
  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  @ViewChild('SideNav') SideNav: MatSidenav;

  showGroup = true;
  User_Name: any;
  UserLoggedIn: boolean;
  UserInfo: any;
  ToastrList: any[] = [];
  Notification: any[] = [];
  ShowNotifyPanel = false;
  NotifyCount = 0;
  NotifyCountLength = 0;
  ShowNotification = false;
  NotificationDetails: any[] = [];
  showFiller = false;
  opened = true;
  over = 'side';
  expandHeight = '42px';
  modalReference: BsModalRef;
  collapseHeight = '15px';
  displayMode = 'flat';
  AllCategory: any[] = [];
  CustomerProfile: any;
  File_Name: any;
  innerWidth: any;
  SideNameMode = 'side';
  currentPageTitle: string = '';
  showIcons: boolean = false;
  currentRoute: string;


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 992) {
      this.SideNameMode = 'over'
    } else {
      this.SideNameMode = 'side';
    }
  }



  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private LoginService: LoginManageService,
    public Toastr: ToastrService,
    public NotificationsService: NotificationsService,
    public Socket: SocketManagementService,
    public OwnerRegister: OwnerRegisterService,
    private DataPassingService: CategoryDataPassingService,
    public ModalService: BsModalService,
    @Inject(DOCUMENT) private document: Document) {

      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.urlAfterRedirects;
        }
      });
    const Lan = localStorage.getItem('lan');
    if (Lan !== undefined && Lan !== '') {
      this.currentLan = Lan;
    }
    // Find Page Url
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/web-login' || event.url === '/' || event.url === '/registration') {
          this.UserLoggedIn = false;
        } else {
          this.UserInfo = JSON.parse(this.LoginService.LoginUser_Info());
          this.UserLoggedIn = true;
          this.ShowNotification = true;
          this.OwnerRegister.CustomerProfileDetails({ CustomerId: this.UserInfo.User }).subscribe(response => {
            if (response.Status && response.Status === true) {
              this.CustomerProfile = response.Response;
              this.CustomerProfile.NotificationLen = this.NotifyCount;
              if (this.CustomerProfile.File_Name !== '') {
                this.CustomerProfile.Img = true;
              } else {
                this.CustomerProfile.Img = false;
              }
              this.File_Name = 'http://localhost:3002/Uploads/Customer_Profile/' + this.CustomerProfile.File_Name;
              // this.File_Name = 'http://aquila-client.pptssolutions.com/Uploads/Customer_Profile/' + this.CustomerProfile.File_Name;
              if (this.CustomerProfile.length > 0) {
                //refer modal-invoice.comp
                // this.CustomerProfile.InvoiceAttachments.map(obj => {
                // this.getBase64ImageFromUrl(DevURL + obj.fileName, obj.fileName, function (dataUrl) { });
                // });
              }
            } else {
              this.CustomerProfile = null;
            }
          });
          if (this.UserInfo.CustomerCategory === 'Seller') {
            this.AllCategory = ['Seller'];
            this.DataPassingService.UpdateAllCategoryData(this.AllCategory);
          } else if (this.UserInfo.CustomerCategory === 'Buyer') {
            this.AllCategory = ['Buyer'];
            this.DataPassingService.UpdateAllCategoryData(this.AllCategory);
          } else if (this.UserInfo.CustomerCategory === 'BothBuyerAndSeller') {
            if (this.AllCategory.length === 0) {
              this.AllCategory = ['Seller'];
              this.DataPassingService.UpdateAllCategoryData(this.AllCategory);
            }
          }
        }
      }
    });



    // Toastr Message
    this.Toastr.WaitingToastr.subscribe(Message => {
      setTimeout(() => {
        this.ToastrList.push(Message);
        this.RefreshToastrPosition();
        setTimeout(() => {
          this.ToastrList.splice(0, 1);
          this.RefreshToastrPosition();
        }, 3000);
      }, 100);
    });
  }


  ngOnInit() {
    this.navItems = this.getNavItems(this.router.config);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Adjust this condition based on your actual dashboard route
      this.showIcons = event.urlAfterRedirects === '/dashboard';
    });


    this.pageTitle$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data),
      map(data => data.title)
    );

    this.GetNotificationCount();
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 991) {
      this.SideNameMode = 'over'
    } else {
      this.SideNameMode = 'side';
    }

  }

  private getNavItems(routes: Routes): { name: string, link: string }[] {
    const navItems: { name: string, link: string }[] = [];
    routes.forEach(route => {
      if (route.data && route.data.title && route.path) {
        navItems.push({ name: route.data.title, link: `/${route.path}` });
      }
    });
    return navItems;
  }

  isActive(link: string): boolean {
    return this.router.isActive(link, true);
  }

  SideNavToggle() {
    if (this.SideNav.opened) {
      this.SideNav.close();
      sessionStorage.setItem('NavOpen', 'No');
    } else {
      this.SideNav.open();
      sessionStorage.setItem('NavOpen', 'Yes');
    }
  }

  changeLan(lan: string) {
    const previousLan = sessionStorage.getItem('lan');
    if (this.sessionLan !== lan) {
      sessionStorage.setItem('lan', lan);
      this.sessionLan = lan;
      this.currentLan = this.dictionary[lan].language;
      this.document.location.reload();
    }
  }

  LogOut() {
    const initialState = { 'type': 'Create' } as Partial<LogoutModalComponent>;
    this.modalReference = this.ModalService.show(
      LogoutModalComponent,
      {
        initialState,
        ignoreBackdropClick: true,
        class: 'modal-md modal-dialog-centered animated zoomIn'
      }
    );
    this.modalReference.content.onClose.subscribe(response => {
      // Add your logout logic here
      // For example:
      // localStorage.removeItem('SessionVerifyWeb');
      // localStorage.removeItem('SessionWeb');
      // localStorage.removeItem('SessionKeyWeb');
      // location.reload();
      // this.router.navigate(['/web-login']);
    });
  }






  HideToastr(index) {
    this.ToastrList[index].Type = 'Hidden';
    this.RefreshToastrPosition();
  }

  RefreshToastrPosition() {
    let Count = 0;
    this.ToastrList.map(toastr => {
      if (toastr.Type !== 'Hidden') {
        toastr.Top = Count * 80 + 10; Count = Count + 1;
      }
    });
  }

  SelectedTab(Data: any) {

    if (Data.heading === 'Seller') {
      this.AllCategory = [];
      this.AllCategory = ['Seller'];
      this.DataPassingService.UpdateAllCategoryData(this.AllCategory);
      this.router.navigate(['dashboard']);
    } else if (Data.heading === 'Buyer') {
      this.AllCategory = [];
      this.AllCategory = ['Buyer'];
      this.DataPassingService.UpdateAllCategoryData(this.AllCategory);
      // window.location.reload();
      this.router.navigate(['dashboard']);
    }
  }




  NotifyPanelToggle() {
    this.ShowNotifyPanel = !this.ShowNotifyPanel;
    this.GetNotificationList();
  }

  GetNotificationCount() {
    if (this.AllCategory[0] === 'Seller') {
      const data = { Customer: this.UserInfo.User, CustomerCategory: 'Seller' };
      this.NotificationsService.NotificationList(data).subscribe(NewResponse => {
        this.NotifyCount = NewResponse.NotificationCounts;
      });
    } else if (this.AllCategory[0] === 'Buyer') {
      const data = { Customer: this.UserInfo.User, CustomerCategory: 'Buyer' };
      this.NotificationsService.NotificationList(data).subscribe(NewResponse => {
        this.NotifyCount = NewResponse.NotificationCounts;
      });
    }

  }

  GetNotificationList() {
    if (this.AllCategory[0] === 'Seller') {
      const data = { Customer: this.UserInfo.User, CustomerCategory: 'Seller' };
      this.NotificationsService.NotificationList(data).subscribe(NewResponse => {
        if (NewResponse) {
          this.Notification = NewResponse.Response;
          if (NewResponse) {
            this.NotifyCount = NewResponse.NotificationCounts;
          } else {
            this.NotifyCount = 0;
          }
        } else {
          this.Notification = [];
        }
      });
    } else if (this.AllCategory[0] === 'Buyer') {
      const data = { Customer: this.UserInfo.User, CustomerCategory: 'Buyer' };
      this.NotificationsService.NotificationList(data).subscribe(NewResponse => {
        if (NewResponse) {
          this.Notification = NewResponse.Response;
          if (NewResponse) {
            this.NotifyCount = NewResponse.NotificationCounts;
          } else {
            this.NotifyCount = 0;
          }
        } else {
          this.Notification = [];
        }
      });
    }
  }

  // GetNotifyCount() {
  //   const data = { User: this.UserInfo._id };
  //   this.NotificationsService.NotificationList(data).subscribe(CountResponse => {
  //     console.log(CountResponse, 'CountResponseCountResponseCountResponse');
  //     if (CountResponse.Status) {
  //       this.NotifyCount = CountResponse.Response;
  //     } else {
  //       this.NotifyCount = 0;
  //     }
  //   });
  // }

  DeleteAllRead() {
    if (this.AllCategory[0] === 'Seller') {
      const data = { Customer: this.UserInfo.User, CustomerCategory: 'Seller' };
      this.NotificationsService.Delete_All_Notifications_List(data).subscribe(NewResponse => {
        if (NewResponse) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: NewResponse.Message });
          this.Notification = NewResponse.Response;
          this.NotifyPanelToggle();
        } else {
          this.Toastr.NewToastrMessage({ Type: 'Warning', Message: 'Some Occurred error' });
          this.Notification = [];
        }
      });
    } else if (this.AllCategory[0] === 'Buyer') {
      const data = { Customer: this.UserInfo.User, CustomerCategory: 'Buyer' };
      this.NotificationsService.Delete_All_Notifications_List(data).subscribe(NewResponse => {
        if (NewResponse) {
          this.Toastr.NewToastrMessage({ Type: 'Success', Message: NewResponse.Message });
          this.Notification = NewResponse.Response;
          this.NotifyPanelToggle();
        } else {
          this.Toastr.NewToastrMessage({ Type: 'Warning', Message: 'Some Occurred error' });
          this.Notification = [];
        }
      });
    } else {
      this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Some Occurred error' });
    }


  }

  // MarkAllAsRead() {
  //   // console.log(this.UserInfo, 'this.UserInfothis.UserInfo');

  //   const data = { Customer: this.UserInfo.User, CustomerCategory: 'Seller' };
  //   // console.log(data, 'datadatadata');

  //   this.NotificationsService.Read_All_Notifications_List(data).subscribe(NewResponse => {
  //     // console.log(NewResponse, 'NewResponseNewResponse');
  //     // return;

  //     if (NewResponse.Status) {
  //       this.Toastr.NewToastrMessage({ Type: 'Success', Message: NewResponse.Message });
  //       this.Notification = NewResponse.Response;
  //       // this.GetNotifyCount();
  //       this.GetNotificationList();
  //     } else {
  //       this.Toastr.NewToastrMessage({ Type: 'Warning', Message: 'Some Occurred error' });
  //       this.Notification = [];
  //     }
  //   });
  // }

  MarkAllAsRead() {
    const data = { Customer: this.UserInfo.User, CustomerCategory: 'Seller' };
    this.NotificationsService.Read_All_Notifications_List(data).subscribe((NewResponse: any) => {
      if (NewResponse) {
        this.Toastr.NewToastrMessage({ Type: 'Success', Message: NewResponse.Message });
        this.GetNotificationList();
      } else {
        this.Toastr.NewToastrMessage({ Type: 'Warning', Message: 'Some error occurred' });
      }
    },
      (error) => {
        console.error('Error while marking all notifications as read:', error);
      }
    );
  }

  // Define the method to handle message click
  handleMessageClick(notification: any) {
    // Perform any actions you want when a message is clicked
    const initialState = {
      Type: 'DefaultPage',
      NotificationDetails: notification
    };


    this.modalReference = this.ModalService.show(ModalNotificationDetailedViewComponent,
      Object.assign({ initialState }, { ignoreBackdropClick: true, class: 'modal-lg modal-dialog-centered animated zoomIn' }));
    this.modalReference.content.onClose.subscribe(response => {

      if (response.Status) {
        this.NotificationDetails[notification] = response.Response;
      }
    });
  }

  MarkasRead(_id: any) {
    const data = { User: this.UserInfo._id, Notification: this.Notification };
    alert('hiiii');
    console.log(data);

    this.NotificationsService.Notification_Update(data).subscribe(NewResponse => {
      if (NewResponse.Status) {
        this.Toastr.NewToastrMessage({ Type: 'Success', Message: NewResponse.Message });
        this.Notification = NewResponse.Response;
        // this.GetNotifyCount();
        this.GetNotificationList();
      } else {
        this.Toastr.NewToastrMessage({ Type: 'Warning', Message: 'Some Occurred error' });
        this.Notification = [];
      }
    });
  }

}
function switchMap(arg0: () => Observable<import("@angular/router").Data>): import("rxjs").OperatorFunction<import("@angular/router").Event, unknown> {
  throw new Error('Function not implemented.');
}

