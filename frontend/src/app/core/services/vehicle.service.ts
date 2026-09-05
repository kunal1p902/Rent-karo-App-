import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Vehicle } from '../models/vehicle.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/vehicles`;

  // Local fallback mock database for cars & bikes (for rent & sale)
  private mockVehicles: Vehicle[] = [
    {
      _id: 'v101',
      ownerId: 'o1',
      name: 'Honda Activa 6G',
      brand: 'Honda',
      model: 'Activa 6G',
      type: 'Bike',
      registrationNumber: 'MH01AB1234',
      year: 2022,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      seats: 2,
      color: 'Matte Blue',
      description: 'Reliable & fuel-efficient scooter perfect for quick city errands.',
      images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80'],
      location: 'Mumbai',
      listingType: 'rent',
      pricePerHour: 50,
      pricePerDay: 450,
      pricePerWeek: 2500,
      securityDeposit: 500,
      quantity: 10,
      availableQuantity: 8,
      features: ['Helmet Included', 'Mobile Holder', 'Sanitized'],
      status: 'available',
      rating: 4.8,
      reviewCount: 42
    },
    {
      _id: 'v102',
      ownerId: 'o1',
      name: 'Royal Enfield Classic 350',
      brand: 'Royal Enfield',
      model: 'Classic 350',
      type: 'Bike',
      registrationNumber: 'MH02XY9876',
      year: 2021,
      fuelType: 'Petrol',
      transmission: 'Manual',
      seats: 2,
      color: 'Stealth Black',
      description: 'Iconic cruiser bike ideal for long highway journeys and city rides.',
      images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'],
      location: 'Mumbai',
      listingType: 'rent',
      pricePerHour: 90,
      pricePerDay: 950,
      pricePerWeek: 5500,
      securityDeposit: 1500,
      quantity: 5,
      availableQuantity: 4,
      features: ['Dual ABS', 'Comfort Seat', 'Luggage Carrier'],
      status: 'available',
      rating: 4.9,
      reviewCount: 68
    },
    {
      _id: 'v103',
      ownerId: 'o2',
      name: 'Royal Enfield Hunter 350',
      brand: 'Royal Enfield',
      model: 'Hunter 350 (2023)',
      type: 'Bike',
      registrationNumber: 'MH03SALE99',
      year: 2023,
      fuelType: 'Petrol',
      transmission: 'Manual',
      seats: 2,
      color: 'Dapper White',
      description: 'Mint condition 2023 RE Hunter 350 up for sale. Single owner, 4,500 kms driven, complete service record.',
      images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80'],
      location: 'Mumbai',
      listingType: 'sale',
      salePrice: 165000,
      pricePerHour: 0,
      pricePerDay: 0,
      pricePerWeek: 0,
      securityDeposit: 0,
      quantity: 2,
      availableQuantity: 2,
      features: ['Insurance Valid', 'First Owner', 'Zero Accidents'],
      status: 'available',
      rating: 4.9,
      reviewCount: 12
    },
    {
      _id: 'v104',
      ownerId: 'o2',
      name: 'Honda City 4th Gen',
      brand: 'Honda',
      model: 'City V',
      type: 'Car',
      registrationNumber: 'DL01CD4567',
      year: 2021,
      fuelType: 'Petrol',
      transmission: 'Manual',
      seats: 5,
      color: 'Orchid White',
      description: 'Spacious sedan with premium leather interior and smooth highway power.',
      images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'],
      location: 'Delhi',
      listingType: 'rent',
      pricePerHour: 150,
      pricePerDay: 1800,
      pricePerWeek: 10000,
      securityDeposit: 2000,
      quantity: 4,
      availableQuantity: 3,
      features: ['Touchscreen', 'Sunroof', 'Airbags'],
      status: 'available',
      rating: 4.7,
      reviewCount: 35
    },
    {
      _id: 'v105',
      ownerId: 'o3',
      name: 'Hyundai Creta SX (2022)',
      brand: 'Hyundai',
      model: 'Creta SX',
      type: 'Car',
      registrationNumber: 'DL05SELL11',
      year: 2022,
      fuelType: 'Diesel',
      transmission: 'Automatic',
      seats: 5,
      color: 'Phantom Black',
      description: 'Well-maintained Hyundai Creta for sale. Panoramic sunroof, Bose sound system, immaculate condition.',
      images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'],
      location: 'Delhi',
      listingType: 'sale',
      salePrice: 1150000,
      pricePerHour: 0,
      pricePerDay: 0,
      pricePerWeek: 0,
      securityDeposit: 0,
      quantity: 1,
      availableQuantity: 1,
      features: ['Panoramic Sunroof', 'Bose Audio', 'Full Service History'],
      status: 'available',
      rating: 5.0,
      reviewCount: 8
    },
    {
      _id: 'v106',
      ownerId: 'o3',
      name: 'Mahindra Thar 4WD LX',
      brand: 'Mahindra',
      model: 'Thar 4WD',
      type: 'Car',
      registrationNumber: 'GOA01THAR1',
      year: 2023,
      fuelType: 'Diesel',
      transmission: 'Manual',
      seats: 4,
      color: 'Napoli Black',
      description: 'Convertible hardtop Thar perfect for off-roading and exploring coastal roads.',
      images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'],
      location: 'Goa',
      listingType: 'rent',
      pricePerHour: 250,
      pricePerDay: 3200,
      pricePerWeek: 18000,
      securityDeposit: 4000,
      quantity: 5,
      availableQuantity: 4,
      features: ['4x4 Terrain Mode', 'Bluetooth System', 'All-Terrain Tyres'],
      status: 'available',
      rating: 4.95,
      reviewCount: 89
    },
    {
      _id: 'v107',
      ownerId: 'o4',
      name: 'KTM Duke 390 ABS',
      brand: 'KTM',
      model: 'Duke 390',
      type: 'Bike',
      registrationNumber: 'KA01SELL77',
      year: 2023,
      fuelType: 'Petrol',
      transmission: 'Manual',
      seats: 2,
      color: 'Electric Orange',
      description: 'Performance sports bike available for purchase. Quickshifter+, TFT Display, 100% genuine condition.',
      images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'],
      location: 'Bangalore',
      listingType: 'sale',
      salePrice: 285000,
      pricePerHour: 0,
      pricePerDay: 0,
      pricePerWeek: 0,
      securityDeposit: 0,
      quantity: 2,
      availableQuantity: 2,
      features: ['Quickshifter+', 'TFT Display', 'Metzeler Tyres'],
      status: 'available',
      rating: 4.8,
      reviewCount: 15
    },
    {
      _id: 'v108',
      ownerId: 'o4',
      name: 'Toyota Fortuner 4x4',
      brand: 'Toyota',
      model: 'Fortuner',
      type: 'Car',
      registrationNumber: 'KA02MN4567',
      year: 2021,
      fuelType: 'Diesel',
      transmission: 'Automatic',
      seats: 7,
      color: 'Super White',
      description: '7-seater luxury SUV available for family rentals and outstation tours.',
      images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'],
      location: 'Bangalore',
      listingType: 'rent',
      pricePerHour: 400,
      pricePerDay: 4500,
      pricePerWeek: 26000,
      securityDeposit: 5000,
      quantity: 3,
      availableQuantity: 2,
      features: ['4WD', 'JBL Sound', 'Leather Seating'],
      status: 'available',
      rating: 4.9,
      reviewCount: 54
    }
  ];

  getVehicles(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      catchError(() => {
        // Fallback filter over client mock dataset
        let filtered = [...this.mockVehicles];

        if (params) {
          if (params.search) {
            const s = params.search.toLowerCase();
            filtered = filtered.filter(v => 
              v.name.toLowerCase().includes(s) || 
              v.brand.toLowerCase().includes(s) || 
              v.model.toLowerCase().includes(s)
            );
          }
          if (params.type && params.type !== '') {
            filtered = filtered.filter(v => {
              if (params.type === 'Car') return ['Car', 'SUV', 'Sedan', 'Hatchback'].includes(v.type);
              if (params.type === 'Bike') return ['Bike', 'Scooter'].includes(v.type);
              return v.type === params.type;
            });
          }
          if (params.listingType && params.listingType !== '') {
            filtered = filtered.filter(v => v.listingType === params.listingType);
          }
          if (params.location && params.location !== '') {
            const loc = params.location.toLowerCase();
            filtered = filtered.filter(v => v.location.toLowerCase().includes(loc));
          }
        }

        return of({ success: true, data: filtered, total: filtered.length });
      })
    );
  }

  getVehicle(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        const found = this.mockVehicles.find(v => v._id === id) || this.mockVehicles[0];
        return of({ success: true, vehicle: found });
      })
    );
  }

  createVehicle(payload: any): Observable<any> {
    const isFormData = payload instanceof FormData;
    return this.http.post(this.apiUrl, payload).pipe(
      catchError(() => {
        let newVeh: Vehicle;
        if (isFormData) {
          newVeh = {
            _id: `v_mock_${Date.now()}`,
            ownerId: 'current_user',
            name: 'New Registered Vehicle',
            brand: 'Custom',
            model: 'Model',
            type: 'Car',
            registrationNumber: 'MH00XX0000',
            year: 2024,
            fuelType: 'Petrol',
            transmission: 'Manual',
            seats: 5,
            color: 'White',
            description: 'Newly listed vehicle',
            images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'],
            location: 'Mumbai',
            listingType: 'rent',
            pricePerHour: 100,
            pricePerDay: 1500,
            pricePerWeek: 9000,
            securityDeposit: 1000,
            quantity: 1,
            availableQuantity: 1,
            features: ['AC', 'Music System'],
            status: 'available',
            rating: 5.0,
            reviewCount: 0
          };
        } else {
          newVeh = {
            _id: `v_mock_${Date.now()}`,
            ownerId: 'current_user',
            ...payload
          };
        }
        this.mockVehicles.unshift(newVeh);
        return of({ success: true, vehicle: newVeh });
      })
    );
  }

  updateVehicle(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload).pipe(
      catchError(() => {
        const idx = this.mockVehicles.findIndex(v => v._id === id);
        if (idx !== -1) {
          this.mockVehicles[idx] = { ...this.mockVehicles[idx], ...payload };
        }
        return of({ success: true, vehicle: this.mockVehicles[idx] || payload });
      })
    );
  }

  deleteVehicle(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        this.mockVehicles = this.mockVehicles.filter(v => v._id !== id);
        return of({ success: true, message: 'Vehicle deleted successfully' });
      })
    );
  }

  getOwnerVehicles(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/owner/vehicles`).pipe(
      catchError(() => {
        return of({ success: true, data: this.mockVehicles });
      })
    );
  }
}
