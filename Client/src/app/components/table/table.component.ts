import { Component, OnInit } from '@angular/core';

interface LabelNumbers {
    value: string;
    viewValue: string;
  }



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

    title = 'Client';
    numbers: LabelNumbers[] = [
      {value: 'ten', viewValue: '10'},
      {value: 'twenty', viewValue: '20'},
      {value: 'thirty', viewValue: '30'}
    ];

  constructor() { }

  ngOnInit() {
  }

}
