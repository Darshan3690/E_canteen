/**
 * Onboarding Wizard Validation Library
 * Server-side validation for all wizard steps
 */

export interface OnboardingErrors {
  [key: string]: string;
}

// Step 1: Basic Canteen Information Validation
export interface BasicInfoData {
  name: string;
  description: string;
  location: string;
  contactNumber: string;
  contactEmail?: string;
}

export async function validateBasicInfo(data: BasicInfoData, prisma: any): Promise<OnboardingErrors> {
  const errors: OnboardingErrors = {};

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Canteen name is required";
  } else if (data.name.trim().length < 3) {
    errors.name = "Canteen name must be at least 3 characters";
  } else if (data.name.trim().length > 100) {
    errors.name = "Canteen name must not exceed 100 characters";
  } else {
    // Check for uniqueness
    const existing = await prisma.canteen.findFirst({
      where: { name: data.name.trim() },
    });
    if (existing) {
      errors.name = "A canteen with this name already exists";
    }
  }

  // Description validation
  if (data.description && data.description.trim().length > 500) {
    errors.description = "Description must not exceed 500 characters";
  }

  // Location validation
  if (!data.location || data.location.trim().length === 0) {
    errors.location = "Location is required";
  } else if (data.location.trim().length < 2) {
    errors.location = "Location must be at least 2 characters";
  }

  // Contact number validation
  if (!data.contactNumber || data.contactNumber.trim().length === 0) {
    errors.contactNumber = "Contact number is required";
  } else {
    const phoneRegex = /^[0-9\-\+\(\)\s]{7,}$/;
    if (!phoneRegex.test(data.contactNumber)) {
      errors.contactNumber = "Please enter a valid contact number";
    }
  }

  // Email validation (optional)
  if (data.contactEmail && data.contactEmail.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contactEmail)) {
      errors.contactEmail = "Please enter a valid email address";
    }
  }

  return errors;
}

// Step 2: Branding Validation
export interface BrandingData {
  logoUrl?: string;
  coverImageUrl?: string;
  /**
   * When true, branding validation will be skipped and
   * logo/cover are treated as optional for this onboarding.
   */
  skipBranding?: boolean;
}

export function validateBranding(data: BrandingData): OnboardingErrors {
  const errors: OnboardingErrors = {};

  // If user chose to skip branding, don't require a logo
  if (data.skipBranding) {
    return errors;
  }

  if (!data.logoUrl || data.logoUrl.trim().length === 0) {
    errors.logoUrl = "Logo is required";
  }

  return errors;
}

// Step 3: Operating Hours Validation
export interface OperatingHoursData {
  openingTime: string; // Format: HH:mm
  closingTime: string;
  workingDays: string[]; // ["MON", "TUE", ...]
}

export function validateOperatingHours(data: OperatingHoursData): OnboardingErrors {
  const errors: OnboardingErrors = {};

  const validDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // Opening time validation
  if (!data.openingTime || data.openingTime.trim().length === 0) {
    errors.openingTime = "Opening time is required";
  } else if (!isValidTimeFormat(data.openingTime)) {
    errors.openingTime = "Please enter time in HH:mm format";
  }

  // Closing time validation
  if (!data.closingTime || data.closingTime.trim().length === 0) {
    errors.closingTime = "Closing time is required";
  } else if (!isValidTimeFormat(data.closingTime)) {
    errors.closingTime = "Please enter time in HH:mm format";
  }

  // Compare opening and closing time
  if (data.openingTime && data.closingTime && isValidTimeFormat(data.openingTime) && isValidTimeFormat(data.closingTime)) {
    const [openHour, openMin] = data.openingTime.split(":").map(Number);
    const [closeHour, closeMin] = data.closingTime.split(":").map(Number);
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;

    if (openMinutes >= closeMinutes) {
      errors.closingTime = "Closing time must be after opening time";
    }
  }

  // Working days validation
  if (!data.workingDays || data.workingDays.length === 0) {
    errors.workingDays = "At least one working day must be selected";
  } else {
    const invalidDays = data.workingDays.filter(day => !validDays.includes(day));
    if (invalidDays.length > 0) {
      errors.workingDays = "Invalid day selected";
    }
  }

  return errors;
}

// Step 4: Token Configuration Validation
export interface TokenConfigData {
  tokenPrefix: string;
  startingTokenNumber: number;
}

export async function validateTokenConfig(data: TokenConfigData, prisma: any): Promise<OnboardingErrors> {
  const errors: OnboardingErrors = {};

  // Token prefix validation
  if (!data.tokenPrefix || data.tokenPrefix.trim().length === 0) {
    errors.tokenPrefix = "Token prefix is required";
  } else if (data.tokenPrefix.length > 3) {
    errors.tokenPrefix = "Token prefix must be 3 characters or less";
  } else if (!/^[A-Z]+$/.test(data.tokenPrefix)) {
    errors.tokenPrefix = "Token prefix must contain only uppercase letters";
  } else {
    // Check for uniqueness
    const existing = await prisma.canteen.findFirst({
      where: { tokenPrefix: data.tokenPrefix },
    });
    if (existing) {
      errors.tokenPrefix = "This token prefix is already in use";
    }
  }

  // Starting token number validation
  if (data.startingTokenNumber === undefined || data.startingTokenNumber === null) {
    errors.startingTokenNumber = "Starting token number is required";
  } else if (typeof data.startingTokenNumber !== "number") {
    errors.startingTokenNumber = "Starting token number must be a number";
  } else if (data.startingTokenNumber < 1) {
    errors.startingTokenNumber = "Starting token number must be at least 1";
  } else if (data.startingTokenNumber > 9999) {
    errors.startingTokenNumber = "Starting token number cannot exceed 9999";
  }

  return errors;
}

// Step 5: First Menu Item Validation (Optional)
export interface MenuItemData {
  name: string;
  price: number;
  description?: string;
  prepTime?: number;
}

export function validateMenuItem(data: MenuItemData): OnboardingErrors {
  const errors: OnboardingErrors = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Item name is required";
  } else if (data.name.trim().length > 100) {
    errors.name = "Item name must not exceed 100 characters";
  }

  if (data.price === undefined || data.price === null) {
    errors.price = "Price is required";
  } else if (typeof data.price !== "number") {
    errors.price = "Price must be a number";
  } else if (data.price < 0) {
    errors.price = "Price cannot be negative";
  }

  if (data.description && data.description.trim().length > 300) {
    errors.description = "Description must not exceed 300 characters";
  }

  if (data.prepTime !== undefined && data.prepTime !== null) {
    if (typeof data.prepTime !== "number") {
      errors.prepTime = "Preparation time must be a number";
    } else if (data.prepTime < 1 || data.prepTime > 120) {
      errors.prepTime = "Preparation time must be between 1 and 120 minutes";
    }
  }

  return errors;
}

// Helper function to validate time format
function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

// Generate next order number for a canteen
export function generateOrderNumber(prefix: string, currentNumber: number): string {
  return `${prefix}-${currentNumber}`;
}

// Check if canteen is open right now
export function isCanteenOpenNow(openingTime: string, closingTime: string, workingDays: string[]): boolean {
  const now = new Date();
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const currentDay = dayNames[now.getDay()];

  if (!workingDays.includes(currentDay)) {
    return false;
  }

  const [openHour, openMin] = openingTime.split(":").map(Number);
  const [closeHour, closeMin] = closingTime.split(":").map(Number);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}
