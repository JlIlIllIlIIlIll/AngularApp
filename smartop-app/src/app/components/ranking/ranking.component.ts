import { Component, OnInit } from '@angular/core';
import { InterventionService } from 'src/app/services/intervention.service';
import { debounce } from 'lodash';
import { Observable, of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

// Définition de l'interface Ranking pour les données du chirurgien
interface Ranking {
  surgeon: string;
  specialty: string;
  numInterventions: number;
  favoriteAnesthetist: string;
  favoriteNurse: string;
  frequentRoom: string;
  frequentProcedure: string;
}

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css'],
})
export class RankingComponent implements OnInit {
  // Définition des colonnes qui seront affichées dans le tableau
  displayedColumns: string[] = [
    'surgeon',
    'specialty',
    'numInterventions',
    'favoriteAnesthetist',
    'favoriteNurse',
    'frequentRoom',
    'frequentProcedure',
  ];

  // Initialisation du tableau qui contiendra les données
  ranking: Ranking[] = [];

  // Initialisation des variables de pagination
  page = 1;
  limit = 10;

  // Sauvegarde des données complètes pour le filtrage
  completeRanking: Ranking[] = [];

  constructor(private interventionService: InterventionService) {} // Injection du service

  ngOnInit(): void {
    // Chargement des données initiales au chargement du composant
    this.loadMoreData();
  }

  // Fonction pour charger plus de données
  loadMoreData(): void {
    this.interventionService.getSurgeonRanking(this.page, this.limit).subscribe(
      (data: Ranking[]) => {
        // Ajout des nouvelles données au tableau et incrément de la page
        this.ranking = this.ranking.concat(data);
        this.completeRanking = this.ranking;
        this.page++;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // Fonction appelée lors de l'événement de défilement
  onScroll(): void {
    this.loadMoreData();
  }

  // Fonction pour appliquer le filtre
  applyFilter = debounce((event: Event) => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ranking = this.completeRanking.filter((profile) =>
      profile.surgeon.toLowerCase().includes(filterValue.trim().toLowerCase())
    );
  }, 300);
}
