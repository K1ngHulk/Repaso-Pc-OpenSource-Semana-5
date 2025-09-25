import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WantedPerson } from '../../../domain/models/wanted-person.interface';
import { FbiWantedService } from '../../../domain/services/fbi-wanted.service';

@Component({
  selector: 'app-wanted-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './wanted-list.html',
  styleUrl: './wanted-list.css'
})
export class WantedList implements OnInit {
  wantedPersons: WantedPerson[] = [];
  loading = true;
  error: string | null = null;

  constructor(private fbiWantedService: FbiWantedService) {}

  ngOnInit(): void {
    this.loadWantedPersons();
  }

  private loadWantedPersons(): void {
    this.loading = true;
    this.error = null;
    
    this.fbiWantedService.getAllWantedPersons()
      .subscribe({
        next: (persons) => {
          this.wantedPersons = persons;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading wanted persons:', error);
          this.error = error.message || 'Error al cargar la información de personas buscadas';
          this.loading = false;
        }
      });
  }

  getImageUrl(person: WantedPerson): string | null {
    return this.fbiWantedService.getPersonImageUrl(person);
  }

  openDetails(url: string | undefined): void {
    this.fbiWantedService.openOfficialDetails(url);
  }

  formatDate(dateString: string): string {
    return this.fbiWantedService.formatPublicationDate(dateString);
  }

  trackByUid(index: number, person: WantedPerson): string {
    return person.uid;
  }
}
