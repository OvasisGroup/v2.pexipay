# Navigation Structure

## Overview
All dashboard pages now use a unified layout with:
- **Sidebar** (left): Role-based navigation menu with collapsible design
- **Top Navbar** (top): Search bar, notifications, profile dropdown with logout
- **Main Content** (center-right): Page-specific content

## Components

### DashboardLayout (`/components/DashboardLayout.tsx`)
Wrapper component that provides:
- Authentication check and role-based access control
- Sidebar navigation
- Top navbar with user profile
- Responsive layout structure

**Usage:**
```tsx
<DashboardLayout requiredRole="ADMIN">
  {/* Page content */}
</DashboardLayout>
```

### Sidebar (`/components/Sidebar.tsx`)
Features:
- Role-specific menu items
- Active route highlighting
- Collapsible design (64px collapsed, 256px expanded)
- PexiPay logo and version footer

**Menu Items by Role:**

**ADMIN:**
- Dashboard → `/admin/dashboard`
- Users → `/admin/users`
- Merchants → `/admin/merchants`
- Transactions → `/dashboard/transactions`
- Settlements → `/admin/settlements`
- KYC Reviews → `/admin/kyc`
- Fraud Cases → `/admin/fraud`
- Audit Logs → `/admin/audit`

**SUPER_MERCHANT:**
- Dashboard → `/super-merchant/dashboard`
- Sub-Merchants → `/super-merchant/merchants`
- Transactions → `/dashboard/transactions`
- Settlements → `/super-merchant/settlements`
- API Keys → `/merchant/api-keys`
- Reports → `/super-merchant/reports`
- Settings → `/super-merchant/settings`

**MERCHANT:**
- Dashboard → `/merchant/dashboard`
- Transactions → `/dashboard/transactions`
- Settlements → `/merchant/settlements`
- API Keys → `/merchant/api-keys`
- Reports → `/merchant/reports`
- Settings → `/merchant/settings`

### TopNavbar (`/components/TopNavbar.tsx`)
Features:
- Global search bar
- Notification bell (with badge)
- User profile dropdown with:
  - User avatar (initials)
  - User name and email
  - Role badge
  - Profile link
  - Settings link
  - Help & Support link
  - Logout button

## Updated Pages

All pages below now use DashboardLayout:

### Admin Pages
- ✅ `/app/admin/dashboard/page.tsx`
- ✅ `/app/admin/users/page.tsx`
- ✅ `/app/admin/merchants/page.tsx`

### Super-Merchant Pages
- ✅ `/app/super-merchant/dashboard/page.tsx`

### Merchant Pages
- ✅ `/app/merchant/dashboard/page.tsx`
- ✅ `/app/merchant/api-keys/page.tsx`

### Shared Pages
- ✅ `/app/dashboard/transactions/page.tsx` (accessible to all roles)

## Benefits

1. **Consistent UX**: All dashboard pages have the same navigation structure
2. **Centralized Auth**: Authentication logic in one place (DashboardLayout)
3. **Role-Based Access**: Each page can specify required role
4. **Easy Navigation**: Sidebar always visible with role-appropriate menu items
5. **Professional UI**: Profile dropdown, search, notifications standard across platform
6. **Maintainability**: Update navigation in one place, applies everywhere

## Implementation Notes

- All pages had their individual auth logic removed (useEffect, useRouter, etc.)
- Headers with logout buttons removed
- Main wrappers removed
- Content now wrapped in DashboardLayout component
- Sidebar fixed at 256px width (left), navbar fixed at 64px height (top)
- Main content area has margin-left: 256px, margin-top: 64px, padding: 32px
