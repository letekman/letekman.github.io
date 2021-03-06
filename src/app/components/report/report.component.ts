import { Component, OnInit } from '@angular/core';
import {TeacherReportService} from '../../services/teacher-report.service';
import {CurrentUserService} from '../../services/current-user.service';
import {UserModel} from '../login/user.model';
import {ReportModel} from './report.model';
import {Router} from "@angular/router";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  anonymous = false;
  role = 'victim';
  teachers: UserModel[];
  currentUser: UserModel;

  constructor(private router: Router, private teacherReportService: TeacherReportService,
              private currentUserService: CurrentUserService) { }

  ngOnInit(): void {
    this.getTeachers();
    this.getCurrentUser();
  }

  getTeachers() {
    this.teacherReportService.getTeachers().subscribe(teachers => this.teachers = teachers);
  }

  getCurrentUser() {
    this.currentUserService.getUser().subscribe(user => this.currentUser = user);

  }

  submitReport(perp: string, victim: string, type: string, description: string, teacherid: string): void {
    // console.log(perpname, victimname, type, description, teacher);
    // console.log(this.teachers);
    // console.log(this.teachers);
    // console.log(teacherid);
    // console.log(Number(this.teachers[0].id));
    if (this.role === 'victim') {
      if (this.anonymous) {
        victim = 'anonymous';
      } else {
        victim = this.currentUser.firstName + this.currentUser.lastName;
      }
    }
    const student = this.currentUser;
    const anonymous = this.anonymous;
    const role = this.role;
    const teacher = this.teachers.find(t => t.id === Number(teacherid));
    // console.log(teacher);
    this.currentUserService.submitNewReport({perp, victim, type, description, teacher, anonymous, role, student} as ReportModel).subscribe(() => {
      this.router.navigate(['/activeReport']);
    })
  }
}
