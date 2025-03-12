import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {

  displayedColumns:string[] = ['name', 'email', 'contactNumber', 'status'];
  dataSource: any;
  respoonseMessage: any;
  constructor(private ngxService: NgxUiLoaderService,
    private userService: UserService,
    private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(){
    this.userService.getUsers().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    }, (error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.respoonseMessage = error.error?.message;
      }
      else{
        this.respoonseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.respoonseMessage, GlobalConstants.error);
    })
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onChange(status: any, id: any){
    this.ngxService.start();
    var data = {
      status: status.toString(),
      id: id
    }

    this.userService.update(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.respoonseMessage = response?.message;
      this.snackbarService.openSnackBar(this.respoonseMessage, "success");
    }, (error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.respoonseMessage = error.error?.message;
      }
      else{
        this.respoonseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.respoonseMessage, GlobalConstants.error);
    })
  }
}
