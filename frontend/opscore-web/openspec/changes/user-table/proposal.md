# Proposal: user-table

## Intent
Implement the user table in `UserPage` fed by mock data, switchable by active tab (Operadores / Supervisores).

## Scope

### In Scope
- Update `src/pages/UserPage.tsx` to handle tab state, search query, pagination, and inline mock data.
- Remove duplicate `UserSectionTabs` from the `UserPage` render tree.
- Upgrade `src/components/organisms/UserTable/UserTable.tsx` to integrate pagination functionality.
- Enhance `src/components/molecules/UserRow/UserRow.tsx` and `UserRowData` to include an `active` boolean and apply muted styles for inactive users.
- Provide mock data (5 operators + 5 supervisors, with at least 1 inactive user in each group).

### Out of Scope
- Real API integration.
- Extracting a generic/separate Pagination component (handled within UserTable).
- Implementing the Filter modal/panel logic.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `users`: Updating the user management page layout, tab structure, and table presentation (mock integration).

## Approach
- **State Lift**: Move tab state, search, and current page out of child components directly into `UserPage`, making it the single source of truth (Container Pattern).
- **Component Clean-up**: Strip out the duplicate `UserSectionTabs` from `UserPage` layout. 
- **Mock Data & Presentation**: Define inline mock data within `UserPage` (mimicking `IncidentPage` pattern). Pass filtered slices down to the `UserTable` and `UserRow` (Presentational Components), conditionally applying muted/disabled aesthetics if `active` is false.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/pages/UserPage.tsx` | Modified | Becomes container for state and mock data; removes duplicate tabs. |
| `src/components/organisms/UserTable/UserTable.tsx` | Modified | Adds pagination UI and logic. |
| `src/components/molecules/UserRow/UserRow.tsx` | Modified | Adds `active` state and corresponding muted styles. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Styling regressions from removing tabs | Low | Verify `UserPage` structure without the redundant component. |
| `UserTable` bloat from embedded pagination | Low | Keep the pagination UI simple within the render block of the table. |

## Rollback Plan
- Revert the commits touching `UserPage.tsx`, `UserTable.tsx`, and `UserRow.tsx`.

## Dependencies
- None

## Success Criteria
- [ ] `UserPage` renders tabs for "Operadores" and "Supervisores" driving data changes.
- [ ] `UserTable` correctly displays the mocked data and handles pagination.
- [ ] Inactive users render with a distinct muted style via `UserRow`.
- [ ] Duplicate tabs component is removed without breaking layout.