import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trip-card',
  imports: [RouterLink],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css',
})
export class TripCardComponent {
  @Input() trip: any;
  @Output() deleteTrip = new EventEmitter<string>();

  onDelete(): void {
    if (confirm(`Are you sure you want to delete ${this.trip.name}?`)) {
      this.deleteTrip.emit(this.trip.code);
    }
  }
}