import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { WdtsSpecialCharDirective } from '../directives/wdts-special-char.directive';
import { WdtsSpecialCharPipe } from '../pipes/wdts-special-char.pipe';
import { AmountFormatPipe } from '../pipes/amount-format.pipe';
import { RoundUpPipe } from "../pipes/round-up.pipe";
export class CommonTranslationModule {
}
CommonTranslationModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    TranslateModule.forRoot({
                        loader: {
                            provide: TranslateLoader,
                            useFactory: TranslationFactory,
                            deps: [HttpClient]
                        }
                    })
                ],
                providers: [WdtsSpecialCharPipe, AmountFormatPipe, RoundUpPipe],
                declarations: [WdtsSpecialCharDirective, WdtsSpecialCharPipe, AmountFormatPipe, RoundUpPipe],
                exports: [TranslateModule, WdtsSpecialCharDirective, WdtsSpecialCharPipe, AmountFormatPipe, RoundUpPipe]
            },] }
];
export function TranslationFactory(http) {
    return new TranslateHttpLoader(http);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLXRyYW5zbGF0aW9uLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1vbi11aS12Mi9zcmMvYXBwL2NvbW1vbi10cmFuc2xhdGlvbi9jb21tb24tdHJhbnNsYXRpb24ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDaEQsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDL0QsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUFDbkYsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFDcEUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBZ0JuRCxNQUFNLE9BQU8sdUJBQXVCOzs7WUFkbkMsUUFBUSxTQUFDO2dCQUNOLE9BQU8sRUFBRTtvQkFDTCxlQUFlLENBQUMsT0FBTyxDQUFDO3dCQUNwQixNQUFNLEVBQUU7NEJBQ0osT0FBTyxFQUFFLGVBQWU7NEJBQ3hCLFVBQVUsRUFBRSxrQkFBa0I7NEJBQzlCLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQzt5QkFDckI7cUJBQ0osQ0FBQztpQkFDTDtnQkFDRCxTQUFTLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLENBQUM7Z0JBQy9ELFlBQVksRUFBRSxDQUFDLHdCQUF3QixFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixFQUFFLFdBQVcsQ0FBQztnQkFDNUYsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLHdCQUF3QixFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixFQUFFLFdBQVcsQ0FBQzthQUMzRzs7QUFJRCxNQUFNLFVBQVUsa0JBQWtCLENBQUMsSUFBZ0I7SUFDL0MsT0FBTyxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7VHJhbnNsYXRlTG9hZGVyLCBUcmFuc2xhdGVNb2R1bGV9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xuaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge1RyYW5zbGF0ZUh0dHBMb2FkZXJ9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2h0dHAtbG9hZGVyJztcbmltcG9ydCB7V2R0c1NwZWNpYWxDaGFyRGlyZWN0aXZlfSBmcm9tICcuLi9kaXJlY3RpdmVzL3dkdHMtc3BlY2lhbC1jaGFyLmRpcmVjdGl2ZSc7XG5pbXBvcnQge1dkdHNTcGVjaWFsQ2hhclBpcGV9IGZyb20gJy4uL3BpcGVzL3dkdHMtc3BlY2lhbC1jaGFyLnBpcGUnO1xuaW1wb3J0IHtBbW91bnRGb3JtYXRQaXBlfSBmcm9tICcuLi9waXBlcy9hbW91bnQtZm9ybWF0LnBpcGUnO1xuaW1wb3J0IHtSb3VuZFVwUGlwZX0gZnJvbSBcIi4uL3BpcGVzL3JvdW5kLXVwLnBpcGVcIjtcblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIFRyYW5zbGF0ZU1vZHVsZS5mb3JSb290KHtcbiAgICAgICAgICAgIGxvYWRlcjoge1xuICAgICAgICAgICAgICAgIHByb3ZpZGU6IFRyYW5zbGF0ZUxvYWRlcixcbiAgICAgICAgICAgICAgICB1c2VGYWN0b3J5OiBUcmFuc2xhdGlvbkZhY3RvcnksXG4gICAgICAgICAgICAgICAgZGVwczogW0h0dHBDbGllbnRdXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgXSxcbiAgICBwcm92aWRlcnM6IFtXZHRzU3BlY2lhbENoYXJQaXBlLCBBbW91bnRGb3JtYXRQaXBlLCBSb3VuZFVwUGlwZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbV2R0c1NwZWNpYWxDaGFyRGlyZWN0aXZlLCBXZHRzU3BlY2lhbENoYXJQaXBlLCBBbW91bnRGb3JtYXRQaXBlLCBSb3VuZFVwUGlwZV0sXG4gICAgZXhwb3J0czogW1RyYW5zbGF0ZU1vZHVsZSwgV2R0c1NwZWNpYWxDaGFyRGlyZWN0aXZlLCBXZHRzU3BlY2lhbENoYXJQaXBlLCBBbW91bnRGb3JtYXRQaXBlLCBSb3VuZFVwUGlwZV1cbn0pXG5leHBvcnQgY2xhc3MgQ29tbW9uVHJhbnNsYXRpb25Nb2R1bGUge1xufVxuXG5leHBvcnQgZnVuY3Rpb24gVHJhbnNsYXRpb25GYWN0b3J5KGh0dHA6IEh0dHBDbGllbnQpIHtcbiAgICByZXR1cm4gbmV3IFRyYW5zbGF0ZUh0dHBMb2FkZXIoaHR0cCk7XG59XG4iXX0=