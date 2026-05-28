# Design: user-table

## Technical Approach

We will lift state management to the `UserPage` container, which will handle tab selection, search query, and current page. `UserTable` will be updated to handle inline pagination and utilize the existing `Tab` atom. We'll also enhance `UserRow` to visually distinguish inactive users and replace the existing layout with the new mock data.

## Architecture Decisions

### Decision: State Lifting to UserPage
**Choice**: Move `tab`, `searchQuery`, and `currentPage` states into `UserPage`.
**Alternatives considered**: Keeping state inside `UserTable` or using a global store like Zustand.
**Rationale**: `UserPage` acts as the natural container for data fetching (currently mock data) and filtering orchestration. Global state is overkill for page-specific UI state.

### Decision: Inline Pagination in UserTable
**Choice**: `UserTable` calculates `totalPages = Math.ceil(filtered.length / PAGE_SIZE)` and uses `.slice()` to display the current page. Shows text "Mostrando X a Y de Z usuarios".
**Alternatives considered**: Extracting a separate `Pagination` component.
**Rationale**: Keeping it inline reduces component fragmentation for simple pagination logic.

### Decision: Tab Rendering
**Choice**: Use the existing `<Tab>` atom (`src/components/atoms/Tab/Tab.tsx`) within `UserTable`'s header instead of native buttons or `UserSectionTabs`.
**Alternatives considered**: Keep `UserSectionTabs` at the page level.
**Rationale**: Aligns with the Atomic Design system in the project and simplifies the `UserPage` component.

### Decision: Inactive User Styling
**Choice**: Add `active?: boolean` to `UserRowData`. In `UserRow`, apply `opacity-50` to `<tr>` and `line-through` to name/surname cells when `active === false`.
**Alternatives considered**: Adding a "Status" badge.
**Rationale**: Visual cues on the row itself are quicker to scan and meet the specified requirements.

## Data Flow

    UserPage (holds mock data, state: tab, search, page)
         │
         ├── Applies filters: by tab → by search
         │
         └── Passes filtered data, page state ──→ UserTable
                                                      │
                                                      ├── Computes totalPages & slices data
                                                      ├── Renders Tab controls (calls onTabChange)
                                                      └── Renders UserRow items

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/pages/UserPage.tsx` | Modify | Add `tab`, `searchQuery`, `currentPage` states. Define typed mock data. Remove `UserSectionTabs`. Apply filtering (tab -> search) and pass to `UserTable`. |
| `src/components/organisms/UserTable/UserTable.tsx` | Modify | Update to use `<Tab>` atom. Add inline pagination logic (slice data based on `currentPage` prop). Display "Mostrando X a Y de Z usuarios" and pagination controls. |
| `src/components/molecules/UserRow/UserRow.tsx` | Modify | Add `active?: boolean` to `UserRowData` interface. Apply `opacity-50` on `<tr>` and `line-through` on first/last name if `!active`. |

## Interfaces / Contracts

```typescript
// src/components/molecules/UserRow/UserRow.tsx
export interface UserRowData {
  id: string;
  area: string;
  legajo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  active?: boolean;
}

// src/components/organisms/UserTable/UserTable.tsx
export interface UserTableProps {
  users: UserRowData[]; // Filtered users passed from UserPage
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onAddUser: () => void;
  onUserAction?: (id: string) => void;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Filtering & Pagination logic | Verify `UserPage` correctly filters data and `UserTable` slices the array correctly. |
| Unit | Conditional row styles | Mount `UserRow` with `active=false` and verify CSS classes `opacity-50` and `line-through`. |

## Migration / Rollout

No migration required. The mock data will be replaced with real API calls in future iterations.

## Open Questions

- [ ] Will we need selectable page sizes (e.g., 10, 20, 50) in the future? Hardcoding `PAGE_SIZE` for now.
