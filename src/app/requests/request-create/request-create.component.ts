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
      transactionId: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      customer: new FormControl(null, { validators: [Validators.required] }),
      follower: new FormControl(null, { validators: [Validators.required] })
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
            transactionId: requestData.transactionId,
            customer: requestData.customer,
            creator: requestData.creator,
            follower: requestData.follower,
            products: requestData.products,
            isRevoke: requestData.isRevoke
          };
          this.form.setValue({
            transactionId: this.request.transactionId,
            customer: this.request.customer
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

    console.log(this.form.value);

    this.isLoading = true;
    if (this.mode === 'create') {
      this.requestsService.addRequest(
        this.form.value.transactionId,
        this.form.value.customer,
        this.form.value.follower
      );
    } else {
      this.requestsService.updateRequest(
        this.requestId,
        this.form.value.transactionId,
        this.form.value.customer,
        this.form.value.follower,
        null
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}

