export class ReturnTranscDTO {
  movieId: number;
  rentals: string[];
  sales: string[];
  totalRevenue: number;
  customers: string[];
  constructor(
    movieId: number,
    rentals: string[],
    sales: string[],
    totalRevenue: number,
    customers: string[],
  ) {
    this.movieId = movieId;
    this.rentals = rentals;
    this.sales = sales;
    this.totalRevenue = totalRevenue;
    this.customers = customers;
  }
}
