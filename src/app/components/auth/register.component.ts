import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';

interface SelectedPlan {
  name: string;
  price: number;
  billing: 'monthly' | 'annual';
  features: string[];
}

const BUSINESS_TYPES = [
  'Sole Proprietorship',
  'Partnership',
  'Limited Liability Company',
  'Corporation',
  'Non-Profit Organization',
  'Cooperative',
  'Other'
];

const INDUSTRIES = [
  'Agriculture',
  'Mining',
  'Manufacturing',
  'Construction',
  'Retail Trade',
  'Wholesale Trade',
  'Transportation',
  'Information Technology',
  'Finance and Insurance',
  'Real Estate',
  'Professional Services',
  'Education',
  'Healthcare',
  'Hospitality',
  'Entertainment',
  'Media',
  'Government',
  'Other'
];

const PARISHES = [
  'Kingston',
  'St. Andrew',
  'St. Thomas',
  'Portland',
  'St. Mary',
  'St. Ann',
  'Trelawny',
  'St. James',
  'Hanover',
  'Westmoreland',
  'St. Elizabeth',
  'Manchester',
  'Clarendon',
  'St. Catherine'
];

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
    MatStepperModule,
    MatDividerModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // Step forms
  personalForm: FormGroup;
  businessForm: FormGroup;
  addressForm: FormGroup;
  contactForm: FormGroup;

  // Data arrays
  businessTypes = BUSINESS_TYPES;
  industries = INDUSTRIES;
  parishes = PARISHES;

  // UI state
  loading = false;
  registrationError: string | null = null;
  selectedPlan: SelectedPlan | null = null;
  error$;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.error$ = this.authService.error$;

    // Step 1: Personal Information
    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    // Step 2: Business Information
    this.businessForm = this.fb.group({
      business_name: ['', Validators.required],
      registration_number: ['', Validators.required],
      trn: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      nis: ['', [Validators.minLength(9), Validators.maxLength(9)]],
      business_type: ['', Validators.required],
      industry: ['', Validators.required]
    });

    // Step 3: Business Address
    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      parish: ['', Validators.required],
      postal_code: [''],
      country: ['Jamaica']
    });

    // Step 4: Contact & Review
    this.contactForm = this.fb.group({
      business_phone: ['', Validators.required],
      business_email: ['', [Validators.required, Validators.email]],
      website: ['']
    });
  }

  ngOnInit(): void {
    // Read plan from query param (set by pricing page)
    this.route.queryParams.subscribe(params => {
      const planName = params['plan'];
      if (planName) {
        const planMap: Record<string, SelectedPlan> = {
          free:       { name: 'Free',         price: 0,     billing: 'monthly', features: [] },
          pro:        { name: 'Professional', price: 4500,  billing: 'monthly', features: [] },
          enterprise: { name: 'Enterprise',   price: 0,     billing: 'monthly', features: [] }
        };
        this.selectedPlan = planMap[planName] ?? null;
        if (this.selectedPlan) {
          localStorage.setItem('selectedPlan', JSON.stringify(this.selectedPlan));
        }
      } else {
        // Fallback to storage (in case of page refresh)
        const planFromStorage = localStorage.getItem('selectedPlan');
        if (planFromStorage) {
          try { this.selectedPlan = JSON.parse(planFromStorage); } catch { /* ignore */ }
        }
      }
    });

    // Auto-populate business name
    this.personalForm.get('firstName')?.valueChanges.subscribe(() => this.autoPopulateBusinessName());
    this.personalForm.get('lastName')?.valueChanges.subscribe(() => this.autoPopulateBusinessName());

    // Auto-populate business email
    this.personalForm.get('email')?.valueChanges.subscribe((email) => {
      if (email && !this.contactForm.get('business_email')?.value) {
        this.contactForm.patchValue({ business_email: email });
      }
    });
  }

  autoPopulateBusinessName(): void {
    const firstName = this.personalForm.get('firstName')?.value;
    const lastName = this.personalForm.get('lastName')?.value;
    const currentBusinessName = this.businessForm.get('business_name')?.value;

    if (firstName && lastName && !currentBusinessName) {
      this.businessForm.patchValue({
        business_name: `${firstName} ${lastName}'s Business`
      });
    }
  }

  passwordsMismatch(): boolean {
    const password = this.personalForm.get('password')?.value;
    const confirmPassword = this.personalForm.get('confirmPassword')?.value;
    return password !== confirmPassword && confirmPassword !== '';
  }

  onlyDigits(event: KeyboardEvent, fieldName: string, formGroup: FormGroup): void {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (allowedKeys.indexOf(event.key) !== -1) {
      return;
    }
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  formatCurrency(price: number): string {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD',
      minimumFractionDigits: 0
    }).format(price);
  }

  onSubmit(): void {
    if (this.personalForm.invalid || this.businessForm.invalid ||
        this.addressForm.invalid || this.contactForm.invalid) {
      this.registrationError = 'Please complete all required fields.';
      return;
    }

    if (this.passwordsMismatch()) {
      this.registrationError = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.authService.clearError();
    this.registrationError = null;

    // Combine all form data
    const registrationData = {
      // Personal
      email: this.personalForm.value.email.trim(),
      password: this.personalForm.value.password,
      password_confirm: this.personalForm.value.confirmPassword,
      first_name: this.personalForm.value.firstName.trim(),
      last_name: this.personalForm.value.lastName.trim(),
      phone: this.personalForm.value.phone || '',
      role: 'business_owner',

      // Business
      business_name: this.businessForm.value.business_name.trim(),
      registration_number: this.businessForm.value.registration_number.trim(),
      trn: this.businessForm.value.trn,
      nis: this.businessForm.value.nis || '',
      business_type: this.businessForm.value.business_type,
      industry: this.businessForm.value.industry,

      // Address
      street: this.addressForm.value.street.trim(),
      city: this.addressForm.value.city.trim(),
      parish: this.addressForm.value.parish,
      postal_code: this.addressForm.value.postal_code || '',
      country: this.addressForm.value.country,

      // Contact
      business_phone: this.contactForm.value.business_phone.trim(),
      business_email: this.contactForm.value.business_email.trim(),
      website: this.contactForm.value.website.trim() || ''
    };

    // Map snake_case form fields to camelCase RegisterRequest
    const registerPayload = {
      firstName:          this.personalForm.value.firstName?.trim(),
      lastName:           this.personalForm.value.lastName?.trim(),
      email:              this.personalForm.value.email?.trim(),
      password:           this.personalForm.value.password,
      phone:              this.personalForm.value.phone || '',
      businessName:       this.businessForm.value.business_name?.trim(),
      registrationNumber: this.businessForm.value.registration_number?.trim(),
      trn:                this.businessForm.value.trn,
      nis:                this.businessForm.value.nis || '',
      businessType:       this.businessForm.value.business_type,
      industry:           this.businessForm.value.industry,
      street:             this.addressForm.value.street?.trim(),
      city:               this.addressForm.value.city?.trim(),
      parish:             this.addressForm.value.parish,
      postalCode:         this.addressForm.value.postal_code || '',
      country:            this.addressForm.value.country,
      businessPhone:      this.contactForm.value.business_phone?.trim(),
      businessEmail:      this.contactForm.value.business_email?.trim(),
      website:            this.contactForm.value.website?.trim() || ''
    };

    this.authService.register(registerPayload).subscribe({
      next: (response) => {
        if (response.success) {
          localStorage.removeItem('registrationData');
          localStorage.removeItem('selectedPlan');
          this.router.navigate(['/dashboard']);
        } else {
          this.registrationError = response.message || 'Registration failed. Please try again.';
          this.loading = false;
        }
      },
      error: (err) => {
        this.registrationError = err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
