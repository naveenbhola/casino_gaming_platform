import { Pipe } from '@angular/core';
export class MinusSignToParenthesisPipe {
    transform(value, args) {
        return value.charAt(0) === '-' ?
            '(' + value.substring(1, value.length) + ')' :
            value;
    }
}
MinusSignToParenthesisPipe.decorators = [
    { type: Pipe, args: [{
                name: 'minussigntoparenthesis'
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWludXNzaWdudG9wYXJlbnRoZXNpcy5waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbW9uLXVpLXYyL3NyYy9hcHAvcGlwZXMvbWludXNzaWdudG9wYXJlbnRoZXNpcy5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBS3BELE1BQU0sT0FBTywwQkFBMEI7SUFFbkMsU0FBUyxDQUFDLEtBQVUsRUFBRSxJQUFVO1FBQzVCLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUM1QixHQUFHLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQzlDLEtBQUssQ0FBQztJQUNkLENBQUM7OztZQVRKLElBQUksU0FBQztnQkFDSixJQUFJLEVBQUUsd0JBQXdCO2FBQy9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AUGlwZSh7XG4gIG5hbWU6ICdtaW51c3NpZ250b3BhcmVudGhlc2lzJ1xufSlcbmV4cG9ydCBjbGFzcyBNaW51c1NpZ25Ub1BhcmVudGhlc2lzUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuXG4gICAgdHJhbnNmb3JtKHZhbHVlOiBhbnksIGFyZ3M/OiBhbnkpOiBhbnkge1xuICAgICAgICByZXR1cm4gdmFsdWUuY2hhckF0KDApID09PSAnLScgP1xuICAgICAgICAgICAgJygnICsgdmFsdWUuc3Vic3RyaW5nKDEsIHZhbHVlLmxlbmd0aCkgKyAnKScgOlxuICAgICAgICAgICAgdmFsdWU7XG4gICAgfVxuXG59XG4iXX0=