# Tasks: User Table Implementation

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 110-160 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Full implementation of user table enhancements | Main PR | Atomic UI and Page changes |

## Phase 1: Foundation (Models & UI Bases)

- [x] 1.1 Update `UserRowData` interface in `src/components/molecules/UserRow/UserRow.tsx` to include `active?: boolean`.
- [x] 1.2 Add conditional styling to `UserRow.tsx`: apply `opacity-50` to `<tr>` and `line-through` to name/surname cells when `active === false`.
- [x] 1.3 Update `UserTableProps` in `src/components/organisms/UserTable/UserTable.tsx` to match the new lifted-state contract.

## Phase 2: UserTable Component Logic

- [x] 2.1 Integrate `<Tab>` atom into `UserTable.tsx` header for "Operadores" and "Supervisores" selection.
- [x] 2.2 Implement inline pagination logic in `UserTable.tsx`: slice `users` based on `currentPage` and `pageSize=5`.
- [x] 2.3 Implement pagination UI: "Mostrando X a Y de Z usuarios" counter and page number buttons.
- [x] 2.4 Integrate search bar in `UserTable.tsx` calling `onSearch` from props.

## Phase 3: Page Integration & Mock Data

- [x] 3.1 Define typed mock datasets for Operators (5) and Supervisors (5) in `src/pages/UserPage.tsx`, ensuring at least one inactive user per group.
- [x] 3.2 Implement state lifting in `UserPage.tsx` for `activeTab`, `searchQuery`, and `currentPage`.
- [x] 3.3 Implement client-side filtering logic (Tab -> Search) in `UserPage.tsx`.
- [x] 3.4 Replace old layout in `UserPage.tsx`: remove `UserSectionTabs` and mount `UserTable` with the new filtered data and state handlers.

## Phase 4: Verification

- [ ] 4.1 Verify "Operadores" tab is active by default and switches to "Supervisores" update the data.
- [ ] 4.2 Verify search bar filters by ID, name, or legajo.
- [ ] 4.3 Verify pagination displays 5 rows and updates counter correctly.
- [ ] 4.4 Verify inactive users have reduced opacity and strikethrough effect.
