import { Component, OnInit, signal } from '@angular/core';
import { TripDataService } from '../trip-data.service';
import { TripCardComponent } from '../trip-card/trip-card.component';

@Component({
  selector: 'app-trip-listing',
  imports: [TripCardComponent],
  templateUrl: './trip-listing.component.html',
  styleUrl: './trip-listing.component.css',
})
export class TripListingComponent implements OnInit {
  trips = signal<any[]>([]);

  constructor(private tripDataService: TripDataService) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.tripDataService.getTrips().subscribe({
      next: (data: any) => {
        this.trips.set(data);
      },
      error: (error) => {
        console.error('Error fetching trips:', error);
      }
    });
  }

  onDeleteTrip(code: string): void {
    this.tripDataService.deleteTrip(code).subscribe({
      next: () => {
        this.loadTrips();
      },
      error: (error) => {
        console.error('Error deleting trip:', error);
      }
    });
  }
}