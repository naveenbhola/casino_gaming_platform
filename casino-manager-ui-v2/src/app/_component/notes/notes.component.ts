import {Component, EventEmitter, Inject, Input, OnInit, Output, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {CasinomanagerService} from '../../services/casinomanager.service';
import {Subscription} from "rxjs/Rx";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, OnDestroy {
  notes = [];
  newNote;
  // loader = false;
  @Output() sessionNoteSaved = new EventEmitter();
  buttonDisable = false;
  updateManualRatingNotesSub: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              private popUp: MatDialogRef<NotesComponent>,
              private translate: TranslateService,
              private casinoManager: CasinomanagerService) {

    this.notes = this.data.rowDetails.obj.notes;
  }

  ngOnInit() {
  }

  addNote() {
    this.buttonDisable = true;
    const params: any = {
      'note': this.newNote,
      'sessionId': this.data.rowDetails.obj.ratingId,
      'ratingId': this.data.rowDetails.obj.ratingId,
      'user': {'userId': this.data.userId},
      'createDtm': new Date().toISOString()
    };
    this.updateManualRatingNotesSub = this.casinoManager.updateManualRatingNotes(params).subscribe((res) => {
      if (res['successObj']) {
        this.sessionNoteSaved.emit('noteSaved');
      }
      this.close();
      this.buttonDisable = false;
    }, (err) => {
      console.log(err);
    });
  }

  close() {
    this.popUp.close();
  }

  ngOnDestroy() {
    if (this.updateManualRatingNotesSub) {
      this.updateManualRatingNotesSub.unsubscribe();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

}
