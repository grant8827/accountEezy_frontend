import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
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
import { PackagePrice, PackagePricingService } from '../../services/package-pricing.service';

interface SelectedPlan {
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  features: string[];
  freeTrialDays?: number;
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
  selectedPlanKey: string | null = null;
  error$;

  // Logo upload state
  logoFile: File | null = null;
  logoPreviewUrl: string | null = null;
  private apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  private router: Router,
  private route: ActivatedRoute,
  private http: HttpClient,
  private packagePricing: PackagePricingService
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
      const billing = params['billing'] === 'yearly' ? 'yearly' : 'monthly';
      if (planName) {
        this.setSelectedPlan(planName, billing);
        this.packagePricing.getPackageMap().subscribe({
          next: packages => this.setSelectedPlan(planName, billing, packages[planName]),
          error: error => console.error('Failed to load package pricing:', error)
        });
      } else {
        // Fallback to storage (in case of page refresh)
        const planFromStorage = localStorage.getItem('selectedPlan');
        this.selectedPlanKey = localStorage.getItem('selectedPlanKey');
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

  private planPrice(monthlyPrice: number, billing: 'monthly' | 'yearly'): number {
    return billing === 'yearly' ? monthlyPrice * 12 * 0.8 : monthlyPrice;
  }

  private setSelectedPlan(planName: string, billing: 'monthly' | 'yearly', packagePrice?: PackagePrice): void {
    const price = (fallbackMonthly: number) =>
      this.packagePricing.priceFor(packagePrice, billing, fallbackMonthly);
    const trialFeature = packagePrice?.freeTrialDays && packagePrice.freeTrialDays > 0
      ? [`${packagePrice.freeTrialDays}-day free trial`]
      : [];

    const planMap: Record<string, SelectedPlan> = {
      lite:    { name: 'Lite',    price: price(3500),  billing, features: ['Up to 5 employees', 'Payroll calculator', 'GCT tracking', ...trialFeature], freeTrialDays: packagePrice?.freeTrialDays },
      starter: { name: 'Starter', price: price(6500),  billing, features: ['6-15 employees', 'Full payroll automation', 'Employee portal access', ...trialFeature], freeTrialDays: packagePrice?.freeTrialDays },
      growth:  { name: 'Growth',  price: price(12500), billing, features: ['16-35 employees', 'Advanced tax breakdowns', 'Priority support', ...trialFeature], freeTrialDays: packagePrice?.freeTrialDays },
      custom:  { name: 'Custom',  price: price(15000), billing, features: ['36+ employees', billing === 'yearly' ? 'From custom yearly pricing + J$1,920 per employee over 35' : 'From custom monthly pricing + J$200 per employee over 35', 'Dedicated account support', ...trialFeature], freeTrialDays: packagePrice?.freeTrialDays }
    };

    this.selectedPlan = planMap[planName] ?? null;
    if (this.selectedPlan) {
      this.selectedPlanKey = planName;
      localStorage.setItem('selectedPlan', JSON.stringify(this.selectedPlan));
      localStorage.setItem('selectedPlanKey', planName);
    }
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

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 2 * 1024 * 1024) {
        this.registrationError = 'Logo file must be 2 MB or less.';
        return;
      }
      this.logoFile = file;
      const reader = new FileReader();
      reader.onload = (e) => { this.logoPreviewUrl = e.target?.result as string; };
      reader.readAsDataURL(file);
    }
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
      website:            this.contactForm.value.website?.trim() || '',
      selectedPlan:       this.selectedPlanKey,
      billingPeriod:      this.selectedPlan?.billing === 'yearly' ? 'Yearly' : 'Monthly'
    };

    this.authService.register(registerPayload).subscribe({
      next: (response) => {
        if (response.success) {
          localStorage.removeItem('registrationData');
          localStorage.setItem('registrationEmail', registerPayload.email || '');
          localStorage.setItem('registrationBusinessName', registerPayload.businessName || '');
          if (response.data?.user.businessId) {
            localStorage.setItem('registrationBusinessId', String(response.data.user.businessId));
          }
          this.router.navigate(['/payment'], {
            queryParams: {
              plan: this.selectedPlanKey,
              billing: this.selectedPlan?.billing,
              registered: '1'
            }
          });
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
