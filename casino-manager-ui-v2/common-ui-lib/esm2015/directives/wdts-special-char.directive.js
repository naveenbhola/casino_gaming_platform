import { Directive, ElementRef, EventEmitter, HostListener, Output, Input } from '@angular/core';
export class WdtsSpecialCharDirective {
    constructor(_el) {
        this._el = _el;
        // SPECIAL CHAR allowed alphanumeric characters with hyphen, underscore, space, ampersand and dot (- , _ , . , &)
        this.valChangeEvent = new EventEmitter();
        this.onlyAlphaNumaric = false;
        this.isLimitTabSpecialChar = false;
    }
    onInputChange(event) {
        let SPLCHARSREJX;
        if (this.onlyAlphaNumaric) {
            SPLCHARSREJX = new RegExp('[^A-Za-z0-9]', 'gi');
        }
        else if (this.isLimitTabSpecialChar) {
            // Stroy GR-3445: removing '&' character.
            SPLCHARSREJX = new RegExp('[^A-Za-z0-9-_.,$ ]', 'gi');
        }
        else {
            // Stroy GR-3092: removing '&' character.
            SPLCHARSREJX = new RegExp('[^A-Za-z0-9-_. ]', 'gi');
        }
        this._el.nativeElement.value = this._el.nativeElement.value.replace(SPLCHARSREJX, '');
        this.valChangeEvent.emit(this._el.nativeElement.value);
    }
}
WdtsSpecialCharDirective.decorators = [
    { type: Directive, args: [{
                selector: '[appWdtsSpecialChar]'
            },] }
];
WdtsSpecialCharDirective.ctorParameters = () => [
    { type: ElementRef }
];
WdtsSpecialCharDirective.propDecorators = {
    valChangeEvent: [{ type: Output }],
    onlyAlphaNumaric: [{ type: Input }],
    isLimitTabSpecialChar: [{ type: Input }],
    onInputChange: [{ type: HostListener, args: ['input', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2R0cy1zcGVjaWFsLWNoYXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbW9uLXVpLXYyL3NyYy9hcHAvZGlyZWN0aXZlcy93ZHRzLXNwZWNpYWwtY2hhci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBSy9GLE1BQU0sT0FBTyx3QkFBd0I7SUFLakMsWUFBb0IsR0FBZTtRQUFmLFFBQUcsR0FBSCxHQUFHLENBQVk7UUFKdkMsaUhBQWlIO1FBQ25HLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNyQyxxQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDekIsMEJBQXFCLEdBQUcsS0FBSyxDQUFDO0lBRXZDLENBQUM7SUFFRCxhQUFhLENBQUMsS0FBSztRQUNmLElBQUksWUFBWSxDQUFDO1FBQ2pCLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3ZCLFlBQVksR0FBRyxJQUFJLE1BQU0sQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDbkQ7YUFBTSxJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtZQUNuQyx5Q0FBeUM7WUFDekMsWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3pEO2FBQU07WUFDSCx5Q0FBeUM7WUFDekMsWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3ZEO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3RGLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNELENBQUM7OztZQXhCSixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjthQUNqQzs7O1lBSmtCLFVBQVU7Ozs2QkFPeEIsTUFBTTsrQkFDTixLQUFLO29DQUNMLEtBQUs7NEJBR0wsWUFBWSxTQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEhvc3RMaXN0ZW5lciwgT3V0cHV0LCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1thcHBXZHRzU3BlY2lhbENoYXJdJ1xufSlcbmV4cG9ydCBjbGFzcyBXZHRzU3BlY2lhbENoYXJEaXJlY3RpdmUge1xuLy8gU1BFQ0lBTCBDSEFSIGFsbG93ZWQgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMgd2l0aCBoeXBoZW4sIHVuZGVyc2NvcmUsIHNwYWNlLCBhbXBlcnNhbmQgYW5kIGRvdCAoLSAsIF8gLCAuICwgJilcbiAgICBAT3V0cHV0KCkgdmFsQ2hhbmdlRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgQElucHV0KCkgb25seUFscGhhTnVtYXJpYyA9IGZhbHNlO1xuICAgIEBJbnB1dCgpIGlzTGltaXRUYWJTcGVjaWFsQ2hhciA9IGZhbHNlO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsOiBFbGVtZW50UmVmKSB7XG4gICAgfVxuICAgIEBIb3N0TGlzdGVuZXIoJ2lucHV0JywgWyckZXZlbnQnXSlcbiAgICBvbklucHV0Q2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIGxldCBTUExDSEFSU1JFSlg7XG4gICAgICAgIGlmICh0aGlzLm9ubHlBbHBoYU51bWFyaWMpIHtcbiAgICAgICAgICAgIFNQTENIQVJTUkVKWCA9IG5ldyBSZWdFeHAoJ1teQS1aYS16MC05XScsICdnaScpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNMaW1pdFRhYlNwZWNpYWxDaGFyKSB7XG4gICAgICAgICAgICAvLyBTdHJveSBHUi0zNDQ1OiByZW1vdmluZyAnJicgY2hhcmFjdGVyLlxuICAgICAgICAgICAgU1BMQ0hBUlNSRUpYID0gbmV3IFJlZ0V4cCgnW15BLVphLXowLTktXy4sJCBdJywgJ2dpJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBTdHJveSBHUi0zMDkyOiByZW1vdmluZyAnJicgY2hhcmFjdGVyLlxuICAgICAgICAgICAgU1BMQ0hBUlNSRUpYID0gbmV3IFJlZ0V4cCgnW15BLVphLXowLTktXy4gXScsICdnaScpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSB0aGlzLl9lbC5uYXRpdmVFbGVtZW50LnZhbHVlLnJlcGxhY2UoU1BMQ0hBUlNSRUpYLCAnJyk7XG4gICAgICAgIHRoaXMudmFsQ2hhbmdlRXZlbnQuZW1pdCh0aGlzLl9lbC5uYXRpdmVFbGVtZW50LnZhbHVlKTtcbiAgICB9XG5cbn1cbiJdfQ==