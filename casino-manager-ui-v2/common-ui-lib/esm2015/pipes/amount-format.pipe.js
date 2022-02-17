import { Pipe } from '@angular/core';
/*
  Pipe that converts value to either whole number or to 2 decimal places
*/
export class AmountFormatPipe {
    transform(value) {
        if (!value) {
            return value;
        }
        value = Number(value);
        if (Math.round(value) === value) {
            value = Math.round(value);
        }
        else if (value) {
            value = value.toFixed(2).replace(/\.0+$/, '');
        }
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}
AmountFormatPipe.decorators = [
    { type: Pipe, args: [{
                name: 'amountFormat'
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1vdW50LWZvcm1hdC5waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbW9uLXVpLXYyL3NyYy9hcHAvcGlwZXMvYW1vdW50LWZvcm1hdC5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxJQUFJLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBRXBEOztFQUVFO0FBTUYsTUFBTSxPQUFPLGdCQUFnQjtJQUMzQixTQUFTLENBQUMsS0FBSztRQUNiLElBQUksQ0FBQyxLQUFLLEVBQUM7WUFDVCxPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxFQUFFO1lBQy9CLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzNCO2FBQU0sSUFBSSxLQUFLLEVBQUU7WUFDaEIsS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBQyxFQUFFLENBQUMsQ0FBQztTQUM5QztRQUNELE9BQU8sS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUVoRSxDQUFDOzs7WUFoQkYsSUFBSSxTQUFDO2dCQUNKLElBQUksRUFBRSxjQUFjO2FBQ3JCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKlxuICBQaXBlIHRoYXQgY29udmVydHMgdmFsdWUgdG8gZWl0aGVyIHdob2xlIG51bWJlciBvciB0byAyIGRlY2ltYWwgcGxhY2VzXG4qL1xuXG5cbkBQaXBlKHtcbiAgbmFtZTogJ2Ftb3VudEZvcm1hdCdcbn0pXG5leHBvcnQgY2xhc3MgQW1vdW50Rm9ybWF0UGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICB0cmFuc2Zvcm0odmFsdWUpOiBzdHJpbmcge1xuICAgIGlmICghdmFsdWUpe1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICB2YWx1ZSA9IE51bWJlcih2YWx1ZSk7XG4gICAgaWYgKE1hdGgucm91bmQodmFsdWUpID09PSB2YWx1ZSkge1xuICAgICAgdmFsdWUgPSBNYXRoLnJvdW5kKHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHZhbHVlKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnRvRml4ZWQoMikucmVwbGFjZSgvXFwuMCskLywnJyk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZS50b1N0cmluZygpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJyk7XG5cbiAgfVxufVxuIl19