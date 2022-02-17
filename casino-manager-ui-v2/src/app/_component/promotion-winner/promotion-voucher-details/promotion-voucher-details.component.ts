import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CasinomanagerService} from '../../../services/casinomanager.service';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from "rxjs/Rx";

@Component({
  selector: 'app-promotion-voucher-details',
  templateUrl: 'promotion-voucher-details.component.html',
  styleUrls: ['./promotion-voucher-details.component.scss']
})
export class PromotionVoucherDetailsComponent implements OnInit, OnDestroy {
  tableHeaders = [];
  totalRecords = 0;
  loading = true
  voucherTitle;
  promotionVoucherDetailsList = [];

  // Subscribers
  promoVoucherDetailsSub: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              private dialogRef: MatDialogRef<PromotionVoucherDetailsComponent>,
              private casinoManagerService: CasinomanagerService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.voucherTitle = 'Voucher ID ' + this.data.voucherId;//this.translate.instant('') + this.data.voucherId
    this.initTableHeader();
    this.getVoucherDetails();
  }

  getVoucherDetails() {
    this.loading = true;
    //console.log('this.data.voucherId::', this.data.voucherId);
    const req = {
      params: {
        voucherId: this.data.voucherId
      }
    };
    this.promoVoucherDetailsSub = this.casinoManagerService.getPromotionVoucherDetails(req).subscribe((res: any) => {
      this.promotionVoucherDetailsList = res;
      this.totalRecords = this.promotionVoucherDetailsList.length;
      this.loading = false;
    }, error1 => {
      console.log(error1);
      this.totalRecords = 0;
      this.promotionVoucherDetailsList = [];
    });
  }

  initTableHeader() {
    this.tableHeaders = [
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.VOUCHER_ID',
        type: 'text_no_translation',
        row: 'voucherId'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.PRINT_DATE_TIME',
        type: 'date',
        dateFormat: 'dd-MMM-yyyy HH:mm:ss',
        row: 'printTime'
      },
      {
        title: 'application.app.CASINO_MGR_LABELS.PROMOTION_WINNER.PRINTED_BY',
        type: 'text_no_translation',
        row: 'printedBy'
      },
    ];
  }

  closeDialogBox(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.promoVoucherDetailsSub) {
      this.promoVoucherDetailsSub.unsubscribe();
    }
  }
}
