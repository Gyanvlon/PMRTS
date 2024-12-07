import {AfterViewInit, Component, OnInit, ViewChild, inject} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';
import { PeriodicElement } from '../Shared/Type';

@Component({
  selector: 'app-listing',
  imports: [MatTableModule, MatIconModule, MatPaginatorModule, MatCardModule, MatProgressBarModule, MatChipsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule,RouterModule],
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.scss'
})
export class ListingComponent implements AfterViewInit, OnInit {
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  #dataService = inject(DataService)
  title: string | undefined = ''
  displayedColumns: string[] = ['position', 'name', 'email', 'phoneNumber', 'Action'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  data: any ={}
  role : string = "";
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  ngOnInit(): void {
    let existingData  = localStorage.getItem('state');
    if(existingData){
      this.data = JSON.parse(existingData);
    }
    this.role = this.data.res.role;
    console.log(this.role);
    const routeTitle = this.#route.routeConfig?.title;
    console.log(routeTitle);
    if (typeof routeTitle === 'string') {
      this.title = routeTitle;
      localStorage.setItem('title', this.title);
      if(this.title === 'Hospitals' || this.title === 'Labs' || this.title === 'Pharmacies') {
        this.displayedColumns = ['position', 'name', 'email', 'phoneNumber', 'date', 'Action'];
      } 
      if(this.title === "Prescriptions"){
        this.displayedColumns = ['position', 'name', 'status', 'diagnosisCode', 'Action'];
        this.#dataService.getPrescriptions().subscribe((res: any[]) => {
          this.dataSource.data = res;
        })
      }
      this.#dataService.getData(this.title).subscribe((res: any[]) => {
        console.log(res);
        this.dataSource.data = res;
      })
    
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  navagateToForm(id: string) {
    if((this.title ==="Prescriptions" && this.data.res.role === "DOCTOR")){
      console.log(id, this.title, this.data.res.role);
        this.#router.navigate([`/home/prescriptions/${id}`]);
      }
  }
  viewDetails(id: string) {
 
    if(this.title ==="Lab Technicians"){
      this.title = "Labtechnicians";
    }
    if(this.data.res.role === "ADMIN"){
      this.#router.navigate([`/home/${this.title?.toLowerCase()}/${id}`]);
    }else{
      this.#router.navigate([`/home/view/${this.title?.toLowerCase()}/${id}`]);
    }
  }
}

