import { Component } from '@angular/core';
export class LoaderComponent {
    constructor() {
    }
    generateFake(count) {
        const indexes = [];
        for (let i = 0; i < count; i++) {
            indexes.push(i);
        }
        return indexes;
    }
}
LoaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-loader',
                template: "<div class=\"skeleton\">\n    <div *ngFor=\"let fake of generateFake(4)\" class=\"card-layout\">\n        <h3></h3>\n        <h4></h4>\n        <p></p>\n    </div>\n</div>\n",
                styles: [".skeleton{padding:0 10%}.skeleton h3,.skeleton h4,.skeleton p{-webkit-animation:loading 1.7s linear infinite;animation:loading 1.7s linear infinite;background:#f6f7f8;background-image:linear-gradient(270deg,#f6f7f8 0,#edeef1 20%,#f6f7f8 40%,#f6f7f8);background-repeat:no-repeat;margin-bottom:5px;width:100%}.skeleton h3{height:22px;width:40%}.skeleton h4{height:18px;width:65%}.skeleton p{height:18px;margin-bottom:50px}@-webkit-keyframes loading{0%{background-position:-100px}to{background-position:200px}}@keyframes loading{0%{background-position:-100px}to{background-position:200px}}"]
            },] }
];
LoaderComponent.ctorParameters = () => [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1vbi11aS12Mi9zcmMvYXBwL2xvYWRlci9sb2FkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFPeEMsTUFBTSxPQUFPLGVBQWU7SUFDeEI7SUFDQSxDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQWE7UUFDdEIsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ25CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNuQjtRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ25CLENBQUM7OztZQWZKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsWUFBWTtnQkFDdEIseUxBQXNDOzthQUV6QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdhcHAtbG9hZGVyJyxcbiAgICB0ZW1wbGF0ZVVybDogJy4vbG9hZGVyLmNvbXBvbmVudC5odG1sJyxcbiAgICBzdHlsZVVybHM6IFsnLi9sb2FkZXIuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBMb2FkZXJDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIGdlbmVyYXRlRmFrZShjb3VudDogbnVtYmVyKTogQXJyYXk8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGluZGV4ZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICBpbmRleGVzLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluZGV4ZXM7XG4gICAgfVxufVxuIl19