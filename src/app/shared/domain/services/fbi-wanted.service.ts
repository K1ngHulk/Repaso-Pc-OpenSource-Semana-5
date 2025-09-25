import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { FBIApiResponse, WantedPerson } from '../models/wanted-person.interface';

@Injectable({
  providedIn: 'root'
})
export class FbiWantedService {
  private readonly API_BASE_URL = 'https://api.fbi.gov/wanted/v1';
  private readonly RETRY_COUNT = 2;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista completa de personas buscadas por el FBI
   * @returns Observable con array de personas buscadas
   */
  getAllWantedPersons(): Observable<WantedPerson[]> {
    return this.http.get<FBIApiResponse>(`${this.API_BASE_URL}/list`)
      .pipe(
        retry(this.RETRY_COUNT),
        map(response => response.items || []),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene una persona buscada específica por su UID
   * @param uid - Identificador único de la persona
   * @returns Observable con los datos de la persona
   */
  getWantedPersonById(uid: string): Observable<WantedPerson> {
    return this.http.get<WantedPerson>(`${this.API_BASE_URL}/${uid}`)
      .pipe(
        retry(this.RETRY_COUNT),
        catchError(this.handleError)
      );
  }

  /**
   * Busca personas buscadas con parámetros específicos
   * @param params - Parámetros de búsqueda (page, pageSize, etc.)
   * @returns Observable con la respuesta paginada
   */
  searchWantedPersons(params: {
    page?: number;
    pageSize?: number;
    field_offices?: string;
    poster_classification?: string;
  } = {}): Observable<FBIApiResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${this.API_BASE_URL}/list${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    return this.http.get<FBIApiResponse>(url)
      .pipe(
        retry(this.RETRY_COUNT),
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene la URL de la imagen principal de una persona buscada
   * @param person - Objeto WantedPerson
   * @returns URL de la imagen o null si no está disponible
   */
  getPersonImageUrl(person: WantedPerson): string | null {
    return person.images && person.images.length > 0 ? person.images[0].original : null;
  }

  /**
   * Formatea la fecha de publicación en formato legible
   * @param dateString - Fecha en formato string
   * @returns Fecha formateada
   */
  formatPublicationDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  }

  /**
   * Abre la página de detalles oficial del FBI en una nueva pestaña
   * @param url - URL de la página oficial
   */
  openOfficialDetails(url: string | undefined): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  /**
   * Maneja los errores de las peticiones HTTP
   * @param error - Error de HTTP
   * @returns Observable con error formateado
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido al conectar con la API del FBI';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error de conexión: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 0:
          errorMessage = 'No se pudo conectar con el servidor del FBI. Verifique su conexión a internet.';
          break;
        case 404:
          errorMessage = 'El recurso solicitado no fue encontrado en la API del FBI.';
          break;
        case 429:
          errorMessage = 'Demasiadas solicitudes. Por favor, intente nuevamente en unos momentos.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor del FBI. Intente nuevamente más tarde.';
          break;
        case 503:
          errorMessage = 'El servicio del FBI no está disponible temporalmente.';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status} - ${error.message}`;
      }
    }

    console.error('Error en FbiWantedService:', error);
    return throwError(() => new Error(errorMessage));
  }
}