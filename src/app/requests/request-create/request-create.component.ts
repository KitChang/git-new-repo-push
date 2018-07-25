import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { RequestsService } from '../requests.service';
import { Request } from '../request.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-request-create',
  templateUrl: './request-create.component.html',
  styleUrls: ['./request-create.component.css']
})
export class RequestCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  request: Request;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private requestId: string;
  private authStatusSub: Subscription;

  constructor(
    public requestsService: RequestsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.requestId = paramMap.get('id');
        this.isLoading = true;
        this.requestsService.getRequest(this.requestId).subscribe(requestData => {
          console.log('edit' + requestData._id);
          this.isLoading = false;
          this.request = {
            id: requestData._id,
            title: requestData.title,
            content: requestData.content,
            creator: requestData.creator
          };
          this.form.setValue({
            title: this.request.title,
            content: this.request.content
          });
        });
      } else {
        this.mode = 'create';
        this.requestId = null;
      }
    });
  }

  onSaveRequest() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.requestsService.addRequest(
        this.form.value.title,
        this.form.value.content
      );
    } else {
      this.requestsService.updateRequest(
        this.requestId,
        this.form.value.title,
        this.form.value.content
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}

