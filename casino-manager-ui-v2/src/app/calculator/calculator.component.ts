import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {



  operator = '';
  input = '';
  output = 0;
  constructor() { }

  ngOnInit() {


  }

  pressNum(key) {
    this.input += key;
    console.log(this.input);
  }

  pressOp(key) {
    this.input += key;
    this.operator = key;
  }

  getAnswer() {
    console.log('getAnswer--'+this.input);
    const str = this.input.split(this.operator);
    let result;
    if (this.operator === '+') {
      result = parseInt(str[0], 10) + parseInt(str[1], 10);
    } else if (this.operator === '-') {
      result = parseInt(str[0], 10) - parseInt(str[1], 10);
    } else if (this.operator === '*') {
      result = parseInt(str[0], 10) * parseInt(str[1], 10);
    } else if (this.operator === '/') {
      result = parseInt(str[0], 10) / parseInt(str[1], 10);
    }
    this.output = result;
    this.input = this.output.toString();
    // console.log(this.output);
  }
  clear() {
    this.output = 0;
    this.input = '';
  }






}
