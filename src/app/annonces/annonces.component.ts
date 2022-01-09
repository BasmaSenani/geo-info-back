import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AnnoncesService } from '../services/annonces.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-annonces',
  templateUrl: './annonces.component.html',
  styleUrls: ['./annonces.component.css']
})
export class AnnoncesComponent implements OnInit {

  annonces:any=[];
  page:number = 0 ;
  pages:any[] =[];
  totalPages:number = 0;
  isOperation=false;
  isType=false ;
  isCommune = false ;
  
   
  
  typeStart="Types";
  operationStart="Operations"
  communeStart = "Communes"
  filters=["Operation","Type","Commune"]
  Operations=["location","vente"]
  Types=["terrain","villa","appartement"]
  Communes:any[]=[]
  constructor(private annonceService:AnnoncesService , private authService:AuthenticationService) { }

  ngOnInit(): void {
   this.annonceService.getAnnonce(this.page).subscribe(
       data=>{
         console.log(data)
         this.annonces = data.filter(annonce => annonce.isAvailable) 
       }
     );

     this.annonceService.getAnnoncePages().subscribe(
      data => {
        console.log(data)
        this.totalPages=data 
        this.pages=new Array<number>(this.totalPages);
       }
    ); 

    this.annonceService.getAllCommmunes().subscribe(
      data => {
        console.log(data)
        this.Communes = data
      } 
    )

  
  }

  onLoad(page:number){
    this.page = page 
    if(!this.isOperation && !this.isType && !this.isCommune){
      this.annonceService.getAnnonce(page).subscribe(data=>{
        this.annonces=data.filter(annonce => annonce.isAvailable)
      },error=>{
        console.log(error);
      });
    }
    if(this.isType){
      this.onType(this.typeStart)
    }
    if(this.isOperation){
      this.onOperation(this.operationStart)
    }
    if(this.isCommune){
      this.onCommune(this.communeStart)
    }
    
  }

  onLeft(){
    this.page= this.page -1 ;
    this.onLoad(this.page)
  }

  onRight(){
    this.page= this.page +1 ;
    this.onLoad(this.page)
  }

  onSubmit(filter:string){
    if(filter=="Operation"){
      this.isType = false ;
      this.isCommune=false;
      this.typeStart="Types"
      this.isOperation=true
    }

    if(filter=="Type"){
      this.isOperation = false
      this.isCommune=false
      this.operationStart="Operations"
      this.isType=true
    }

    if(filter=="Commune"){
      this.isType = false ;
      this.isOperation=false
      this.communeStart="Communes"
      this.isCommune=true
    }
  }

  onOperation(operation:string){
      this.operationStart=operation
      this.annonceService.getAnnonceByOperation(this.page,operation).subscribe(
        data=>this.annonces = data.filter(annonce => annonce.isAvailable) 
      )
  }

  onCommune(commune:string){
    console.log(commune)
    this.communeStart=commune
    this.annonceService.getAnnonceByCommune(this.page,commune).subscribe(
      data=>this.annonces = data.filter(annonce => annonce.isAvailable) 
    )
}

  onType(type:string){
    this.typeStart=type;
    this.annonceService.getAnnonceByType(this.page,type).subscribe(
      data=>this.annonces = data.filter(annonce => annonce.isAvailable) 
      
    )
}


}
