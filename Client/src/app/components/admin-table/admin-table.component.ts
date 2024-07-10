import { Component, OnInit } from '@angular/core';

interface LabelNumbers {
    value: string;
    viewValue: string;
  }


@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.scss']
})
export class AdminTableComponent implements OnInit {

    numbers: LabelNumbers[] = [
        {value: 'ten', viewValue: '10'},
        {value: 'twenty', viewValue: '20'},
        {value: 'thirty', viewValue: '30'}
      ];

  constructor() { }

  ngOnInit() {
  }

}
