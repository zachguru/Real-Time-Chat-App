import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackbar: MatSnackBar) { }

  showSnackbar(message: string, isError: boolean): void {
    const config: MatSnackBarConfig = {
      duration: 2000,
      panelClass: isError ? ['error-snackbar'] : ['ok-snackbar'],
      verticalPosition: 'top'
    };

    this.snackbar.open(message, '', config);
  }
}
